import React from 'react'
import { View, Text, ScrollView, Button, Alert } from 'react-native'
import { useLocalSearchParams, useRouter } from 'expo-router'
import { useAuth } from '../../lib/useAuth'
import api from '../../lib/api'
import ExerciseWrapper from '../../components/ExerciseWrapper'
import LessonResult from '../../components/LessonResult'
import MultipleChoiceExercise from '../../components/exercises/MultipleChoiceExercise'
import TranslationExercise from '../../components/exercises/TranslationExercise'
import WordOrderExercise from '../../components/exercises/WordOrderExercise'
import ListeningExercise from '../../components/exercises/ListeningExercise'
import FillInTheBlankExercise from '../../components/exercises/FillInTheBlankExercise'
import useGamification from '../../hooks/useGamification'
import GamificationHeader from '../../components/GamificationHeader'

export default function Lesson() {
  const params = useLocalSearchParams()
  const id = params.id as string
  const { ensureAuth, userId } = useAuth()
  const router = useRouter()

  React.useEffect(() => {
    ensureAuth()
  }, [ensureAuth])

  const [lesson, setLesson] = React.useState<any | null>(null)
  const [exercises, setExercises] = React.useState<any[]>([])

  const [currentIndex, setCurrentIndex] = React.useState(0)
  const [answers, setAnswers] = React.useState<Array<any>>([])
  const [isFinished, setIsFinished] = React.useState(false)
  const [result, setResult] = React.useState<any | null>(null)
  const { refreshGamification } = useGamification()

  React.useEffect(() => {
    let mounted = true
    ;(async () => {
      try {
        const l = await api.getLesson(id)
        const ex = await api.getExercises(id)
        if (!mounted) return
        setLesson(l)
        setExercises(ex || [])
      } catch (e) {
        // ignore for now
      }
    })()
    return () => {
      mounted = false
    }
  }, [id])

  function handleAnswer({ exerciseId, correct, response }: { exerciseId: string; correct: boolean; response: any }) {
    setAnswers((a) => {
      const copy = a.slice()
      copy[currentIndex] = { exerciseId, correct, response }
      return copy
    })
    // auto-advance
    if (currentIndex < exercises.length - 1) setCurrentIndex((i) => i + 1)
    else finish()
  }

  async function finish() {
    setIsFinished(true)
    try {
      const payload = { answers, userId }
      const res = await api.submitLesson(id, payload)
      // backend may return scoring info: { score, total, errors, xp }
      const computed = res || { score: answers.filter((a) => a?.correct).length, total: exercises.length, errors: answers.filter((a) => !a?.correct) }
      setResult(computed)

      // update gamification: add xp, update streak, decrement hearts by errors
      try {
        const xpEarned = computed.xp ?? (computed.score ?? 0) * 10
        await api.addXp(xpEarned)
        await api.updateStreakApi()
        const errorsCount = (computed.errors || []).length
        if (errorsCount > 0) await api.updateHeartsApi(-errorsCount)
        // refresh local gamification state
        try {
          await refreshGamification()
        } catch (e) {
          // ignore
        }
      } catch (g) {
        // ignore gamification errors
      }
    } catch (e) {
      // fallback local scoring
      const computed = { score: answers.filter((a) => a?.correct).length, total: exercises.length, errors: answers.filter((a) => !a?.correct) }
      setResult(computed)
    }
  }

  function renderExercise(ex: any, idx: number) {
    const common = { exercise: ex, onAnswer: handleAnswer }
    switch (ex.type) {
      case 'mcq':
        return <MultipleChoiceExercise {...common} />
      case 'translate':
        return <TranslationExercise {...common} />
      case 'order':
        return <WordOrderExercise {...common} />
      case 'listen':
        return <ListeningExercise {...common} />
      case 'fill':
        return <FillInTheBlankExercise {...common} />
      default:
        return (
          <View>
            <Text>Type d'exercice non supporté: {String(ex.type)}</Text>
            <Button title="Marquer comme correct" onPress={() => handleAnswer({ exerciseId: ex.id, correct: true, response: null })} />
          </View>
        )
    }
  }

  if (!lesson) return <Text>Chargement…</Text>

  if (isFinished && result) {
    return (
      <ScrollView contentContainerStyle={{ padding: 16 }}>
        <LessonResult
          score={result.score ?? 0}
          total={result.total ?? exercises.length}
          errors={(result.errors as any[]) ?? []}
          xpGained={result.xp ?? 0}
          onBack={() => router.back()}
        />
      </ScrollView>
    )
  }

  const current = exercises[currentIndex]

  return (
    <ScrollView contentContainerStyle={{ padding: 16 }}>
      <Text style={{ fontSize: 22, fontWeight: '700', marginBottom: 8 }}>{lesson?.title ?? `Leçon ${id}`}</Text>

      <GamificationHeader />

      <View style={{ backgroundColor: '#fff', padding: 12, borderRadius: 8 }}>
        <Text style={{ color: '#374151' }}>{lesson?.content ?? `Contenu de la leçon ${id}`}</Text>
      </View>

      <View style={{ marginTop: 12 }}>
        {current ? (
          <ExerciseWrapper current={currentIndex} total={exercises.length} title={current.prompt ?? current.question}>
            {renderExercise(current, currentIndex)}
          </ExerciseWrapper>
        ) : (
          <View style={{ padding: 8, marginTop: 8 }}>
            <Text>Aucun exercice pour cette leçon.</Text>
          </View>
        )}
      </View>

      <View style={{ marginTop: 12 }}>
        <Button title="Précédent" onPress={() => setCurrentIndex((i) => Math.max(0, i - 1))} disabled={currentIndex === 0} />
        <View style={{ height: 8 }} />
        <Button
          title={currentIndex < exercises.length - 1 ? 'Suivant' : 'Terminer la leçon'}
          onPress={() => {
            if (currentIndex < exercises.length - 1) setCurrentIndex((i) => i + 1)
            else finish()
          }}
        />
      </View>
    </ScrollView>
  )
}
