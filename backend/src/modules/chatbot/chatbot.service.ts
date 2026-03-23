import { Injectable, Logger } from '@nestjs/common'
import { PrismaService } from '../../prisma/prisma.service'
import { AudioService } from '../../audio/audio.service'

@Injectable()
export class ChatbotService {
  private readonly logger = new Logger(ChatbotService.name)
  constructor(private prisma: PrismaService, private audioService: AudioService) {}

  // Store message and generate a simple reply + corrections
  async handleMessage(userId: string | undefined, message: string, audioBase64?: string) {
    // store user message
    const userMsg = await this.prisma.conversationMessage.create({ data: { userId: userId || null, role: 'user', text: message } })

    // Simple analysis: detect common errors (very naive): repeated spaces, non-letter tokens
    const corrections: Array<{ error: string; expected: string; explanation: string }> = []
    if (/\s{2,}/.test(message)) {
      corrections.push({ error: 'Espaces multiples', expected: message.replace(/\s{2,}/g, ' '), explanation: 'Supprimez les espaces en trop entre les mots.' })
    }

    // Suggest alternatives: echo + small variants
    const suggestions = [message, `${message} (parfait)`, `Je dirais: ${message}`].slice(0, 3)

    // Difficulty heuristic: short messages -> A1, longer -> B1
    const difficultyLevel = message.length < 40 ? 'A1' : 'B1'

    // Reply generation: simple templated reply for now
    const replyText = `Je vous entends — vous avez dit: "${message}". Voici une suggestion.`

    const botMsg = await this.prisma.conversationMessage.create({ data: { userId: userId || null, role: 'bot', text: replyText } })

    // Optionally produce TTS if audio requested (AudioService.synthesize must be implemented)
    let replyAudioUrl: string | null = null
    try {
      const tts = await this.audioService.synthesize(replyText)
      if (tts && tts.buffer) {
        // In this scaffold we won't persist the buffer; in prod we'd upload to storage (S3) and return URL
        replyAudioUrl = null
      }
    } catch (e) {
      this.logger.warn('TTS generation failed or not configured')
    }

    return { replyText, replyAudioUrl, suggestions, corrections, difficultyLevel }
  }

  async getRecentMessages(userId: string | undefined, limit = 50) {
    return this.prisma.conversationMessage.findMany({ where: { userId: userId || undefined }, orderBy: { createdAt: 'desc' }, take: limit })
  }
}
