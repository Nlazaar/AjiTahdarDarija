import React from 'react'
import { View, Text, Button } from 'react-native'
import PaywallMobile from '../components/PaywallMobile'

export default function PremiumScreen() {
  const handleUpgrade = () => {
    // placeholder: open web checkout or trigger in-app purchase flow
    // In production, integrate Expo in-app-purchases or use server-driven flow
    alert('Démarrer le processus d\'achat (placeholder)')
  }

  return (
    <View style={{ padding: 16 }}>
      <Text style={{ fontSize: 24, fontWeight: '700', marginBottom: 12 }}>Premium</Text>
      <Text style={{ marginBottom: 12 }}>Comparaison Free vs Premium</Text>
      <PaywallMobile onUpgrade={handleUpgrade} />
    </View>
  )
}
