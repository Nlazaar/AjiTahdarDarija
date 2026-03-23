import { Injectable, Logger } from '@nestjs/common'
import fetch from 'node-fetch'
import * as fs from 'fs'
import * as path from 'path'
import { levenshtein } from './utils/levenshtein'

@Injectable()
export class AudioService {
  private readonly logger = new Logger(AudioService.name)
  private hfKey = process.env.HUGGINGFACE_API_KEY || ''
  private model = process.env.HUGGINGFACE_TTS_MODEL || 'google/flan-t5-small'

  // Ensure a cached MP3 exists for the given letter key; generate via HF if missing
  async ensureAudio(letterKey: string, text: string): Promise<string> {
    const outDir = path.join(process.cwd(), 'public', 'audio', 'alphabet')
    if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true })
    const outPath = path.join(outDir, `${letterKey}.mp3`)
    if (fs.existsSync(outPath)) return outPath

    if (!this.hfKey) {
      this.logger.warn('HUGGINGFACE_API_KEY not set, skipping generation')
      throw new Error('No Hugging Face API key')
    }

    const payload = await this.synthesize(text)
    if (!payload || !payload.buffer) throw new Error('TTS generation failed')
    fs.writeFileSync(outPath, payload.buffer)
    this.logger.log(`Saved TTS to ${outPath}`)
    return outPath
  }

  // Synthesize text to audio via Hugging Face (if configured)
  async synthesize(text: string): Promise<{ buffer: Buffer; contentType?: string } | null> {
    if (!this.hfKey) {
      this.logger.warn('synthesize() called but HUGGINGFACE_API_KEY not set')
      return null
    }

    const url = `https://api-inference.huggingface.co/models/${this.model}`
    this.logger.log(`Requesting TTS from ${this.model}`)
    const res = await fetch(url, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${this.hfKey}`,
        Accept: 'audio/mpeg',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ inputs: text }),
    })

    if (!res.ok) {
      const txt = await res.text().catch(() => '')
      this.logger.error(`HuggingFace TTS failed: ${res.status} ${txt}`)
      return null
    }

    const arrayBuffer = await res.arrayBuffer()
    const buffer = Buffer.from(arrayBuffer)
    return { buffer, contentType: 'audio/mpeg' }
  }

  // Transcribe audio buffer using configured ASR provider. Return transcription string or null.
  async transcribeBuffer(buffer: Buffer, mimetype = 'audio/wav'): Promise<string | null> {
    this.logger.warn('ASR requested but no provider implemented. Configure an ASR provider to enable transcribeBuffer().')
    return null
  }

  // Score pronunciation by comparing expected vs actual transcription.
  scorePronunciation(expectedText: string, transcription: string) {
    const a = (expectedText || '').trim().toLowerCase()
    const b = (transcription || '').trim().toLowerCase()
    const distance = levenshtein(a, b)
    const maxLen = Math.max(a.length, b.length, 1)
    let score = Math.round(Math.max(0, 100 - (distance / maxLen) * 100))

    const expectedWords = a.split(/\s+/).filter(Boolean)
    const actualWords = b.split(/\s+/).filter(Boolean)
    const wordErrors: { expected?: string; actual?: string }[] = []
    const maxWords = Math.max(expectedWords.length, actualWords.length)
    for (let i = 0; i < maxWords; i++) {
      if (expectedWords[i] !== actualWords[i]) {
        wordErrors.push({ expected: expectedWords[i], actual: actualWords[i] })
      }
    }

    const suggestions: string[] = []
    if (score < 90) suggestions.push('Écoutez l’audio lentement et répétez phrase par phrase.')
    if (score < 70) suggestions.push('Concentrez-vous sur les sons manquants ou les liaisons.')

    return { score, distance, wordErrors, suggestions }
  }
}
