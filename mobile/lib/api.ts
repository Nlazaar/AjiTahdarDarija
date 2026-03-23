import { getToken } from './auth'

const BASE = process.env.EXPO_PUBLIC_API_URL ?? 'http://localhost:3000'

async function request<T>(path: string, init: RequestInit = {}): Promise<T> {
  const token = await getToken()
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(init.headers as Record<string, string>),
  }
  if (token) headers['Authorization'] = `Bearer ${token}`

  const res = await fetch(`${BASE}${path}`, { ...init, headers })
  if (!res.ok) {
    const text = await res.text().catch(() => '')
    throw new Error(`API ${res.status} ${res.statusText}: ${text}`)
  }
  return res.json() as Promise<T>
}

export async function getModules() {
  return request('/modules')
}

export async function getLesson(lessonId: string) {
  return request(`/lessons/${lessonId}`)
}

export async function getExercises(lessonId: string) {
  return request(`/lessons/${lessonId}/exercises`)
}

export async function submitLesson(lessonId: string, body: any) {
  return request(`/lessons/${lessonId}/submit`, { method: 'POST', body: JSON.stringify(body) })
}

export async function getGamification(userId: string) {
  return request(`/gamification/badges?userId=${encodeURIComponent(userId)}`)
}

export async function get<T = any>(path: string) {
  return request<T>(path)
}

export async function getReviewItems() {
  return request('/reviews/items')
}

export async function submitReview(reviewId: string, body: any) {
  return request(`/reviews/${reviewId}/submit`, { method: 'POST', body: JSON.stringify(body) })
}

export async function getReviewStats(userId?: string) {
  const q = userId ? `?userId=${encodeURIComponent(userId)}` : ''
  return request(`/reviews/stats${q}`)
}

// Gamification endpoints
export async function getGamificationApi(userId?: string) {
  const q = userId ? `?userId=${encodeURIComponent(userId)}` : ''
  return request(`/gamification${q}`)
}

export async function addXp(amount: number) {
  return request('/gamification/xp', { method: 'POST', body: JSON.stringify({ amount }) })
}

export async function updateStreakApi() {
  return request('/gamification/streak', { method: 'POST' })
}

export async function updateHeartsApi(delta: number) {
  return request('/gamification/hearts', { method: 'POST', body: JSON.stringify({ delta }) })
}

export default {
  request,
  getModules,
  getLesson,
  getExercises,
  submitLesson,
  getGamification,
  get,
  getReviewItems,
  submitReview,
  getReviewStats,
  // gamification
  getGamificationApi,
  addXp,
  updateStreakApi,
  updateHeartsApi,
}
