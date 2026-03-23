import React from 'react'
import { View, Text, StyleSheet, Image } from 'react-native'

type Props = {
  badge: { id: string; name: string; icon?: string; unlocked?: boolean }
}

export default function BadgeCard({ badge }: Props) {
  return (
    <View style={[styles.card, badge.unlocked ? styles.unlocked : styles.locked]}>
      {badge.icon ? <Image source={{ uri: badge.icon }} style={styles.icon} /> : <View style={styles.placeholder} />}
      <Text style={styles.name}>{badge.name}</Text>
      <Text style={styles.state}>{badge.unlocked ? 'Débloqué' : 'Bloqué'}</Text>
    </View>
  )
}

const styles = StyleSheet.create({
  card: { width: 100, padding: 8, borderRadius: 8, alignItems: 'center', margin: 6, backgroundColor: '#fff' },
  icon: { width: 48, height: 48, marginBottom: 6 },
  placeholder: { width: 48, height: 48, backgroundColor: '#e5e7eb', borderRadius: 24, marginBottom: 6 },
  name: { fontSize: 12, textAlign: 'center' },
  state: { fontSize: 11, color: '#6b7280', marginTop: 4 },
  unlocked: { borderWidth: 1, borderColor: '#10b981' },
  locked: { opacity: 0.6 },
})
