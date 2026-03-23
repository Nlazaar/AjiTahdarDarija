import React from 'react'
import { View, Text, StyleSheet, Button } from 'react-native'

type Props = {
  children: React.ReactNode
  current: number
  total: number
  title?: string
  onDontKnow?: () => void
}

export default function ReviewExerciseWrapper({ children, current, total, title, onDontKnow }: Props) {
  const progress = total > 0 ? (current + 1) / total : 0
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.index}>{`Révision ${current + 1} / ${total}`}</Text>
        {title ? <Text style={styles.title}>{title}</Text> : null}
      </View>

      <View style={styles.progressBarBackground}>
        <View style={[styles.progressBarFill, { width: `${Math.round(progress * 100)}%` }]} />
      </View>

      <View style={styles.body}>{children}</View>

      <View style={styles.actions}>
        <Button title="Je ne sais pas" onPress={() => onDontKnow && onDontKnow()} />
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: { marginVertical: 12 },
  header: { marginBottom: 8 },
  index: { color: '#6b7280', fontSize: 12 },
  title: { fontSize: 16, fontWeight: '600', marginTop: 4 },
  progressBarBackground: { height: 8, backgroundColor: '#e5e7eb', borderRadius: 8, overflow: 'hidden', marginTop: 8 },
  progressBarFill: { height: '100%', backgroundColor: '#f97316' },
  body: { marginTop: 12 },
  actions: { marginTop: 12 },
})
