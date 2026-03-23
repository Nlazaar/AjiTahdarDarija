import React from 'react'

const BASE = process.env.NEXT_PUBLIC_API_URL ?? ''

export default function useChatbot() {
  const [messages, setMessages] = React.useState<any[]>([])
  const [loading, setLoading] = React.useState(false)

  React.useEffect(() => {
    // load recent history (anonymous for now)
    ;(async () => {
      try {
        const res = await fetch(`${BASE}/chatbot/history?limit=50`)
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
      const res = await fetch(`${BASE}/chatbot/message`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload), credentials: 'include' })
      if (!res.ok) throw new Error('chatbot error')
      const data = await res.json()
      // append user and bot messages
      setMessages((m) => m.concat([{ id: 'u' + Date.now(), role: 'user', text: payload.message }, { id: 'b' + Date.now(), role: 'bot', text: data.replyText, ...data }]))
      return data
    } finally {
      setLoading(false)
    }
  }

  return { messages, sendMessage, loading }
}
