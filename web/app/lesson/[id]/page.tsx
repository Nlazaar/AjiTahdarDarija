import { getLesson, getExercises, getLessonsByModule } from '@/lib/api'
import LessonClient from './LessonClient'

const MOCK_LESSON = { id: 'l1', title: 'Les Bases (Tanger)' }

const MOCK_EXERCISES_L1 = [
  {
    id: 'new1', type: 'new-word', progression: 5, index: 1, total: 4,
    word: { darija: 'زوين', latin: 'zwine', fr: 'beau / joli' }
  },
  {
    id: 'flash1', type: 'flashcards', question: 'Apprenez ces mots en darija',
    words: [
      { darija: 'زوين', latin: 'zwine', fr: 'beau / joli' },
      { darija: 'بشع', latin: 'bchi3', fr: 'moche' },
      { darija: 'كبير', latin: 'kbir', fr: 'grand' },
      { darija: 'صغير', latin: 'sghir', fr: 'petit' }
    ]
  },
  {
    id: 'ex2', type: 'matching', question: 'Associez les mots correspondants',
    pairs: [
      { left: 'Salut', right: 'سلام (Salam)' },
      { left: 'Ça va ?', right: 'لاباس؟ (Labass?)' },
      { left: 'Bienvenue', right: 'مرحبا (Marhba)' },
      { left: 'Merci', right: 'شكرا (Choukrane)' }
    ]
  },
  {
    id: 'ex3', type: 'building', question: 'Traduisez : "Bonjour tout va bien"',
    expected: "Sba7 l-kheir koulchi bikhir",
    words: ["Sba7", "l-kheir", "koulchi", "bikhir", "Salam", "Ana"]
  }
]

export default async function LessonPage({ params, searchParams }: { params: { id: string }, searchParams?: Record<string, string | string[]> }) {
  const { id } = params
  const minimal = Array.isArray(searchParams?.minimal) ? searchParams?.minimal[0] : searchParams?.minimal;

  if (minimal === 'progress') {
    const MinimalProgress = (await import('./MinimalProgress')).default;
    return <MinimalProgress value={25} />;
  }
  let lesson, exercises;

  let nextLessonId: string | null = null

  try {
    lesson    = await getLesson(id)
    exercises = await getExercises(id)
    if (!lesson || !lesson.id) lesson = MOCK_LESSON
    if (!Array.isArray(exercises))   exercises = []

    // Trouve la leçon suivante dans le même module
    if (lesson?.moduleId) {
      const siblings = await getLessonsByModule(lesson.moduleId).catch(() => [])
      const sorted   = [...(siblings as any[])].sort((a, b) => (a.order ?? 0) - (b.order ?? 0))
      const idx      = sorted.findIndex((l: any) => l.id === id)
      if (idx >= 0 && idx < sorted.length - 1) nextLessonId = sorted[idx + 1].id
    }
  } catch (err) {
    lesson    = MOCK_LESSON
    exercises = []
  }

  const userId = 'user_123'

  return (
    <LessonClient
      lesson={lesson}
      exercises={exercises}
      userId={userId}
      nextLessonId={nextLessonId}
      isLastLesson={!nextLessonId}
    />
  )
}

