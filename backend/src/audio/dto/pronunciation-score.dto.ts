export class PronunciationScoreDto {
  expectedText: string
  // optional: pre-transcribed text to score (if client can transcribe locally)
  transcription?: string
  // optional: base64 encoded audio if sending inline
  userAudio?: string
  mimetype?: string
}
