import React from 'react'
import { View, Text } from 'react-native'

export default function LeaguesScreen(){
  const [me, setMe] = React.useState<any>(null)
  React.useEffect(()=>{ fetch((process.env.EXPO_PUBLIC_API_URL ?? 'http://localhost:3000') + '/leagues/me').then(r=>r.json()).then(setMe).catch(()=>{}) }, [])
  return (
    <View style={{ padding: 16 }}>
      <Text style={{ fontSize: 20, fontWeight: '700' }}>Ligues</Text>
      <Text style={{ marginTop: 12 }}>Votre ligue: {me?.league ?? 'N/A'}</Text>
    </View>
  )
}
