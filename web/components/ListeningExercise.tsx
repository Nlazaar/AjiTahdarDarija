import React from 'react'
import { useAudio } from '../hooks/useAudio'

export default function ListeningExercise({ text, onAnswer }: { text: string; onAnswer?: (answer: string) => void }) {
  const { speak } = useAudio()
  const [answer, setAnswer] = React.useState('')

  return (
    <div>
      <div style={{ marginBottom: 8 }}>
        <button onClick={() => speak(text)}>Écouter</button>
      </div>
      <div>
        <input value={answer} onChange={e => setAnswer(e.target.value)} placeholder="Écrivez ce que vous entendez" />
        <button onClick={() => onAnswer?.(answer)}>Valider</button>
      </div>
    </div>
  )
}
