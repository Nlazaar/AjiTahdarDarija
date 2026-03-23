import React from 'react'
import { View, Text } from 'react-native'

export default function OfflineIndicator({ offline }: { offline: boolean }) {
  if (!offline) return null
  return (
    <View style={{ position: 'absolute', top: 10, left: 10, backgroundColor: '#F59E0B', padding: 6, borderRadius: 6 }}>
      <Text style={{ color: '#fff' }}>Hors-ligne</Text>
    </View>
  )
}
