import { Injectable, Logger } from '@nestjs/common'
import fetch from 'node-fetch'
import * as fs from 'fs'
import * as path from 'path'
import * as crypto from 'crypto'
import { levenshtein } from './utils/levenshtein'

/**
 * Habibi-TTS — F5-TTS fine-tuné sur 12 dialectes arabes dont MAR (Marocain)
 * Repo HuggingFace : https://huggingface.co/ffatherdan/Habibi-TTS
 *
 * Modes de fonctionnement (par ordre de priorité) :
 *   1. Self-hosted  → HABIBI_TTS_URL = http://votre-serveur:7860
 *   2. HF Space     → HABIBI_TTS_URL = https://ffatherdan-habibi-tts.hf.space
 *   3. HF Inference → HUGGINGFACE_API_KEY défini (modèle fallback)
 */

const HABIBI_DIALECT = 'MAR'   // Moroccan Arabic
const CACHE_DIR_BASE = path.join(process.cwd(), 'public', 'audio')

@Injectable()
export class AudioService {
  private readonly logger = new Logger(AudioService.name)

  private habibUrl = process.env.HABIBI_TTS_URL?.replace(/\/$/, '') ?? ''
  private hfKey    = process.env.HUGGINGFACE_API_KEY ?? ''
  private hfModel  = process.env.HUGGINGFACE_TTS_MODEL ?? 'espnet/kan-bayashi_ljspeech_vits'

  // ──────────────────────────────────────────────
  //  PUBLIC API
  // ──────────────────────────────────────────────

  /**
   * Retourne le chemin absolu du fichier MP3 pour `text`.
   * Génère et met en cache si inexistant.
   */
  async ensureAudio(slug: string, text: string, subDir = 'vocab'): Promise<string> {
    const dir     = path.join(CACHE_DIR_BASE, subDir)
    const outPath = path.join(dir, `${slug}.mp3`)

    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true })
    if (fs.existsSync(outPath)) return outPath

    const result = await this.synthesize(text)
    if (!result?.buffer) throw new Error(`TTS generation failed for "${text}"`)

    fs.writeFileSync(outPath, result.buffer)
    this.logger.log(`[TTS] Cached: ${outPath}`)
    return outPath
  }

  /**
   * Génère l'audio pour `text` — essaie Habibi-TTS en priorité,
   * puis HuggingFace Inference API en fallback.
   */
  async synthesize(text: string): Promise<{ buffer: Buffer; contentType: string } | null> {
    if (this.habibUrl) {
      const result = await this.callHabibi(text)
      if (result) return result
    }
    if (this.hfKey) {
      const result = await this.callHuggingFace(text)
      if (result) return result
    }
    this.logger.warn('[TTS] No provider configured — set HABIBI_TTS_URL or HUGGINGFACE_API_KEY')
    return null
  }

  // ──────────────────────────────────────────────
  //  HABIBI-TTS (Gradio API)
  // ──────────────────────────────────────────────

  private async callHabibi(text: string): Promise<{ buffer: Buffer; contentType: string } | null> {
    try {
      /**
       * Habibi-TTS expose une API Gradio standard.
       * Endpoint : POST /run/predict
       * Payload  : { "data": [text, dialect_code] }
       *            dialect_code ∈ ["MAR","EGY","KSA","UAE","LEB","IRQ","TUN","LIB","YEM","SYR","KUW","BAH"]
       *
       * Réponse  : { "data": [{ "name": "...", "url": "..." }] }
       * L'audio est ensuite récupéré via GET /file=...
       */
      const predictRes = await (fetch as any)(`${this.habibUrl}/run/predict`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ data: [text, HABIBI_DIALECT] }),
        timeout: 30000,
      })

      if (!predictRes.ok) {
        this.logger.warn(`[Habibi-TTS] predict failed: ${predictRes.status}`)
        return null
      }

      const json = await predictRes.json() as any
      const audioData = json?.data?.[0]
      if (!audioData) return null

      // Cas 1 : data-URL base64 directement dans la réponse
      if (typeof audioData === 'string' && audioData.startsWith('data:audio')) {
        const base64 = audioData.split(',')[1]
        return { buffer: Buffer.from(base64, 'base64'), contentType: 'audio/wav' }
      }

      // Cas 2 : objet { name, path, url } — récupérer le fichier audio
      const filePath: string = audioData?.url ?? audioData?.path ?? audioData?.name ?? ''
      if (!filePath) return null

      const fileUrl = filePath.startsWith('http')
        ? filePath
        : `${this.habibUrl}/file=${filePath}`

      const fileRes = await (fetch as any)(fileUrl, { timeout: 20000 })
      if (!fileRes.ok) return null

      const arrayBuffer = await fileRes.arrayBuffer()
      return { buffer: Buffer.from(arrayBuffer), contentType: 'audio/wav' }

    } catch (err) {
      this.logger.error('[Habibi-TTS] Error', (err as Error)?.message)
      return null
    }
  }

  // ──────────────────────────────────────────────
  //  HUGGINGFACE INFERENCE API (fallback)
  // ──────────────────────────────────────────────

  private async callHuggingFace(text: string): Promise<{ buffer: Buffer; contentType: string } | null> {
    try {
      const url = `https://api-inference.huggingface.co/models/${this.hfModel}`
      const res = await (fetch as any)(url, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${this.hfKey}`,
          'Content-Type': 'application/json',
          Accept: 'audio/mpeg',
        },
        body: JSON.stringify({ inputs: text }),
        timeout: 30000,
      })

      if (!res.ok) {
        const txt = await res.text().catch(() => '')
        this.logger.warn(`[HuggingFace TTS] ${res.status}: ${txt}`)
        return null
      }

      const buffer = Buffer.from(await res.arrayBuffer())
      return { buffer, contentType: 'audio/mpeg' }
    } catch (err) {
      this.logger.error('[HuggingFace TTS] Error', (err as Error)?.message)
      return null
    }
  }

  // ──────────────────────────────────────────────
  //  ASR + PRONUNCIATION SCORE
  // ──────────────────────────────────────────────

  async transcribeBuffer(_buffer: Buffer, _mimetype = 'audio/wav'): Promise<string | null> {
    this.logger.warn('[ASR] No provider configured')
    return null
  }

  scorePronunciation(expectedText: string, transcription: string) {
    const a = (expectedText || '').trim().toLowerCase()
    const b = (transcription || '').trim().toLowerCase()
    const distance = levenshtein(a, b)
    const maxLen = Math.max(a.length, b.length, 1)
    const score = Math.round(Math.max(0, 100 - (distance / maxLen) * 100))

    const expectedWords = a.split(/\s+/).filter(Boolean)
    const actualWords   = b.split(/\s+/).filter(Boolean)
    const wordErrors: { expected?: string; actual?: string }[] = []
    const maxWords = Math.max(expectedWords.length, actualWords.length)
    for (let i = 0; i < maxWords; i++) {
      if (expectedWords[i] !== actualWords[i]) {
        wordErrors.push({ expected: expectedWords[i], actual: actualWords[i] })
      }
    }

    const suggestions: string[] = []
    if (score < 90) suggestions.push('Écoutez l\'audio lentement et répétez phrase par phrase.')
    if (score < 70) suggestions.push('Concentrez-vous sur les sons manquants ou les liaisons.')

    return { score, distance, wordErrors, suggestions }
  }

  // ──────────────────────────────────────────────
  //  UTILITAIRES STATIQUES
  // ──────────────────────────────────────────────

  /** Génère un slug de fichier stable (MD5 du texte) */
  static slug(text: string): string {
    return crypto.createHash('md5').update(text.trim().toLowerCase()).digest('hex').slice(0, 16)
  }

  /** URL publique relative du fichier audio mis en cache */
  static publicUrl(slug: string, subDir = 'vocab'): string {
    return `/audio/${subDir}/${slug}.mp3`
  }
}
