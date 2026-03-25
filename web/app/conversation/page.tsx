"use client"

import React from 'react'
import ChatBubble from '../../components/ChatBubble'
import ChatInput from '../../components/ChatInput'
import useChatbot from '../../lib/useChatbot'

export default function ConversationPage() {
  const { messages, sendMessage, loading } = useChatbot()

  return (
    <div style={{ padding: 16 }}>
      <h2>Conversation</h2>
      <div style={{ maxHeight: '60vh', overflow: 'auto', marginBottom: 12 }}>
        {messages.map((m: any) => (
          <ChatBubble key={m.id} role={m.role} text={m.text} />
        ))}
      </div>
      <ChatInput onSend={(text) => sendMessage({ message: text })} loading={loading} />
    </div>
  )
}
