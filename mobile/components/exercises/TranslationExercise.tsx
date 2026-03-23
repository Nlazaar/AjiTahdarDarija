import React from 'react'
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native'
import { Exercise } from '../../lib/exerciseTypes'

type Props = {
  exercise: Exercise
  onAnswer: (resp: { exerciseId: string; correct: boolean; response: any }) => void
}

export default function TranslationExercise({ exercise, onAnswer }: Props) {
  const tx = exercise as any
  const [value, setValue] = React.useState('')

  function submit() {
    const expected = (tx.correctAnswer || tx.target || '').toString().trim().toLowerCase()
    const got = value.toString().trim().toLowerCase()
    const correct = expected ? expected === got : false
    onAnswer({ exerciseId: tx.id, correct, response: value })
  }

  return (
    <View>
      <Text style={styles.prompt}>{tx.prompt ?? tx.source ?? tx.question}</Text>
      <TextInput value={value} onChangeText={setValue} style={styles.input} placeholder="Votre traduction" />
      <TouchableOpacity style={styles.submit} onPress={submit}>
        <Text style={styles.submitText}>Valider</Text>
      </TouchableOpacity>
    </View>
  )
}

const styles = StyleSheet.create({
  prompt: { fontSize: 16, marginBottom: 8 },
  input: { backgroundColor: '#fff', padding: 12, borderRadius: 8 },
  submit: { marginTop: 8, backgroundColor: '#06b6d4', padding: 12, borderRadius: 8, alignItems: 'center' },
  submitText: { color: '#fff', fontWeight: '700' },
})
