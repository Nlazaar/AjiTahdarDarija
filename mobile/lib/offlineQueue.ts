import AsyncStorage from '@react-native-async-storage/async-storage'

const QUEUE_KEY = 'offlineQueue'

export async function enqueueOffline(item: any) {
  try {
    const raw = await AsyncStorage.getItem(QUEUE_KEY)
    const arr = raw ? JSON.parse(raw) : []
    arr.push({ item, ts: Date.now() })
    await AsyncStorage.setItem(QUEUE_KEY, JSON.stringify(arr))
  } catch {}
}

export async function getQueue() {
  try { const raw = await AsyncStorage.getItem(QUEUE_KEY); return raw ? JSON.parse(raw) : [] } catch { return [] }
}

export async function clearQueue() { try { await AsyncStorage.removeItem(QUEUE_KEY) } catch {} }

export async function flushQueue(apiBase = (process.env.EXPO_PUBLIC_API_URL ?? 'http://localhost:3000')) {
  try {
    const q = await getQueue()
    if (!q.length) return { ok: true }
    const body = { items: q.map((e:any)=>e.item), userId: null }
    const res = await fetch(apiBase + '/sync', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) })
    if (res.ok) await clearQueue()
    return { ok: true }
  } catch (e) { return { ok: false, error: e } }
}
