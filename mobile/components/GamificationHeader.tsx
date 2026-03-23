import React from 'react'
import { View, Text, StyleSheet } from 'react-native'
import useGamification from '../hooks/useGamification'

type Props = {
  compact?: boolean
}

export default function GamificationHeader({ compact = false }: Props) {
  const { xp, level, streak, hearts } = useGamification()
  return (
    <View style={[styles.container, compact && styles.compact]}>
      <View style={styles.item}>
        <Text style={styles.label}>XP</Text>
        <Text style={styles.value}>{xp}</Text>
      </View>
      <View style={styles.item}>
        <Text style={styles.label}>Niveau</Text>
        <Text style={styles.value}>{level}</Text>
      </View>
      <View style={styles.item}>
        <Text style={styles.label}>Streak</Text>
        <Text style={styles.value}>{streak}</Text>
      </View>
      <View style={styles.item}>
        <Text style={styles.label}>Cœurs</Text>
        <Text style={styles.value}>{hearts}</Text>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: { flexDirection: 'row', gap: 12, alignItems: 'center' },
  compact: { gap: 8 },
  item: { alignItems: 'center' },
  label: { fontSize: 12, color: '#6b7280' },
  value: { fontSize: 14, fontWeight: '700' },
})
