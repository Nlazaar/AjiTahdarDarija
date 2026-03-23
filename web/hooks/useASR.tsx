import React from 'react'

const BASE = process.env.NEXT_PUBLIC_API_URL ?? ''

export default function useASR() {
  const [isRecording, setIsRecording] = React.useState(false)
  const [mediaRecorder, setMediaRecorder] = React.useState<MediaRecorder | null>(null)
  const [chunks, setChunks] = React.useState<BlobPart[]>([])
  const [transcription, setTranscription] = React.useState<string | null>(null)

  async function startRecording() {
    if (typeof navigator === 'undefined' || !navigator.mediaDevices) throw new Error('No media devices')
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
    const mr = new MediaRecorder(stream)
    setChunks([])
    mr.ondataavailable = (e) => setChunks((c) => c.concat(e.data))
    mr.start()
    setMediaRecorder(mr)
    setIsRecording(true)
  }

  function stopRecording() {
    if (!mediaRecorder) return
    mediaRecorder.stop()
    setIsRecording(false)
  }

  async function sendToBackend(): Promise<{ transcription?: string } | null> {
    if (chunks.length === 0) return null
    const blob = new Blob(chunks, { type: 'audio/webm' })
    const fd = new FormData()
    fd.append('file', blob, 'recording.webm')
    const res = await fetch(`${BASE}/audio/asr`, { method: 'POST', body: fd, credentials: 'include' })
    if (!res.ok) {
      const t = await res.text()
      throw new Error(`ASR error: ${res.status} ${t}`)
    }
    const data = await res.json()
    setTranscription(data.transcription)
    return data
  }

  return { isRecording, startRecording, stopRecording, sendToBackend, transcription }
}
