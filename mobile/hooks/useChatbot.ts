import React from 'react'

const API = process.env.EXPO_PUBLIC_API_URL ?? ''

export default function useChatbot() {
  const [messages, setMessages] = React.useState<any[]>([])
  const [loading, setLoading] = React.useState(false)

  React.useEffect(() => {
    ;(async () => {
      try {
        const res = await fetch(`${API}/chatbot/history?limit=50`)
        if (!res.ok) return
        const data = await res.json()
        setMessages((data || []).reverse())
      } catch (e) {
        // ignore
      }
    })()
  }, [])

  async function sendMessage(payload: { userId?: string; message: string }) {
    setLoading(true)
    try {
      const res = await fetch(`${API}/chatbot/message`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) })
      if (!res.ok) throw new Error('chatbot error')
      const data = await res.json()
      setMessages((m) => m.concat([{ id: 'u' + Date.now(), role: 'user', text: payload.message }, { id: 'b' + Date.now(), role: 'bot', text: data.replyText, ...data }]))
      return data
    } finally {
      setLoading(false)
    }
  }

  return { messages, sendMessage, loading }
}
