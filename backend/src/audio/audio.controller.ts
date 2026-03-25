import { Controller, Get, Query, Res, Post, Body, UploadedFile, UseInterceptors, HttpException, HttpStatus, Param } from '@nestjs/common'
import { FileInterceptor } from '@nestjs/platform-express'
import { Response } from 'express'
import { AudioService } from './audio.service'
import { PronunciationScoreDto } from './dto/pronunciation-score.dto'
import * as path from 'path'

@Controller('audio')
export class AudioController {
  constructor(private readonly audioService: AudioService) {}

  // Serve or generate cached alphabet audio
  @Get('alphabet/:key')
  async getAlphabetAudio(@Param('key') key: string, @Res() res: Response) {
    try {
      const text = key
      await this.audioService.ensureAudio(key, text)
      const filePath = path.join(process.cwd(), 'public', 'audio', 'alphabet', `${key}.mp3`)
      return res.sendFile(filePath)
    } catch (err) {
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ error: 'audio_error' })
    }
  }

  @Get('tts')
  async tts(@Query('text') text: string, @Res() res: Response) {
    if (!text) throw new HttpException('Missing text query', HttpStatus.BAD_REQUEST)
    const out = await this.audioService.synthesize?.(text)
    if (!out) throw new HttpException('TTS provider not configured', HttpStatus.NOT_IMPLEMENTED)
    res.setHeader('Content-Type', out.contentType || 'audio/mpeg')
    res.send(out.buffer)
  }

  @Post('asr')
  @UseInterceptors(FileInterceptor('file'))
  async asr(@UploadedFile() file: any, @Body() body: any) {
    if (file) {
      const transcript = await this.audioService.transcribeBuffer?.(file.buffer, file.mimetype)
      return { transcription: transcript }
    }
    if (body?.base64) {
      const buf = Buffer.from(body.base64, 'base64')
      const transcript = await this.audioService.transcribeBuffer?.(buf, body.mimetype || 'audio/wav')
      return { transcription: transcript }
    }
    throw new HttpException('No audio provided', HttpStatus.BAD_REQUEST)
  }

  @Post('pronunciation-score')
  @UseInterceptors(FileInterceptor('file'))
  async pronunciationScore(@UploadedFile() file: any, @Body() body: PronunciationScoreDto) {
    if (!body?.expectedText) throw new HttpException('expectedText is required', HttpStatus.BAD_REQUEST)

    let transcription = body.transcription
    if (!transcription) {
      if (file) transcription = await this.audioService.transcribeBuffer?.(file.buffer, file.mimetype)
      else if (body.userAudio) transcription = await this.audioService.transcribeBuffer?.(Buffer.from(body.userAudio, 'base64'), body.mimetype || 'audio/wav')
    }

    if (!transcription) {
      const partial = this.audioService.scorePronunciation?.(body.expectedText, '')
      return { transcription: null, provider: null, ...partial }
    }

    const score = this.audioService.scorePronunciation?.(body.expectedText, transcription)
    return { transcription, provider: null, ...score }
  }
}
