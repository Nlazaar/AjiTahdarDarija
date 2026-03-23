import React from 'react'
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native'
import { Exercise } from '../../lib/exerciseTypes'

type Props = {
  exercise: Exercise
  onAnswer: (resp: { exerciseId: string; correct: boolean; response: any }) => void
}

export default function FillInTheBlankExercise({ exercise, onAnswer }: Props) {
  const ex = exercise as any
  const blanks = ex.blanksCount || (ex.correctAnswers ? ex.correctAnswers.length : 1)
  const [values, setValues] = React.useState<string[]>(() => Array.from({ length: blanks }).map(() => ''))

  function setAt(i: number, v: string) {
    setValues((s) => {
      const copy = [...s]
      copy[i] = v
      return copy
    })
  }

  function submit() {
    const expected = ex.correctAnswers ? ex.correctAnswers.map((a: any) => a.toString().trim().toLowerCase()) : []
    const got = values.map((v) => v.toString().trim().toLowerCase())
    const correct = expected.length ? JSON.stringify(expected) === JSON.stringify(got) : false
    onAnswer({ exerciseId: ex.id, correct, response: values })
  }

  // render the text with inputs for blanks if textWithBlanks is provided, otherwise render inputs sequentially
  return (
    <View>
      <Text style={styles.prompt}>{ex.prompt ?? ex.textWithBlanks ?? ex.question}</Text>
      {Array.from({ length: blanks }).map((_, i) => (
        <TextInput key={i} placeholder={`Mot ${i + 1}`} value={values[i]} onChangeText={(t) => setAt(i, t)} style={styles.input} />
      ))}

      <TouchableOpacity style={styles.submit} onPress={submit}>
        <Text style={styles.submitText}>Valider</Text>
      </TouchableOpacity>
    </View>
  )
}

const styles = StyleSheet.create({
  prompt: { fontSize: 16, marginBottom: 8 },
  input: { backgroundColor: '#fff', padding: 12, borderRadius: 8, marginBottom: 8 },
  submit: { marginTop: 8, backgroundColor: '#06b6d4', padding: 12, borderRadius: 8, alignItems: 'center' },
  submitText: { color: '#fff', fontWeight: '700' },
})
