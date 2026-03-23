import React from 'react'

export default function ChatInput({ onSend, loading }: { onSend: (text: string) => void; loading?: boolean }) {
  const [text, setText] = React.useState('')
  return (
    <div style={{ display: 'flex', gap: 8 }}>
      <input value={text} onChange={(e) => setText(e.target.value)} placeholder="Écrivez un message" />
      <button
        onClick={() => {
          if (!text) return
          onSend(text)
          setText('')
        }}
        disabled={loading}
      >
        Envoyer
      </button>
    </div>
  )
}
