import React from 'react'
import { View, Text, Button, StyleSheet } from 'react-native'

type Props = {
  score: number
  total: number
  errors: Array<{ exerciseId: string; expected?: any; got?: any }>
  xpGained?: number
  onBack?: () => void
}

export default function LessonResult({ score, total, errors, xpGained = 0, onBack }: Props) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Résultat</Text>
      <Text style={styles.score}>{`${score} / ${total}`}</Text>
      <Text style={styles.xp}>{`XP gagné: ${xpGained}`}</Text>

      {errors.length > 0 ? (
        <View style={styles.errors}>
          <Text style={styles.errorTitle}>Erreurs</Text>
          {errors.map((e) => (
            <View key={e.exerciseId} style={styles.errorItem}>
              <Text style={{ fontWeight: '600' }}>{e.exerciseId}</Text>
              <Text>{`Attendu: ${String(e.expected ?? '')}`}</Text>
              <Text>{`Votre réponse: ${String(e.got ?? '')}`}</Text>
            </View>
          ))}
        </View>
      ) : (
        <Text style={styles.noErrors}>Aucune erreur — bravo 🎉</Text>
      )}

      <View style={styles.actions}>
        <Button title="Retour aux leçons" onPress={() => onBack && onBack()} />
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: { padding: 16 },
  title: { fontSize: 22, fontWeight: '700', marginBottom: 8 },
  score: { fontSize: 28, fontWeight: '800', marginBottom: 8 },
  xp: { fontSize: 16, marginBottom: 12 },
  errors: { marginTop: 8 },
  errorTitle: { fontSize: 16, fontWeight: '700', marginBottom: 6 },
  errorItem: { backgroundColor: '#fff', padding: 8, borderRadius: 6, marginBottom: 6 },
  noErrors: { color: '#10b981' },
  actions: { marginTop: 16 },
})
