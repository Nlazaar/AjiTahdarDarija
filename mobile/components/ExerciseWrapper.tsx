import React from 'react'
import { View, Text, StyleSheet } from 'react-native'

type Props = {
  children: React.ReactNode
  current: number
  total: number
  title?: string
}

export default function ExerciseWrapper({ children, current, total, title }: Props) {
  const progress = total > 0 ? (current + 1) / total : 0
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.index}>{`Exercice ${current + 1} / ${total}`}</Text>
        {title ? <Text style={styles.title}>{title}</Text> : null}
      </View>

      <View style={styles.progressBarBackground}>
        <View style={[styles.progressBarFill, { width: `${Math.round(progress * 100)}%` }]} />
      </View>

      <View style={styles.body}>{children}</View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: { marginVertical: 12 },
  header: { marginBottom: 8 },
  index: { color: '#6b7280', fontSize: 12 },
  title: { fontSize: 16, fontWeight: '600', marginTop: 4 },
  progressBarBackground: { height: 8, backgroundColor: '#e5e7eb', borderRadius: 8, overflow: 'hidden', marginTop: 8 },
  progressBarFill: { height: '100%', backgroundColor: '#06b6d4' },
  body: { marginTop: 12 },
})
