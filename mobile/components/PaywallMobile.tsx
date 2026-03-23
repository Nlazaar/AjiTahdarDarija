import React from 'react'
import { View, Text, TouchableOpacity } from 'react-native'

export default function PaywallMobile({ onUpgrade }: { onUpgrade: () => void }) {
  return (
    <View style={{ padding: 12, backgroundColor: '#fff', borderRadius: 8 }}>
      <Text style={{ fontSize: 16, fontWeight: '700', marginBottom: 8 }}>Passer Premium</Text>
      <Text style={{ marginBottom: 12 }}>Accédez aux leçons bonus et statistiques avancées.</Text>
      <TouchableOpacity onPress={onUpgrade} style={{ backgroundColor: '#F59E0B', padding: 10, borderRadius: 6 }}>
        <Text style={{ color: '#fff', textAlign: 'center' }}>Passer Premium</Text>
      </TouchableOpacity>
    </View>
  )
}
