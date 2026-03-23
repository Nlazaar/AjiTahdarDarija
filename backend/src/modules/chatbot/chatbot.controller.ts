import { Controller, Post, Body, HttpException, HttpStatus, Get, Query } from '@nestjs/common'
import { ChatbotService } from './chatbot.service'
import { CreateMessageDto } from './dto/create-message.dto'

@Controller('chatbot')
export class ChatbotController {
  constructor(private readonly chatbot: ChatbotService) {}

  @Post('message')
  async message(@Body() body: CreateMessageDto) {
    if (!body?.message) throw new HttpException('message is required', HttpStatus.BAD_REQUEST)
    const res = await this.chatbot.handleMessage(body.userId, body.message, body.audio)
    return res
  }

  @Get('history')
  async history(@Query('userId') userId: string, @Query('limit') limit?: string) {
    const l = limit ? parseInt(limit, 10) : 50
    return this.chatbot.getRecentMessages(userId, l)
  }
}
