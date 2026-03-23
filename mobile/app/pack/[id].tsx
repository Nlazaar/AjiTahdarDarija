import React from 'react'
import { View, Text, FlatList, Button } from 'react-native'

export default function PackDetails({ params, navigation }: any){
  const { id } = params
  const [pack, setPack] = React.useState<any>(null)
  const [words, setWords] = React.useState<any[]>([])
  React.useEffect(()=>{
    fetch((process.env.EXPO_PUBLIC_API_URL ?? 'http://localhost:3000') + `/packs/${id}`).then(r=>r.json()).then(setPack).catch(()=>{})
    fetch((process.env.EXPO_PUBLIC_API_URL ?? 'http://localhost:3000') + `/packs/${id}/words`).then(r=>r.json()).then(setWords).catch(()=>{})
  }, [id])
  return (
    <View style={{ padding: 16 }}>
      <Text style={{ fontSize: 20, fontWeight: '700' }}>{pack?.title ?? 'Pack'}</Text>
      <Text style={{ marginTop: 8 }}>{pack?.description}</Text>
      <Text style={{ marginTop: 12, fontWeight: '700' }}>Mots</Text>
      <FlatList data={words} keyExtractor={(i)=>i.id} renderItem={({item})=> <Text style={{ paddingVertical: 4 }}>{item.word} — {item.translation ? JSON.stringify(item.translation) : ''}</Text>} />
      <View style={{ marginTop: 12 }}>
        <Button title="Commencer" onPress={()=> navigation.push('lesson', { packId: id })} />
      </View>
    </View>
  )
}
