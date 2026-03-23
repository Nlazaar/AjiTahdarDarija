const QUEUE_KEY = 'offlineQueue'

export function enqueueOffline(item: any) {
  try {
    const raw = localStorage.getItem(QUEUE_KEY)
    const arr = raw ? JSON.parse(raw) : []
    arr.push({ item, ts: Date.now() })
    localStorage.setItem(QUEUE_KEY, JSON.stringify(arr))
  } catch (e) {
    // ignore
  }
}

export function getQueue() {
  try {
    const raw = localStorage.getItem(QUEUE_KEY)
    return raw ? JSON.parse(raw) : []
  } catch { return [] }
}

export function clearQueue() { try { localStorage.removeItem(QUEUE_KEY) } catch {} }

export async function flushQueue(apiBase = (process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3000')) {
  try {
    const q = getQueue()
    if (!q.length) return { ok: true }
    const res = await fetch(apiBase + '/sync', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ items: q.map((e:any)=>e.item), userId: (window as any).__USER_ID || null }) })
    if (res.ok) clearQueue()
    return { ok: true }
  } catch (e) { return { ok: false, error: e } }
}
