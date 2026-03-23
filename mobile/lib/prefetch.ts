import React from 'react'
import { getCache, setCache } from './cache'
import useApi from './useApi'

export async function prefetchExerciseById(call: (p: string, o?: RequestInit)=>Promise<any>, exId: string) {
  const key = `exercise:${exId}`
  const cached = await getCache(key)
  if (cached) return
  try {
    const data = await call(`/exercises/${exId}`)
    if (data) await setCache(key, data, 60 * 5)
  } catch {}
}

export function usePrefetchLesson(nextLessonId?: string) {
  const { call } = useApi()
  React && React
  // Note: passive prefetch triggered by component mount
  // Keep minimal: callers should invoke prefetchExerciseById explicitly for heavy assets
  if (!nextLessonId) return
  ;(async () => {
    const key = `lesson:${nextLessonId}`
    const cached = await getCache(key)
    if (cached) return
    try {
      const data = await call(`/lessons/${nextLessonId}`)
      if (data) await setCache(key, data, 60 * 5)
    } catch {}
  })()
}
