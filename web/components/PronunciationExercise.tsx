import React from 'react'
import useTTS from '../lib/useTTS'
import useASR from '../hooks/useASR'

export default function PronunciationExercise({ text }: { text: string }) {
  const tts = useTTS()
  const { isRecording, startRecording, stopRecording, sendToBackend, transcription } = useASR()
  const [score, setScore] = React.useState<number | null>(null)
  const [feedback, setFeedback] = React.useState<any>(null)

  async function handleSpeak() {
    tts.play(text)
  }

  async function handleRecord() {
    if (!isRecording) {
      await startRecording()
    } else {
      stopRecording()
      try {
        const res = await sendToBackend()
        if (res?.transcription) {
          // send to pronunciation-score
          const base = process.env.NEXT_PUBLIC_API_URL ?? ''
          const body = { expectedText: text, transcription: res.transcription }
          const r = await fetch(`${base}/audio/pronunciation-score`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body), credentials: 'include' })
          const data = await r.json()
          setScore(data.score)
          setFeedback(data)
        }
      } catch (e) {
        // ignore for now
      }
    }
  }

  return (
    <div>
      <div style={{ marginBottom: 8 }}>
        <strong>Phrase:</strong> {text}
      </div>
      <div style={{ display: 'flex', gap: 8 }}>
        <button onClick={handleSpeak}>Écouter</button>
        <button onClick={handleRecord}>{isRecording ? 'Arrêter' : 'Parler'}</button>
      </div>

      {transcription ? (
        <div>
          <div>Transcription: {transcription}</div>
          <div>Score: {score ?? '—'}</div>
        </div>
      ) : null}

      {feedback ? (
        <div>
          <pre style={{ whiteSpace: 'pre-wrap' }}>{JSON.stringify(feedback, null, 2)}</pre>
        </div>
      ) : null}
    </div>
  )
}
