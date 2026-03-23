import React from 'react'
import useTTS from '../lib/useTTS'

export default function ListeningExercise({ text, onAnswer }: { text: string; onAnswer?: (answer: string) => void }) {
  const tts = useTTS()
  const [answer, setAnswer] = React.useState('')

  function handlePlay() {
    tts.play(text)
  }

  function submit() {
    if (onAnswer) onAnswer(answer)
  }

  return (
    <div>
      <div style={{ marginBottom: 8 }}>
        <button onClick={handlePlay}>Écouter</button>
      </div>
      <div>
        <input value={answer} onChange={(e) => setAnswer(e.target.value)} placeholder="Écrivez ce que vous entendez" />
        <button onClick={submit}>Valider</button>
      </div>
    </div>
  )
}
