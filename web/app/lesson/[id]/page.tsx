import { getLesson, getExercises } from '@/lib/api'
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
  
  try {
    lesson = await getLesson(id)
    exercises = await getExercises(id)
    
    // Fallback if the backend returned empty object arrays because the file was empty
    if (!lesson || !lesson.id) lesson = MOCK_LESSON
    // Currently hardcoded to return Level 1 data for UI review regardless of the node clicked
    if (!exercises || !Array.isArray(exercises) || exercises.length === 0) exercises = MOCK_EXERCISES_L1
  } catch (err) {
    lesson = MOCK_LESSON
    exercises = MOCK_EXERCISES_L1
  }
  
  const userId = 'user_123'

  return <LessonClient lesson={lesson} exercises={exercises} userId={userId} />
}

