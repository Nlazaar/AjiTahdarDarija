import React from 'react'

export default function ChatBubble({ role, text }: { role: 'user' | 'bot' | string; text: string }) {
  const isUser = role === 'user'
  const style: React.CSSProperties = {
    alignSelf: isUser ? 'flex-end' : 'flex-start',
    background: isUser ? '#DCF8C6' : '#F1F0F0',
    padding: 8,
    borderRadius: 8,
    marginBottom: 8,
    maxWidth: '80%',
  }
  return (
    <div style={{ display: 'flex', flexDirection: 'column' }}>
      <div style={style}>{text}</div>
    </div>
  )
}
