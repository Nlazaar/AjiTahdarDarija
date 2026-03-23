import AsyncStorage from '@react-native-async-storage/async-storage'

type Entry<T> = { v: T; e: number }

export async function setCache<T>(key: string, value: T, ttlSeconds = 300) {
  try {
    const entry: Entry<T> = { v: value, e: Date.now() + ttlSeconds * 1000 }
    await AsyncStorage.setItem(key, JSON.stringify(entry))
  } catch {}
}

export async function getCache<T>(key: string): Promise<T | null> {
  try {
    const raw = await AsyncStorage.getItem(key)
    if (!raw) return null
    const entry: Entry<T> = JSON.parse(raw)
    if (Date.now() > entry.e) {
      await AsyncStorage.removeItem(key)
      return null
    }
    return entry.v as T
  } catch {
    return null
  }
}

export async function delCache(key: string) {
  try { await AsyncStorage.removeItem(key) } catch {}
}
