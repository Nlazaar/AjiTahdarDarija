import React from 'react'
import { View, Text } from 'react-native'

export default function DailyGoals({ xpTarget = 50, lessons = 1, reviews = 5 }: { xpTarget?: number; lessons?: number; reviews?: number }) {
  return (
    <View style={{ padding: 12, borderRadius: 8, backgroundColor: '#fff' }}>
      <Text style={{ fontSize: 18, fontWeight: '700', marginBottom: 8 }}>Objectifs du jour</Text>
      <Text>XP à atteindre: <Text style={{ fontWeight: '700' }}>{xpTarget}</Text></Text>
      <Text>Leçons à faire: <Text style={{ fontWeight: '700' }}>{lessons}</Text></Text>
      <Text>Révisions: <Text style={{ fontWeight: '700' }}>{reviews}</Text></Text>
    </View>
  )
}
