import React from 'react'
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native'
import { Exercise } from '../../lib/exerciseTypes'

type Props = {
  exercise: Exercise
  onAnswer: (resp: { exerciseId: string; correct: boolean; response: any }) => void
}

export default function MultipleChoiceExercise({ exercise, onAnswer }: Props) {
  const mcq = exercise as any
  const [selected, setSelected] = React.useState<number | null>(null)

  function submit() {
    const correct = typeof mcq.correctIndex === 'number' ? selected === mcq.correctIndex : mcq.correctAnswer == mcq.options[selected ?? -1]
    onAnswer({ exerciseId: mcq.id, correct, response: selected })
  }

  return (
    <View>
      <Text style={styles.prompt}>{mcq.prompt ?? mcq.question}</Text>
      {(mcq.options || []).map((opt: string, i: number) => (
        <TouchableOpacity key={i} style={[styles.option, selected === i && styles.optionSelected]} onPress={() => setSelected(i)}>
          <Text style={styles.optionText}>{opt}</Text>
        </TouchableOpacity>
      ))}

      <TouchableOpacity disabled={selected === null} style={[styles.submit, selected === null && { opacity: 0.5 }]} onPress={submit}>
        <Text style={styles.submitText}>Valider</Text>
      </TouchableOpacity>
    </View>
  )
}

const styles = StyleSheet.create({
  prompt: { fontSize: 16, marginBottom: 8 },
  option: { padding: 12, backgroundColor: '#fff', borderRadius: 8, marginBottom: 8 },
  optionSelected: { borderWidth: 1, borderColor: '#06b6d4' },
  optionText: { color: '#111827' },
  submit: { marginTop: 8, backgroundColor: '#06b6d4', padding: 12, borderRadius: 8, alignItems: 'center' },
  submitText: { color: '#fff', fontWeight: '700' },
})
