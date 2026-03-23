import React from 'react'
import { View, ScrollView } from 'react-native'
import ChatBubble from '../components/ChatBubble'
import ChatInput from '../components/ChatInput'
import useChatbot from '../hooks/useChatbot'

export default function ConversationScreen() {
  const { messages, sendMessage, loading } = useChatbot()

  return (
    <View style={{ flex: 1, padding: 12 }}>
      <ScrollView style={{ flex: 1, marginBottom: 12 }}>
        {messages.map((m) => (
          <ChatBubble key={m.id} role={m.role} text={m.text} />
        ))}
      </ScrollView>
      <ChatInput onSend={(text) => sendMessage({ message: text })} loading={loading} />
    </View>
  )
}
