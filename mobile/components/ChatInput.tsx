import React from 'react'
import { View, TextInput, Button } from 'react-native'

export default function ChatInput({ onSend, loading }: { onSend: (text: string) => void; loading?: boolean }) {
  const [text, setText] = React.useState('')
  return (
    <View style={{ flexDirection: 'row', gap: 8 }}>
      <TextInput value={text} onChangeText={setText} placeholder="Écrivez un message" style={{ flex: 1 }} />
      <Button title="Envoyer" onPress={() => { if (!text) return; onSend(text); setText('') }} disabled={loading} />
    </View>
  )
}
