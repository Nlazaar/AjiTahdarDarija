import * as SecureStore from 'expo-secure-store'
import AsyncStorage from '@react-native-async-storage/async-storage'

const KEY = 'jwt'

export async function getToken(): Promise<string | null> {
  try {
    const v = await SecureStore.getItemAsync(KEY)
    if (v) return v
  } catch {}
  try { return await AsyncStorage.getItem(KEY) } catch { return null }
}

export async function setToken(token: string) {
  try { await SecureStore.setItemAsync(KEY, token) } catch { await AsyncStorage.setItem(KEY, token) }
}

export async function delToken() {
  try { await SecureStore.deleteItemAsync(KEY) } catch {}
  try { await AsyncStorage.removeItem(KEY) } catch {}
}
