import React from 'react'
import { View, Text, TextInput, Button } from 'react-native'
import useTTS from '../lib/useTTS'

export default function ListeningExercise({ text, onAnswer }: { text: string; onAnswer?: (ans: string) => void }) {
  const tts = useTTS()
  const [answer, setAnswer] = React.useState('')

  function handlePlay() {
    tts.play(text)
  }

  function submit() {
    if (onAnswer) onAnswer(answer)
  }

  return (
    <View>
      <Button title="Écouter" onPress={handlePlay} />
      <TextInput value={answer} onChangeText={setAnswer} placeholder="Écrivez ce que vous entendez" />
      <Button title="Valider" onPress={submit} />
    </View>
  )
}
