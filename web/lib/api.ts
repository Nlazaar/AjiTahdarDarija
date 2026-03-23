// Simple API client for Next.js -> NestJS backend
// Uses fetch(), returns parsed JSON, includes placeholder for JWT token

const BASE = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3001'


type Module = {
  id: string
  title: string
  description?: string
  progress?: number
}

type Lesson = {
  id: string
  title: string
  excerpt?: string
  content?: string
}

type Exercise = {
  id: string
  type: string
  question: string
  options?: string[]
}

type Badge = {
  id: string
  name: string
  description?: string
  icon?: string
}

type Gamification = {
  xp: number
  streak: number
  hearts: number
  badges: Badge[]
}

async function request<T>(path: string, init: RequestInit = {}): Promise<T> {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(init.headers as Record<string, string>),
  }

  // Placeholder for future JWT support
  const token = process.env.NEXT_PUBLIC_JWT_TOKEN ?? ''
  if (token) headers['Authorization'] = `Bearer ${token}`

  let res: Response
  try {
    res = await fetch(`${BASE}${path}`, { ...init, headers })
  } catch (err) {
    // Network error (backend down, CORS, DNS). Return empty fallback to avoid unhandled runtime error during demo.
    // Callers should handle empty responses / provide local mocks.
    // Log the error for debugging.
    // eslint-disable-next-line no-console
    console.warn('API request failed:', err)
    return {} as T
  }

  const text = await res.text().catch(() => '')
  if (!res.ok) {
    throw new Error(`API ${res.status} ${res.statusText}: ${text}`)
  }
  if (!text) {
    return {} as T
  }
  return JSON.parse(text) as T
}

export async function getModules(): Promise<Module[]> {
  return request<Module[]>('/modules')
}

export async function getLessonsByModule(moduleId: string): Promise<Lesson[]> {
  return request<Lesson[]>(`/modules/${moduleId}/lessons`)
}

export async function getLesson(lessonId: string): Promise<Lesson> {
  return request<Lesson>(`/lessons/${lessonId}`)
}

export async function getExercises(lessonId: string): Promise<Exercise[]> {
  return request<Exercise[]>(`/lessons/${lessonId}/exercises`)
}

export async function submitLesson(lessonId: string, body: { userId: string; answers: any[] }) {
  return request('/lessons/' + lessonId + '/submit', {
    method: 'POST',
    body: JSON.stringify(body),
  })
}

export async function getGamification(userId: string): Promise<Gamification> {
  return request<Gamification>(`/gamification/badges?userId=${encodeURIComponent(userId)}`)
}

export async function addXp(userId: string, amount: number) {
  return request('/gamification/xp', {
    method: 'POST',
    body: JSON.stringify({ userId, amount }),
  })
}

export async function updateStreak(userId: string) {
  return request('/gamification/streak', {
    method: 'POST',
    body: JSON.stringify({ userId }),
  })
}

export async function updateHearts(userId: string, delta: number) {
  return request('/gamification/hearts', {
    method: 'POST',
    body: JSON.stringify({ userId, delta }),
  })
}

export async function getLeaderboard(): Promise<any[]> {
  return request<any[]>('/leaderboard/global')
}

export type { Module, Lesson, Exercise, Badge, Gamification }


