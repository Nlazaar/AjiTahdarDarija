import React from 'react'
import { useAudio } from '../hooks/useAudio'
import { useASR } from '../hooks/useASR'

export default function PronunciationExercise({ text }: { text: string }) {
  const { speak } = useAudio()
  const { state: asrState, start, stop, supported } = useASR()
  const [transcription, setTranscription] = React.useState<string | null>(null)
  const [score, setScore] = React.useState<number | null>(null)
  const [feedback, setFeedback] = React.useState<any>(null)

  const isRecording = asrState === 'listening'

  async function handleRecord() {
    if (isRecording) {
      stop()
      return
    }

    setTranscription(null)
    setScore(null)
    setFeedback(null)

    start(async (result) => {
      setTranscription(result)
      try {
        const base = process.env.NEXT_PUBLIC_API_URL ?? ''
        const body = { expectedText: text, transcription: result }
        const r = await fetch(`${base}/audio/pronunciation-score`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(body),
          credentials: 'include',
        })
        if (r.ok) {
          const data = await r.json()
          setScore(data.score)
          setFeedback(data)
        }
      } catch {
        // score non disponible — afficher juste la transcription
      }
    })
  }

  return (
    <div>
      <div style={{ marginBottom: 8 }}>
        <strong>Phrase:</strong> {text}
      </div>
      <div style={{ display: 'flex', gap: 8 }}>
        <button onClick={() => speak(text)}>Écouter</button>
        {supported
          ? <button onClick={handleRecord}>{isRecording ? 'Arrêter' : 'Parler'}</button>
          : <span style={{ fontSize: 12, color: 'gray' }}>Micro non supporté</span>
        }
      </div>

      {transcription && (
        <div>
          <div>Transcription : {transcription}</div>
          <div>Score : {score ?? '—'}</div>
        </div>
      )}

      {feedback && (
        <div>
          <pre style={{ whiteSpace: 'pre-wrap' }}>{JSON.stringify(feedback, null, 2)}</pre>
        </div>
      )}
    </div>
  )
}
