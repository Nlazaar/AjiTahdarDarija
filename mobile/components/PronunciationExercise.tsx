import React from 'react'
import { View, Text, Button } from 'react-native'
import useTTS from '../lib/useTTS'
import useASR from '../hooks/useASR'

export default function PronunciationExercise({ text }: { text: string }) {
  const tts = useTTS()
  const { isRecording, startRecording, stopRecording, sendToBackend, transcription } = useASR()
  const [score, setScore] = React.useState<number | null>(null)
  const [feedback, setFeedback] = React.useState<any | null>(null)

  async function handleRecordToggle() {
    if (!isRecording) {
      await startRecording()
    } else {
      const uri = await stopRecording()
      try {
        const res = await sendToBackend(uri)
        if (res?.transcription) {
          const api = process.env.EXPO_PUBLIC_API_URL ?? ''
          const r = await fetch(`${api}/audio/pronunciation-score`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ expectedText: text, transcription: res.transcription }) })
          const data = await r.json()
          setScore(data.score)
          setFeedback(data)
        }
      } catch (e) {
        // ignore
      }
    }
  }

  return (
    <View>
      <Text style={{ fontWeight: '700', marginBottom: 8 }}>{text}</Text>
      <View style={{ flexDirection: 'row', gap: 8 }}>
        <Button title="Écouter" onPress={() => tts.play(text)} />
        <Button title={isRecording ? 'Arrêter' : 'Parler'} onPress={handleRecordToggle} />
      </View>
      {transcription ? <Text>Transcription: {transcription}</Text> : null}
      {score !== null ? <Text>Score: {score}</Text> : null}
      {feedback ? <Text>{JSON.stringify(feedback)}</Text> : null}
    </View>
  )
}
