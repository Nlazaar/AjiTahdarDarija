import React from 'react'
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native'
import { Exercise } from '../../lib/exerciseTypes'

type Props = {
  exercise: Exercise
  onAnswer: (resp: { exerciseId: string; correct: boolean; response: any }) => void
}

export default function WordOrderExercise({ exercise, onAnswer }: Props) {
  const ex = exercise as any
  const [shuffled, setShuffled] = React.useState<string[]>(() => (ex.words || []).slice())
  const [chosen, setChosen] = React.useState<string[]>([])

  React.useEffect(() => {
    // simple shuffle
    const arr = (ex.words || []).slice()
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1))
      ;[arr[i], arr[j]] = [arr[j], arr[i]]
    }
    setShuffled(arr)
  }, [ex.words])

  function pick(word: string) {
    setChosen((c) => [...c, word])
    setShuffled((s) => s.filter((w) => w !== word))
  }

  function removeLast() {
    setChosen((c) => {
      const copy = c.slice()
      const last = copy.pop()
      if (last) setShuffled((s) => [...s, last])
      return copy
    })
  }

  function submit() {
    const correct = Array.isArray(ex.correctOrder) ? JSON.stringify(chosen) === JSON.stringify(ex.correctOrder) : false
    onAnswer({ exerciseId: ex.id, correct, response: chosen })
  }

  return (
    <View>
      <Text style={styles.prompt}>{ex.prompt ?? ex.question}</Text>

      <View style={styles.chosenContainer}>
        <Text style={{ marginBottom: 4 }}>Votre ordre:</Text>
        <View style={styles.chips}>
          {chosen.map((w, i) => (
            <View key={i} style={styles.chip}><Text>{w}</Text></View>
          ))}
        </View>
        <TouchableOpacity onPress={removeLast} style={styles.action}><Text>Retirer dernier</Text></TouchableOpacity>
      </View>

      <Text style={{ marginTop: 8, marginBottom: 4 }}>Mots disponibles</Text>
      <View style={styles.chips}>
        {shuffled.map((w, i) => (
          <TouchableOpacity key={i} style={styles.chipButton} onPress={() => pick(w)}>
            <Text>{w}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <TouchableOpacity style={styles.submit} onPress={submit}>
        <Text style={styles.submitText}>Valider</Text>
      </TouchableOpacity>
    </View>
  )
}

const styles = StyleSheet.create({
  prompt: { fontSize: 16, marginBottom: 8 },
  chosenContainer: { marginBottom: 8 },
  chips: { flexDirection: 'row', flexWrap: 'wrap', gap: 6 },
  chip: { padding: 8, backgroundColor: '#fff', borderRadius: 6, marginRight: 6, marginBottom: 6 },
  chipButton: { padding: 8, backgroundColor: '#fff', borderRadius: 6, marginRight: 6, marginBottom: 6 },
  action: { marginTop: 6 },
  submit: { marginTop: 12, backgroundColor: '#06b6d4', padding: 12, borderRadius: 8, alignItems: 'center' },
  submitText: { color: '#fff', fontWeight: '700' },
})
