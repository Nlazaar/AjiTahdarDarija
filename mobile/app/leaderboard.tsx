import React from 'react'
import { View, Text, FlatList } from 'react-native'

export default function LeaderboardScreen(){
  const [global, setGlobal] = React.useState<any[]>([])
  React.useEffect(()=>{ fetch((process.env.EXPO_PUBLIC_API_URL ?? 'http://localhost:3000') + '/leaderboard/global').then(r=>r.json()).then(setGlobal).catch(()=>{}) }, [])
  return (
    <View style={{ padding: 16 }}>
      <Text style={{ fontSize: 20, fontWeight: '700' }}>Classement global</Text>
      <FlatList data={global} keyExtractor={(i)=>i.id} renderItem={({item})=> <Text>{item.name} — {item.xp} XP</Text>} />
    </View>
  )
}
