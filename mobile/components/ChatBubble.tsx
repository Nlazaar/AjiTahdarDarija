import React from 'react'
import { View, Text } from 'react-native'

export default function ChatBubble({ role, text }: { role: 'user' | 'bot' | string; text: string }) {
  const isUser = role === 'user'
  return (
    <View style={{ alignSelf: isUser ? 'flex-end' : 'flex-start', backgroundColor: isUser ? '#DCF8C6' : '#F1F0F0', padding: 8, borderRadius: 8, marginBottom: 8, maxWidth: '80%' }}>
      <Text>{text}</Text>
    </View>
  )
}
