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
// Phases avec footer (PASSER + VALIDER/CONTINUER)
const FEEDBACK_PHASES: ExPhase[] = ["choix", "entendre", "vrai_faux", "dicter"]
// Phases sans feedback binaire (matching) — juste PASSER + CONTINUER quand tout trouvé
const MATCHING_PHASES: ExPhase[] = ["association", "paires"]
const FOOTER_PHASES: ExPhase[] = [...FEEDBACK_PHASES, ...MATCHING_PHASES]

const shuffle = <T,>(arr: T[]): T[] => [...arr].sort(() => Math.random() - 0.5)

// ── Modal Signaler ────────────────────────────────────────────────────────────

const SIGNALER_OPTIONS = [
  { id: 'enregistrement', label: <>Il y a un problème avec <strong>l&apos;enregistrement</strong>.</> },
  { id: 'indices_faux',   label: <><strong>Les indices</strong> sont faux.</> },
  { id: 'son_manque',     label: <>Il manque <strong>le son</strong>.</> },
  { id: 'indices_manque', label: <>Il manque <strong>des indices</strong>.</> },
  { id: 'ma_reponse',     label: <><strong>Ma réponse</strong> ne devrait pas être acceptée.</> },
  { id: 'autre',          label: <><strong>Un autre problème</strong> s&apos;est produit.</> },
]

function SignalerModal({ onClose }: { onClose: () => void }) {
  const [selected, setSelected] = useState<Set<string>>(new Set())
  const [sent, setSent] = useState(false)

  const toggle = (id: string) => {
    setSelected(prev => {
      const next = new Set(prev)
      next.has(id) ? next.delete(id) : next.add(id)
      return next
    })
  }

  const handleEnvoyer = async () => {
    if (selected.size === 0) return
    try {
      await fetch(`${process.env.NEXT_PUBLIC_API_URL}/signalement`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ reasons: Array.from(selected) }),
      })
    } catch { /* silencieux */ }
    setSent(true)
    setTimeout(onClose, 1200)
  }

  return (
    <div
      className="fixed inset-0 z-[200] flex items-end sm:items-center justify-center"
      style={{ background: 'rgba(0,0,0,0.7)' }}
      onClick={onClose}
    >
      <div
        className="w-full max-w-sm rounded-t-3xl sm:rounded-3xl p-6 flex flex-col gap-4"
        style={{ background: '#1e2d35', border: '1px solid #2a3d47' }}
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between">
          <span className="font-black text-white text-base">Signaler un problème</span>
          <button onClick={onClose} className="text-[#6b7f8a] hover:text-white text-xl font-bold">✕</button>
        </div>

        {sent ? (
          <div className="text-center py-4">
            <div className="text-4xl mb-2">✅</div>
            <p className="text-white font-bold">Merci pour ton signalement !</p>
          </div>
        ) : (
          <>
            {/* Options */}
            <div className="flex flex-col gap-2">
              {SIGNALER_OPTIONS.map(opt => {
                const isSelected = selected.has(opt.id)
                return (
                  <button
                    key={opt.id}
                    onClick={() => toggle(opt.id)}
                    className="flex items-center gap-3 text-left px-4 py-3 rounded-xl transition-all"
                    style={{
                      background: isSelected ? 'rgba(28,176,246,0.1)' : 'transparent',
                      border: `2px solid ${isSelected ? '#1cb0f6' : '#2a3d47'}`,
                    }}
                  >
                    <span
                      className="w-5 h-5 rounded flex-shrink-0 flex items-center justify-center"
                      style={{
                        border: `2px solid ${isSelected ? '#1cb0f6' : '#4a5d6a'}`,
                        background: isSelected ? '#1cb0f6' : 'transparent',
                      }}
                    >
                      {isSelected && <span className="text-white text-xs font-black">✓</span>}
                    </span>
                    <span className="text-sm text-white leading-snug">{opt.label}</span>
                  </button>
                )
              })}
            </div>

            {/* Bouton envoyer */}
            <button
              onClick={handleEnvoyer}
              disabled={selected.size === 0}
              className="w-full py-3 rounded-2xl font-black text-sm uppercase tracking-widest transition-all"
              style={{
                background: selected.size > 0 ? '#58cc02' : '#2a3d47',
                color: selected.size > 0 ? 'white' : '#4a5d6a',
                boxShadow: selected.size > 0 ? '0 4px 0 #46a302' : 'none',
                cursor: selected.size === 0 ? 'not-allowed' : 'pointer',
              }}
            >
              ENVOYER
            </button>
          </>
        )}
      </div>
    </div>
  )
}

const SUCCESS_MESSAGES = [
  "Super !",
  "Excellent !",
  "Parfait !",
  "Bravo !",
  "Bien joué !",
  "C'est ça !",
  "Magnifique !",
  "Tu assures !",
]
const randomSuccess = () => SUCCESS_MESSAGES[Math.floor(Math.random() * SUCCESS_MESSAGES.length)]

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
      <h2 className="text-2xl font-bold text-white">{title}</h2>
      <p className="text-sm text-[#8a9baa] max-w-xs">{sub}</p>
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
      <h2 className="text-2xl font-bold text-white">Leçon terminée !</h2>
      <p className="text-sm text-[#8a9baa] max-w-xs">
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
  vocabulary: _vocabulary,
  userId,
  nextLessonId,
  isLastLesson,
}: {
  lesson:         any
  exercises:      any[]
  vocabulary?:    any[]
  userId:         string
  nextLessonId?:  string | null
  isLastLesson?:  boolean
}) {
  const router    = useRouter()
  const { speak } = useAudio()

  const { addXP, addGemmes, incrementStreak, updateQuete, completeLesson } = useUserProgress()

  // ── Données lettres ───────────────────────────────────────────────────────
  // Priorité : groupe de lettres de la leçon (letterGroups.ts) > vocabulaire DB
  const staticGroup: DarijaLetter[] = LETTER_GROUPS[lesson?.slug ?? ''] ?? []
  const vocabGroup: DarijaLetter[] = Array.isArray(_vocabulary)
    ? _vocabulary
        .filter(v => v?.word)
        .map(v => ({
          letter: v.word as string,
          latin:  (v.transliteration ?? '') as string,
          fr:     ((v.translation as any)?.fr ?? '') as string,
        }))
    : []
  const letterGroup: DarijaLetter[] = staticGroup.length > 0 ? staticGroup : vocabGroup
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

  // File de phases : la phase courante est toujours queue[0]
  const [queue, setQueue] = useState<Phase[]>(PHASE_SEQUENCE.filter(p => p !== 'finished'))
  const phase = queue[0] ?? 'finished'

  const [hearts,      setHearts]   = useState(5)
  const [answered,    setAnswered] = useState(false)
  const [isCorrect,   setIsCorrect]= useState<boolean | null>(null)
  const [feedbackMsg, setFeedback] = useState("")
  const [xpAdded,     setXpAdded] = useState(false)
  const [isReady,      setIsReady]      = useState(false)
  const [shouldValidate, setShouldValidate] = useState(false)
  const [renderKey,    setRenderKey]    = useState(0)
  const [showSignaler, setShowSignaler] = useState(false)

  // Quand toutes les paires sont trouvées (matching), déclencher le succès automatiquement
  useEffect(() => {
    const matching = MATCHING_PHASES.includes(phase as ExPhase)
    if (isReady && matching && !answered) {
      setAnswered(true)
      setIsCorrect(true)
      setFeedback(randomSuccess())
    }
  }, [isReady, phase, answered]) // eslint-disable-line react-hooks/exhaustive-deps

  // XP gagné une seule fois à la fin (flow alphabet)
  useEffect(() => {
    if (queue.length === 0 && !xpAdded) {
      addXP(50)
      addGemmes(10)
      incrementStreak()
      completeLesson(lesson.id)
      updateQuete('lecons', 1)
      updateQuete('xp', 50)
      setXpAdded(true)
    }
  }, [queue.length]) // eslint-disable-line react-hooks/exhaustive-deps

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

    router.push('/progress')
  }

  // ── Si pas de groupe de lettres ni vocab DB → exercices DB (player générique) ─
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
  const showFooter   = FOOTER_PHASES.includes(phase as ExPhase)
  const isMatching   = MATCHING_PHASES.includes(phase as ExPhase)

  const resetPhaseState = () => {
    setAnswered(false)
    setIsCorrect(null)
    setFeedback("")
    setIsReady(false)
    setShouldValidate(false)
    setRenderKey(k => k + 1)
  }

  const advancePhase = () => {
    setQueue(q => q.slice(1))
    resetPhaseState()
  }

  // Appelé par le bouton CONTINUER après feedback
  const handleContinuer = () => {
    if (isCorrect === false) {
      resetPhaseState()  // mauvaise réponse → on reste sur la phase
    } else {
      advancePhase()  // bonne réponse → phase suivante
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
    setShouldValidate(false)
    setAnswered(true)
    setIsCorrect(true)
    setFeedback(randomSuccess())
  }

  const handleFailed = (correctHint?: string) => {
    setShouldValidate(false)
    setAnswered(true)
    setIsCorrect(false)
    setHearts(h => Math.max(0, h - 1))
    setFeedback(correctHint ?? target.latin)
  }

  const handlePasser = () => {
    advancePhase()
  }

  const handleValider = () => {
    if (!isReady) return
    if (isMatching) {
      advancePhase()
    } else {
      setShouldValidate(true)
    }
  }

  const handleSpeak = (l: DarijaLetter) => speak(l.letter, "ar-MA")

  const handleNext = () => {
    router.push('/progress')
  }

  // ── Écran de fin ─────────────────────────────────────────────────────────
  if (phase === "finished") {
    return (
      <div className="min-h-screen bg-[#131f24] flex flex-col items-center justify-center px-4">
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
      <div className="min-h-screen bg-[#131f24] flex flex-col items-center justify-center px-4">
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
            mode={staticGroup.length > 0 ? 'lettre' : 'mot'}
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
            onReadyChange={setIsReady}
            shouldValidate={shouldValidate}
          />
        )
      case "association":
        return <AssocierLettres pairs={assocPairs} onConfirm={advancePhase} onReadyChange={setIsReady} />
      case "paires":
        return <TrouverLesPaires pairs={pairsPairs} onConfirm={advancePhase} onReadyChange={setIsReady} />
      case "entendre":
        return (
          <EntendreEtChoisir
            letter={target}
            choices={entChoices}
            onSuccess={handleSuccess}
            onFailed={handleFailed}
            onSpeak={handleSpeak}
            onReadyChange={setIsReady}
            shouldValidate={shouldValidate}
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
            onReadyChange={setIsReady}
            shouldValidate={shouldValidate}
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
            onReadyChange={setIsReady}
            shouldValidate={shouldValidate}
          />
        )
      default:
        return null
    }
  }

  // ── Rendu principal ───────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-[#131f24] flex flex-col">

      {/* ── HEADER ─────────────────────────────────────────────────────── */}
      <header className="sticky top-0 z-50 bg-[#131f24] px-4 py-3">

        {/* Ligne 1 : retour + barre de progression + cœurs */}
        <div className="flex items-center gap-3 mb-2">
          <button
            onClick={() => router.back()}
            className="w-8 h-8 flex items-center justify-center text-[#6b7f8a] hover:text-white flex-shrink-0 transition-colors text-lg font-bold"
          >
            ✕
          </button>

          <div className="flex-1 h-4 bg-[#2a3d47] rounded-full overflow-hidden">
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
                  isActive ? 'w-7 h-7 bg-[#1cb0f6] text-white' :
                             'w-6 h-6 bg-[#2a3d47] text-[#6b7f8a]'
                }`}
              >
                {i + 1}
              </div>
            )
          })}
        </div>
      </header>

      {/* ── CONTENU ────────────────────────────────────────────────────── */}
      <main className="flex-1 flex flex-col items-center px-4 py-6 pb-40">
        <ExerciseCard className="max-w-lg w-full" key={renderKey}>
          {renderExercise()}
        </ExerciseCard>
      </main>

      {/* ── MODAL SIGNALER ──────────────────────────────────────────────── */}
      {showSignaler && <SignalerModal onClose={() => setShowSignaler(false)} />}

      {/* ── FOOTER ──────────────────────────────────────────────────────── */}
      {showFooter && (
        <footer className="fixed bottom-0 left-0 right-0 z-50">
          {!answered ? (
            /* Before validation */
            <div className="bg-[#1e2d35] border-t border-[#2a3d47] px-4 py-4" style={{ animation: 'fadeUp 0.15s ease both' }}>
              <div className="max-w-lg mx-auto">
                <button
                  onClick={isReady ? handleValider : undefined}
                  disabled={!isReady}
                  className={`w-full py-4 rounded-2xl font-black text-base uppercase tracking-widest transition-all ${
                    isReady
                      ? "bg-[#58cc02] text-white hover:bg-[#46a302] active:translate-y-0.5"
                      : "bg-[#2a3d47] text-[#4a5d6a] cursor-not-allowed"
                  }`}
                  style={isReady ? { boxShadow: '0 4px 0 #46a302' } : {}}
                >
                  {isMatching ? "CONTINUER" : "VALIDER"}
                </button>
              </div>
            </div>
          ) : (
            /* After validation */
            <div style={{ animation: 'fadeUp 0.2s ease both' }}>
              {/* Feedback row */}
              <div className={`px-6 py-4 border-t ${
                isCorrect
                  ? 'bg-[#1a3328] border-[#34d399]/20'
                  : 'bg-[#3a1e1e] border-red-500/20'
              }`}>
                <div className="max-w-lg mx-auto flex items-center gap-4">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 font-black text-lg text-white ${
                    isCorrect ? 'bg-[#58cc02]' : 'bg-[#ff4b4b]'
                  }`}>
                    {isCorrect ? '✓' : '✗'}
                  </div>
                  <div>
                    <div className={`font-black text-sm ${isCorrect ? 'text-[#58cc02]' : 'text-[#ff4b4b]'}`}>
                      {isCorrect ? feedbackMsg : 'La bonne réponse est :'}
                    </div>
                    {!isCorrect && (
                      <div className="text-white text-sm font-bold mt-0.5">{feedbackMsg}</div>
                    )}
                    <button
                      onClick={() => setShowSignaler(true)}
                      className="flex items-center gap-1 mt-1 text-[11px] font-bold uppercase tracking-wider opacity-60 hover:opacity-100 transition-opacity"
                      style={{ color: isCorrect ? '#58cc02' : '#ff4b4b' }}
                    >
                      <span>↩</span> SIGNALER
                    </button>
                  </div>
                </div>
              </div>
              {/* CONTINUER button */}
              <div className={`px-4 py-4 ${isCorrect ? 'bg-[#1a3328]' : 'bg-[#3a1e1e]'}`}>
                <div className="max-w-lg mx-auto">
                  <button
                    onClick={handleContinuer}
                    className={`w-full py-4 rounded-2xl font-black text-base uppercase tracking-widest text-white active:translate-y-0.5 transition-all ${
                      isCorrect
                        ? 'bg-[#58cc02] hover:bg-[#46a302]'
                        : 'bg-[#ff4b4b] hover:bg-[#cc2a2a]'
                    }`}
                    style={{ boxShadow: isCorrect ? '0 4px 0 #46a302' : '0 4px 0 #cc2a2a' }}
                  >
                    CONTINUER →
                  </button>
                </div>
              </div>
            </div>
          )}
        </footer>
      )}
    </div>
  )
}
