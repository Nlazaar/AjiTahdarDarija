export class CreateMessageDto {
  userId?: string
  message: string
  audio?: string // optional base64 or url
}
