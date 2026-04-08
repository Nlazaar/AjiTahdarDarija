import {
  Controller, Get, Query, Res, Post, Body,
  UploadedFile, UseInterceptors, HttpException, HttpStatus, Param,
  Logger,
} from '@nestjs/common'
import { FileInterceptor } from '@nestjs/platform-express'
import { Response } from 'express'
import * as path from 'path'
import * as fs from 'fs'
import { AudioService } from './audio.service'
import { PronunciationScoreDto } from './dto/pronunciation-score.dto'

const PUBLIC_AUDIO = path.join(process.cwd(), 'public', 'audio')

@Controller('audio')
export class AudioController {
  private readonly logger = new Logger(AudioController.name)
  constructor(private readonly audioService: AudioService) {}

  /**
   * GET /audio/tts?text=مرحبا
   * Retourne un MP3 :
   *   1. Depuis le cache disque si déjà généré
   *   2. Génère via Habibi-TTS et met en cache
   *   3. 501 si aucun provider configuré
   *
   * Cache-Control: 7 jours — le slug est déterministe (MD5 du texte)
   */
  @Get('tts')
  async tts(@Query('text') text: string, @Res() res: Response) {
    if (!text) throw new HttpException('text is required', HttpStatus.BAD_REQUEST)

    const slug    = AudioService.slug(text)
    const subDir  = 'tts'
    const dir     = path.join(PUBLIC_AUDIO, subDir)
    const mp3Path = path.join(dir, `${slug}.mp3`)

    // Servir depuis le cache disque si disponible
    if (fs.existsSync(mp3Path)) {
      res.setHeader('Cache-Control', 'public, max-age=604800')
      res.setHeader('Content-Type', 'audio/mpeg')
      return res.sendFile(mp3Path)
    }

    // Générer via Habibi-TTS
    const out = await this.audioService.synthesize(text)
    if (!out) {
      throw new HttpException(
        'TTS provider not configured — set HABIBI_TTS_URL or HUGGINGFACE_API_KEY',
        HttpStatus.NOT_IMPLEMENTED,
      )
    }

    // Mettre en cache
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true })
    fs.writeFileSync(mp3Path, out.buffer)
    this.logger.log(`[TTS] Generated + cached: ${slug}`)

    res.setHeader('Cache-Control', 'public, max-age=604800')
    res.setHeader('Content-Type', out.contentType ?? 'audio/mpeg')
    return res.send(out.buffer)
  }

  /**
   * GET /audio/vocab/:slug
   * Sert un fichier audio pré-généré du vocabulaire.
   * Utilisé par le script de pré-génération.
   */
  @Get('vocab/:slug')
  async serveVocab(@Param('slug') slug: string, @Res() res: Response) {
    // Sécurité : empêcher path traversal
    if (!/^[a-f0-9]{16}$/.test(slug)) {
      throw new HttpException('Invalid slug', HttpStatus.BAD_REQUEST)
    }
    const filePath = path.join(PUBLIC_AUDIO, 'vocab', `${slug}.mp3`)
    if (!fs.existsSync(filePath)) {
      throw new HttpException('Audio not found', HttpStatus.NOT_FOUND)
    }
    res.setHeader('Cache-Control', 'public, max-age=2592000') // 30 jours
    res.setHeader('Content-Type', 'audio/mpeg')
    return res.sendFile(filePath)
  }

  /**
   * GET /audio/alphabet/:key
   * Retro-compat — génère/sert l'audio d'une lettre de l'alphabet
   */
  @Get('alphabet/:key')
  async getAlphabetAudio(@Param('key') key: string, @Res() res: Response) {
    // Sécurité basique sur le nom de fichier
    const safeKey = key.replace(/[^a-zA-Z0-9_-]/g, '_').slice(0, 50)
    try {
      await this.audioService.ensureAudio(safeKey, key, 'alphabet')
      const filePath = path.join(PUBLIC_AUDIO, 'alphabet', `${safeKey}.mp3`)
      res.setHeader('Cache-Control', 'public, max-age=2592000')
      return res.sendFile(filePath)
    } catch {
      throw new HttpException('Audio generation failed', HttpStatus.INTERNAL_SERVER_ERROR)
    }
  }

  // ── ASR ──────────────────────────────────────────────────────────

  @Post('asr')
  @UseInterceptors(FileInterceptor('file'))
  async asr(@UploadedFile() file: Express.Multer.File, @Body() body: { base64?: string; mimetype?: string }) {
    let transcript: string | null = null
    if (file) {
      transcript = await this.audioService.transcribeBuffer(file.buffer, file.mimetype)
    } else if (body?.base64) {
      const buf = Buffer.from(body.base64, 'base64')
      transcript = await this.audioService.transcribeBuffer(buf, body.mimetype ?? 'audio/wav')
    } else {
      throw new HttpException('No audio provided', HttpStatus.BAD_REQUEST)
    }
    return { transcription: transcript }
  }

  // ── Score prononciation ───────────────────────────────────────────

  @Post('pronunciation-score')
  @UseInterceptors(FileInterceptor('file'))
  async pronunciationScore(
    @UploadedFile() file: Express.Multer.File,
    @Body() body: PronunciationScoreDto,
  ) {
    if (!body?.expectedText) {
      throw new HttpException('expectedText is required', HttpStatus.BAD_REQUEST)
    }

    let transcription = body.transcription ?? null
    if (!transcription) {
      if (file) {
        transcription = await this.audioService.transcribeBuffer(file.buffer, file.mimetype)
      } else if (body.userAudio) {
        const buf = Buffer.from(body.userAudio, 'base64')
        transcription = await this.audioService.transcribeBuffer(buf, body.mimetype ?? 'audio/wav')
      }
    }

    const score = this.audioService.scorePronunciation(body.expectedText, transcription ?? '')
    return { transcription, ...score }
  }
}
