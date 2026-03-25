"use client"

import React, { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAudio } from "@/hooks/useAudio"
import { LETTER_GROUPS } from "@/data/letterGroups"
import type { DarijaLetter } from "@/components/exercises/types"
import { ExerciseCard, ContinueButton, FeedbackBanner } from "@/components/ui"
import GenericExercisePlayer, { type CollectedAnswer } from "@/components/exercises/GenericExercisePlayer"
import { submitLesson } from "@/lib/api"
import { useUserProgress } from "@/contexts/UserProgressContext"

import FlashCard          from "@/components/exercises/FlashCard"
import ChoixLettre        from "@/components/exercises/ChoixLettre"
import AssocierLettres    from "@/components/exercises/AssocierLettres"
import TrouverLesPaires   from "@/components/exercises/TrouverLesPaires"
import EntendreEtChoisir  from "@/components/exercises/EntendreEtChoisir"
import VraiFaux           from "@/components/exercises/VraiFaux"
import DicterRomanisation from "@/components/exercises/DicterRomanisation"

// ── Types ────────────────────────────────────────────────────────────────────

type ExPhase  = "flashcard" | "choix" | "association" | "paires" | "entendre" | "vrai_faux" | "dicter"
type TrnPhase = "t1" | "t2" | "t3" | "t4" | "t5" | "t6"
type Phase    = ExPhase | TrnPhase | "finished"

// ── Constants ────────────────────────────────────────────────────────────────

const EX_PHASES: ExPhase[] = ["flashcard", "choix", "association", "paires", "entendre", "vrai_faux", "dicter"]

const PHASE_LABELS = ["Intro", "Prononc.", "Associer", "Paires", "Écoute", "Vrai/Faux", "Dicter"]

const PHASE_SEQUENCE: Phase[] = [
  "flashcard", "t1",
  "choix",     "t2",
  "association","t3",
  "paires",    "t4",
  "entendre",  "t5",
  "vrai_faux", "t6",
  "dicter",    "finished",
]

const WEIGHTS: Record<ExPhase, [number, number]> = {
  flashcard:   [0,   14],
  choix:       [14,  28],
  association: [28,  42],
  paires:      [42,  57],
  entendre:    [57,  71],
  vrai_faux:   [71,  85],
  dicter:      [85, 100],
}

const TRANSITIONS: Record<TrnPhase, { emoji: string; title: string; sub: string }> = {
  t1: { emoji: "⭐", title: "Phase 1 réussie !",      sub: "Maintenant prononce les lettres." },
  t2: { emoji: "🎯", title: "Super !",                sub: "Associe les lettres à leur son."  },
  t3: { emoji: "🔥", title: "Tu cartonnes !",         sub: "Mémorise les paires."             },
  t4: { emoji: "⚡", title: "Presque fini !",         sub: "Écoute et identifie."             },
  t5: { emoji: "🎯", title: "Dernière ligne droite !", sub: "Vrai ou Faux ?"                  },
  t6: { emoji: "🏆", title: "Excellent !",            sub: "Plus qu'un exercice !"            },
}

// Phases où les cœurs sont affichés
const HEART_PHASES: ExPhase[] = ["paires", "entendre", "vrai_faux"]
// Phases avec feedback + bouton Continuer dans le footer parent
const FEEDBACK_PHASES: ExPhase[] = ["choix", "entendre", "vrai_faux", "dicter"]

const shuffle = <T,>(arr: T[]): T[] => [...arr].sort(() => Math.random() - 0.5)

// ── Composants internes ───────────────────────────────────────────────────────

function TransitionScreen({ emoji, title, sub, onContinue }: {
  emoji: string; title: string; sub: string; onContinue: () => void
}) {
  return (
    <div
      className="flex flex-col items-center gap-4 py-12 px-4 text-center"
      style={{ animation: 'fadeUp 0.4s ease both' }}
    >
      <span className="text-7xl" style={{ animation: 'bounceIn 0.5s ease both 0.1s' }}>
        {emoji}
      </span>
      <h2 className="text-2xl font-bold text-gray-800">{title}</h2>
      <p className="text-sm text-gray-500 max-w-xs">{sub}</p>
      <div className="w-full max-w-xs mt-2">
        <ContinueButton onClick={onContinue} label="Continuer →" />
      </div>
    </div>
  )
}

function FinishedScreen({ onNext, hasNext }: { onNext: () => void; hasNext: boolean }) {
  return (
    <div className="flex flex-col items-center gap-4 py-8 px-4 text-center" style={{ animation: 'fadeUp 0.4s ease both' }}>
      <span className="text-7xl" style={{ animation: 'bounceIn 0.5s ease both' }}>🎉</span>
      <h2 className="text-2xl font-bold text-gray-800">Leçon terminée !</h2>
      <p className="text-sm text-gray-500 max-w-xs">
        {hasNext ? 'La leçon suivante est débloquée !' : 'Tu as terminé le chapitre !'}
      </p>

      <div className="flex justify-center gap-2 my-2">
        {Array.from({ length: 7 }).map((_, i) => (
          <div
            key={i}
            className="w-8 h-8 rounded-full text-white text-xs font-bold flex items-center justify-center"
            style={{
              background: '#2a9d8f',
              animation: `bounceIn 0.4s ease both ${i * 0.08}s`,
            }}
          >
            {i + 1}
          </div>
        ))}
      </div>

      <div className="w-full max-w-xs mt-2">
        <ContinueButton
          onClick={onNext}
          label={hasNext ? 'Leçon suivante →' : 'Retour au parcours'}
        />
      </div>
    </div>
  )
}

// ── Composant principal ───────────────────────────────────────────────────────

export default function LessonClient({
  lesson,
  exercises: _exercises,
  userId,
  nextLessonId,
  isLastLesson,
}: {
  lesson:         any
  exercises:      any[]
  userId:         string
  nextLessonId?:  string | null
  isLastLesson?:  boolean
}) {
  const router    = useRouter()
  const { speak } = useAudio()

  const { addXP, addGemmes, incrementStreak, updateQuete, completeLesson } = useUserProgress()

  // ── Données lettres ───────────────────────────────────────────────────────
  // Priorité : groupe de lettres de la leçon (letterGroups.ts) > exercices DB
  const letterGroup: DarijaLetter[] = LETTER_GROUPS[lesson?.slug ?? ''] ?? []
  const hasLetterGroup = letterGroup.length > 0

  // Pour les exercices à lettre unique : on prend la 1ère lettre du groupe
  const target = letterGroup[0] ?? { letter: '', latin: '', fr: '' }
  const pool   = letterGroup.slice(1)

  // ── DB exercises ──────────────────────────────────────────────────────────
  const DB_TYPES = ['MULTIPLE_CHOICE', 'FILL_BLANK', 'TRANSLATION', 'REORDER', 'LISTENING']
  const dbExercises = Array.isArray(_exercises)
    ? _exercises.filter((e: any) => e?.id && DB_TYPES.includes(e?.type))
    : []

  // ── TOUS les hooks inconditionnellement ──────────────────────────────────

  // Index pour le défilement des FlashCards (une par lettre du groupe)
  const [flashLetterIdx, setFlashLetterIdx] = useState(0)

  // Données générées une seule fois au montage (basées sur le groupe de lettres)
  const [choixChoices]  = useState<DarijaLetter[]>(() =>
    letterGroup.length >= 3
      ? shuffle([target, ...shuffle(pool).slice(0, 2)])
      : [target]
  )
  const [assocPairs]    = useState<DarijaLetter[]>(() =>
    shuffle(letterGroup.slice(0, Math.min(4, letterGroup.length)))
  )
  const [pairsPairs]    = useState<DarijaLetter[]>(() =>
    shuffle(letterGroup.slice(0, Math.min(5, letterGroup.length)))
  )
  const [entChoices]    = useState<DarijaLetter[]>(() =>
    letterGroup.length >= 4
      ? shuffle([target, ...shuffle(pool).slice(0, 3)])
      : shuffle(letterGroup)
  )
  const [vraiFauxData]  = useState(() => {
    const isTrue = pool.length > 0 ? Math.random() > 0.5 : true
    return { proposed: isTrue ? (target.latin ?? '') : (pool[0]?.latin ?? ''), isTrue }
  })
  const [dicterChoices] = useState<string[]>(() =>
    shuffle([target.latin ?? '', ...shuffle(pool).slice(0, 6).map(l => l.latin ?? '')])
  )

  const [phase,       setPhase]    = useState<Phase>("flashcard")
  const [hearts,      setHearts]   = useState(5)
  const [answered,    setAnswered] = useState(false)
  const [isCorrect,   setIsCorrect]= useState<boolean | null>(null)
  const [feedbackMsg, setFeedback] = useState("")
  const [xpAdded,     setXpAdded] = useState(false)

  // XP gagné une seule fois à la fin (flow alphabet)
  useEffect(() => {
    if (phase === "finished" && !xpAdded) {
      addXP(50)
      addGemmes(10)
      incrementStreak()
      completeLesson(lesson.id)
      updateQuete('lecons', 1)
      updateQuete('xp', 50)
      setXpAdded(true)
    }
  }, [phase]) // eslint-disable-line react-hooks/exhaustive-deps

  // handleFinish pour GenericExercisePlayer (doit être défini avant le return conditionnel)
  const handleGenericFinish = async (xp: number, answers: CollectedAnswer[]) => {
    try {
      await submitLesson(lesson.id, { answers })
    } catch { /* silencieux si backend indispo */ }

    addXP(xp)
    addGemmes(Math.floor(xp / 5))
    incrementStreak()
    completeLesson(lesson.id)
    updateQuete('lecons', 1)
    updateQuete('xp', xp)

    const moduleId = lesson?.moduleId ?? ''
    const dest = moduleId
      ? `/progress/${moduleId}${isLastLesson ? '?unitComplete=true' : ''}`
      : '/progress'
    router.push(dest)
  }

  // ── Si pas de groupe de lettres → exercices DB (player générique) ─────────
  if (!hasLetterGroup && dbExercises.length > 0) {
    return (
      <GenericExercisePlayer
        exercises={dbExercises}
        onFinish={handleGenericFinish}
      />
    )
  }

  // ── Helpers ──────────────────────────────────────────────────────────────

  const getCurrentExPhase = (): ExPhase => {
    if (EX_PHASES.includes(phase as ExPhase)) return phase as ExPhase
    const trnMap: Record<TrnPhase, ExPhase> = {
      t1: "choix", t2: "association", t3: "paires",
      t4: "entendre", t5: "vrai_faux", t6: "dicter",
    }
    return trnMap[phase as TrnPhase] ?? "flashcard"
  }

  const mainPhase  = phase === "finished" ? "dicter" : getCurrentExPhase()
  const [lo]       = WEIGHTS[mainPhase]
  const globalPct  = phase === "finished" ? 100 : lo
  const phaseIdx   = EX_PHASES.indexOf(mainPhase)
  const showHearts = HEART_PHASES.includes(mainPhase)
  const showFooter = FEEDBACK_PHASES.includes(phase as ExPhase) && answered

  const advancePhase = () => {
    const i = PHASE_SEQUENCE.indexOf(phase)
    if (i < PHASE_SEQUENCE.length - 1) {
      setPhase(PHASE_SEQUENCE[i + 1])
      setAnswered(false)
      setIsCorrect(null)
      setFeedback("")
    }
  }

  // FlashCard : défile toutes les lettres du groupe avant de passer à la phase suivante
  const handleFlashContinue = () => {
    if (flashLetterIdx < letterGroup.length - 1) {
      setFlashLetterIdx(i => i + 1)
    } else {
      advancePhase()
    }
  }

  const handleSuccess = () => {
    setAnswered(true)
    setIsCorrect(true)
    setFeedback("Bonne réponse ! 🎉")
  }

  const handleFailed = (correctLatin?: string) => {
    setAnswered(true)
    setIsCorrect(false)
    setHearts(h => Math.max(0, h - 1))
    setFeedback(`La bonne réponse était : ${correctLatin ?? target.latin}`)
  }

  const handleSpeak = (l: DarijaLetter) => speak(l.letter, "ar-MA")

  const handleNext = () => {
    const moduleId = lesson?.moduleId ?? ''
    const dest = moduleId
      ? `/progress/${moduleId}${isLastLesson ? '?unitComplete=true' : ''}`
      : '/progress'
    router.push(dest)
  }

  // ── Écran de fin ─────────────────────────────────────────────────────────
  if (phase === "finished") {
    return (
      <div className="min-h-screen bg-[#f8f9fa] flex flex-col items-center justify-center px-4">
        <ExerciseCard className="max-w-sm w-full">
          <FinishedScreen onNext={handleNext} hasNext={!!nextLessonId} />
        </ExerciseCard>
      </div>
    )
  }

  // ── Écran de transition ───────────────────────────────────────────────────
  if (["t1","t2","t3","t4","t5","t6"].includes(phase)) {
    const trn = TRANSITIONS[phase as TrnPhase]
    return (
      <div className="min-h-screen bg-[#f8f9fa] flex flex-col items-center justify-center px-4">
        <ExerciseCard className="max-w-sm w-full">
          <TransitionScreen {...trn} onContinue={advancePhase} />
        </ExerciseCard>
      </div>
    )
  }

  // ── Lettre courante pour la FlashCard ─────────────────────────────────────
  const flashTarget = letterGroup[flashLetterIdx] ?? target

  // Indicateur "X / N" pour les FlashCards
  const flashProgress = letterGroup.length > 1
    ? `${flashLetterIdx + 1} / ${letterGroup.length}`
    : undefined

  // ── Rendu de l'exercice courant ───────────────────────────────────────────
  const renderExercise = () => {
    switch (phase as ExPhase) {
      case "flashcard":
        return (
          <FlashCard
            letter={flashTarget}
            onContinue={handleFlashContinue}
            onSpeak={handleSpeak}
            progress={flashProgress}
          />
        )
      case "choix":
        return (
          <ChoixLettre
            letter={target}
            choices={choixChoices}
            onSuccess={handleSuccess}
            onFailed={handleFailed}
            onSpeak={handleSpeak}
          />
        )
      case "association":
        return <AssocierLettres pairs={assocPairs} onConfirm={advancePhase} />
      case "paires":
        return <TrouverLesPaires pairs={pairsPairs} onConfirm={advancePhase} />
      case "entendre":
        return (
          <EntendreEtChoisir
            letter={target}
            choices={entChoices}
            onSuccess={handleSuccess}
            onFailed={handleFailed}
            onSpeak={handleSpeak}
          />
        )
      case "vrai_faux":
        return (
          <VraiFaux
            letter={target}
            proposed={vraiFauxData.proposed}
            isTrue={vraiFauxData.isTrue}
            onSuccess={handleSuccess}
            onFailed={handleFailed}
            onSpeak={handleSpeak}
          />
        )
      case "dicter":
        return (
          <DicterRomanisation
            letter={target}
            choices={dicterChoices}
            onSuccess={handleSuccess}
            onFailed={handleFailed}
            onSpeak={handleSpeak}
          />
        )
      default:
        return null
    }
  }

  // ── Rendu principal ───────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-[#f8f9fa] flex flex-col">

      {/* ── HEADER ─────────────────────────────────────────────────────── */}
      <header className="sticky top-0 z-50 bg-white border-b border-gray-100 px-4 py-3">

        {/* Ligne 1 : retour + barre de progression + cœurs */}
        <div className="flex items-center gap-3 mb-2">
          <button
            onClick={() => router.back()}
            className="w-8 h-8 flex items-center justify-center text-gray-400 hover:text-gray-600 flex-shrink-0 transition-colors text-lg font-bold"
          >
            ✕
          </button>

          <div className="flex-1 h-4 bg-gray-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-[#58cc02] rounded-full transition-all duration-500"
              style={{ width: `${globalPct}%` }}
            />
          </div>

          <span className="text-sm font-bold text-[#58cc02] min-w-[36px] text-right">
            {globalPct}%
          </span>

          {showHearts && (
            <div className="flex items-center gap-0.5 flex-shrink-0">
              {Array.from({ length: 5 }).map((_, i) => (
                <span key={i} className={`text-sm ${i < hearts ? 'text-red-400' : 'text-gray-200'}`}>♥</span>
              ))}
            </div>
          )}
        </div>

        {/* Ligne 2 : pastilles phases */}
        <div className="flex items-center justify-center gap-1.5">
          {EX_PHASES.map((_, i) => {
            const isDone   = i < phaseIdx
            const isActive = i === phaseIdx
            return (
              <div
                key={i}
                title={PHASE_LABELS[i]}
                className={`flex items-center justify-center rounded-full text-[10px] font-bold transition-all duration-200 ${
                  isDone   ? 'w-6 h-6 bg-[#58cc02] text-white' :
                  isActive ? 'w-7 h-7 bg-[#1b3a6b] text-white' :
                             'w-6 h-6 bg-gray-200 text-gray-400'
                }`}
              >
                {i + 1}
              </div>
            )
          })}
        </div>
      </header>

      {/* ── CONTENU ────────────────────────────────────────────────────── */}
      <main className="flex-1 flex flex-col items-center px-4 py-6 pb-32">
        <ExerciseCard className="max-w-lg w-full">
          {renderExercise()}
        </ExerciseCard>
      </main>

      {/* ── FOOTER FEEDBACK + CONTINUER ────────────────────────────────── */}
      {showFooter && (
        <footer className="fixed bottom-0 left-0 right-0 z-50 flex flex-col" style={{ animation: 'fadeUp 0.2s ease both' }}>
          <FeedbackBanner
            type={isCorrect ? "correct" : "incorrect"}
            message={feedbackMsg}
          />
          <div className="bg-white border-t border-gray-200 px-4 py-4">
            <div className="max-w-lg mx-auto">
              <ContinueButton onClick={advancePhase} label="Continuer →" />
            </div>
          </div>
        </footer>
      )}
    </div>
  )
}
