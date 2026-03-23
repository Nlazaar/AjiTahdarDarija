import React from 'react'
import { View, Text, Button, StyleSheet } from 'react-native'

type Props = {
  score: number
  total: number
  errors: Array<{ id: string; expected?: any; got?: any }>
  message?: string
  onBack?: () => void
}

export default function ReviewResult({ score, total, errors, message, onBack }: Props) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Révision terminée</Text>
      <Text style={styles.score}>{`${score} / ${total}`}</Text>
      <Text style={styles.msg}>{message ?? 'Bravo — continue comme ça !'}</Text>

      {errors.length > 0 && (
        <View style={styles.errors}>
          <Text style={styles.errorTitle}>À retravailler</Text>
          {errors.map((e) => (
            <View key={e.id} style={styles.errorItem}>
              <Text>{e.id}</Text>
              <Text>{`Attendu: ${String(e.expected ?? '')}`}</Text>
              <Text>{`Vous: ${String(e.got ?? '')}`}</Text>
            </View>
          ))}
        </View>
      )}

      <View style={styles.actions}>
        <Button title="Retour" onPress={() => onBack && onBack()} />
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: { padding: 16 },
  title: { fontSize: 20, fontWeight: '700', marginBottom: 8 },
  score: { fontSize: 28, fontWeight: '800', marginBottom: 8 },
  msg: { marginBottom: 12 },
  errors: { marginTop: 8 },
  errorTitle: { fontWeight: '700', marginBottom: 6 },
  errorItem: { backgroundColor: '#fff', padding: 8, borderRadius: 6, marginBottom: 6 },
  actions: { marginTop: 12 },
})
