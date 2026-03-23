import AsyncStorage from '@react-native-async-storage/async-storage'

const TOKEN_KEY = 'darija_token'

export async function saveToken(token: string) {
  await AsyncStorage.setItem(TOKEN_KEY, token)
}

export async function getToken(): Promise<string | null> {
  return AsyncStorage.getItem(TOKEN_KEY)
}

export async function logout(): Promise<void> {
  await AsyncStorage.removeItem(TOKEN_KEY)
}

async function postJson<T>(url: string, body: any): Promise<T> {
  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  })
  if (!res.ok) {
    const text = await res.text().catch(() => '')
    throw new Error(`Auth ${res.status} ${res.statusText}: ${text}`)
  }
  return res.json()
}

export async function login(email: string, password: string) {
  return postJson<{ token: string }>('http://localhost:3000/auth/login', { email, password })
}

export async function register(email: string, password: string) {
  return postJson<{ token: string }>('http://localhost:3000/auth/register', { email, password })
}

export default { saveToken, getToken, logout, login, register }
