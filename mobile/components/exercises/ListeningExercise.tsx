import React from 'react'
import { View, Text, TouchableOpacity, TextInput, StyleSheet } from 'react-native'
import { Audio } from 'expo-av'
import { Exercise } from '../../lib/exerciseTypes'

type Props = {
  exercise: Exercise
  onAnswer: (resp: { exerciseId: string; correct: boolean; response: any }) => void
}

export default function ListeningExercise({ exercise, onAnswer }: Props) {
  const ex = exercise as any
  const [value, setValue] = React.useState('')
  const soundRef = React.useRef<any>(null)

  async function play() {
    try {
      if (soundRef.current) {
        await soundRef.current.replayAsync()
        return
      }
      const { sound } = await Audio.Sound.createAsync({ uri: ex.audioUrl })
      soundRef.current = sound
      await sound.playAsync()
    } catch (e) {
      // ignore
    }
  }

  function submit() {
    const expected = (ex.correctAnswer || '').toString().trim().toLowerCase()
    const got = value.toString().trim().toLowerCase()
    const correct = expected ? expected === got : false
    onAnswer({ exerciseId: ex.id, correct, response: value })
  }

  return (
    <View>
      <Text style={styles.prompt}>{ex.prompt ?? ex.question}</Text>
      <TouchableOpacity style={styles.play} onPress={play}><Text>▶️ Écouter</Text></TouchableOpacity>
      <TextInput value={value} onChangeText={setValue} style={styles.input} placeholder="Écrivez ce que vous entendez" />
      <TouchableOpacity style={styles.submit} onPress={submit}><Text style={styles.submitText}>Valider</Text></TouchableOpacity>
    </View>
  )
}

const styles = StyleSheet.create({
  prompt: { fontSize: 16, marginBottom: 8 },
  play: { padding: 12, backgroundColor: '#fff', borderRadius: 8, alignItems: 'center', marginBottom: 8 },
  input: { backgroundColor: '#fff', padding: 12, borderRadius: 8 },
  submit: { marginTop: 8, backgroundColor: '#06b6d4', padding: 12, borderRadius: 8, alignItems: 'center' },
  submitText: { color: '#fff', fontWeight: '700' },
})
