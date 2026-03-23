import React from 'react'
import { View, Text, ScrollView, Button } from 'react-native'
import { useAuth } from '../lib/useAuth'
import api from '../lib/api'
import { useRouter } from 'expo-router'
import ReviewExerciseWrapper from '../components/ReviewExerciseWrapper'
import MultipleChoiceExercise from '../components/exercises/MultipleChoiceExercise'
import TranslationExercise from '../components/exercises/TranslationExercise'
import FillInTheBlankExercise from '../components/exercises/FillInTheBlankExercise'
import ReviewResult from '../components/ReviewResult'

export default function ReviewScreen() {
  const { ensureAuth, userId } = useAuth()
  const router = useRouter()
  React.useEffect(() => {
    ensureAuth()
  }, [ensureAuth])

  const [items, setItems] = React.useState<any[] | null>(null)
  const [index, setIndex] = React.useState(0)
  const [answers, setAnswers] = React.useState<any[]>([])
  const [finished, setFinished] = React.useState(false)
  const [result, setResult] = React.useState<any | null>(null)

  React.useEffect(() => {
    let mounted = true
    ;(async () => {
      try {
        const it = await api.getReviewItems()
        if (!mounted) return
        setItems(it || [])
      } catch (e) {
        setItems([])
      }
    })()
    return () => {
      mounted = false
    }
  }, [])

  function handleAnswer({ exerciseId, correct, response }: { exerciseId: string; correct: boolean; response: any }) {
    setAnswers((a) => {
      const copy = a.slice()
      copy[index] = { exerciseId, correct, response }
      return copy
    })
    if ((items?.length ?? 0) > index + 1) setIndex((i) => i + 1)
    else finish()
  }

  async function finish() {
    setFinished(true)
    try {
      const payload = { answers, userId }
      const res = await api.submitReview('session', payload)
      setResult(res || { score: answers.filter((a) => a?.correct).length, total: items?.length ?? 0, errors: answers.filter((a) => !a?.correct) })
    } catch (e) {
      setResult({ score: answers.filter((a) => a?.correct).length, total: items?.length ?? 0, errors: answers.filter((a) => !a?.correct) })
    }
  }

  function handleDontKnow() {
    // mark as incorrect and advance
    const current = items?.[index]
    if (!current) return
    handleAnswer({ exerciseId: current.id, correct: false, response: null })
  }

  function renderCurrent(item: any) {
    const common = { exercise: item, onAnswer: handleAnswer }
    switch (item.type) {
      case 'mcq':
        return <MultipleChoiceExercise {...common} />
      case 'translate':
        return <TranslationExercise {...common} />
      case 'fill':
        return <FillInTheBlankExercise {...common} />
      default:
        return <Text>Type non supporté: {String(item.type)}</Text>
    }
  }

  if (items === null) return <Text>Chargement…</Text>

  if ((items?.length ?? 0) === 0) return <View style={{ padding: 16 }}><Text>Rien à réviser</Text></View>

  if (finished && result) {
    return (
      <ScrollView contentContainerStyle={{ padding: 16 }}>
        <ReviewResult score={result.score ?? 0} total={result.total ?? items.length} errors={result.errors || []} onBack={() => router.back()} />
      </ScrollView>
    )
  }

  const current = items?.[index]

  return (
    <ScrollView contentContainerStyle={{ padding: 16 }}>
      <Text style={{ fontSize: 22, fontWeight: '700', marginBottom: 8 }}>Révision</Text>

      {current && (
        <ReviewExerciseWrapper current={index} total={items.length} title={current.prompt ?? current.question} onDontKnow={handleDontKnow}>
          {renderCurrent(current)}
        </ReviewExerciseWrapper>
      )}

      <View style={{ marginTop: 12 }}>
        <Button title={index < (items?.length ?? 0) - 1 ? 'Suivant' : 'Terminer'} onPress={() => { if (index < (items?.length ?? 0) - 1) setIndex((i) => i + 1); else finish() }} />
      </View>
    </ScrollView>
  )
}
import React from 'react'
import { View, Text, ScrollView } from 'react-native'

export default function Review() {
  return (
    <ScrollView contentContainerStyle={{ padding: 16 }}>
      <Text style={{ fontSize: 22, fontWeight: '700', marginBottom: 8 }}>Révision</Text>
      <View style={{ backgroundColor: '#fff', padding: 12, borderRadius: 8 }}>
        <Text style={{ color: '#374151' }}>Cartes à réviser aujourd'hui...</Text>
      </View>
    </ScrollView>
  )
}
