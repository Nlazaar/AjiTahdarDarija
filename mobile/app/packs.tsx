import React from 'react'
import { View, Text, FlatList, TouchableOpacity } from 'react-native'

export default function PacksScreen({ navigation }: any){
  const [packs, setPacks] = React.useState<any[]>([])
  React.useEffect(()=>{ fetch((process.env.EXPO_PUBLIC_API_URL ?? 'http://localhost:3000') + '/packs').then(r=>r.json()).then(setPacks).catch(()=>{}) }, [])
  return (
    <View style={{ padding: 16 }}>
      <Text style={{ fontSize: 20, fontWeight: '700' }}>Packs</Text>
      <FlatList data={packs} keyExtractor={(i)=>i.id} renderItem={({item})=> (
        <TouchableOpacity onPress={()=> navigation.push('pack', { id: item.id })} style={{ padding: 12, backgroundColor: '#fff', marginVertical: 6, borderRadius: 8 }}>
          <Text style={{ fontWeight: '700' }}>{item.title}</Text>
          <Text>{item.difficulty} — {item.category} {item.premiumOnly ? '(Premium)' : ''}</Text>
        </TouchableOpacity>
      )} />
    </View>
  )
}
