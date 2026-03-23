import React from 'react'
import { View, Text, FlatList } from 'react-native'

export default function FriendsScreen(){
  const [requests, setRequests] = React.useState<any[]>([])
  React.useEffect(()=>{ fetch((process.env.EXPO_PUBLIC_API_URL ?? 'http://localhost:3000') + '/friends/requests').then(r=>r.json()).then(setRequests).catch(()=>{}) }, [])
  return (
    <View style={{ padding: 16 }}>
      <Text style={{ fontSize: 20, fontWeight: '700' }}>Amis</Text>
      <Text style={{ marginTop: 12, marginBottom: 8 }}>Demandes en attente</Text>
      <FlatList data={requests} keyExtractor={(i)=>i.id} renderItem={({item})=> <Text>{item.fromId}</Text>} />
    </View>
  )
}
