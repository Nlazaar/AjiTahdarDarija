type TTLEntry<T> = { v: T; e: number }

export function setLocalCache<T>(key: string, value: T, ttlSeconds = 300) {
  try {
    const entry: TTLEntry<T> = { v: value, e: Date.now() + ttlSeconds * 1000 }
    localStorage.setItem(key, JSON.stringify(entry))
  } catch (e) {
    // ignore
  }
}

export function getLocalCache<T>(key: string): T | null {
  try {
    const raw = localStorage.getItem(key)
    if (!raw) return null
    const entry: TTLEntry<T> = JSON.parse(raw)
    if (Date.now() > entry.e) {
      localStorage.removeItem(key)
      return null
    }
    return entry.v
  } catch (e) {
    return null
  }
}

export function delLocalCache(key: string) {
  try { localStorage.removeItem(key) } catch {}
}
