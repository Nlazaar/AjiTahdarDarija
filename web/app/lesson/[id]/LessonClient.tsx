"use client"

import React, { useState, useEffect, useMemo, useRef } from "react"
import { useRouter } from "next/navigation"
import { useAudio } from "@/hooks/useAudio"
import { LETTER_GROUPS, MSA_ALPHABET_LETTERS } from "@/data/letterGroups"
import type { DarijaLetter, AlphabetLetter } from "@/components/exercises/types"
import { ExerciseCard, ContinueButton, FeedbackBanner } from "@/components/ui"
import GenericExercisePlayer, { type CollectedAnswer } from "@/components/exercises/GenericExercisePlayer"
import { submitLesson, markVocabSeen, markVocabResult } from "@/lib/api"
import { useUserProgress } from "@/contexts/UserProgressContext"
import { getSettings } from "@/hooks/useSettings"

import LessonVideo        from "@/components/LessonVideo"
import FlashCard          from "@/components/exercises/FlashCard"
import HarakatCard        from "@/components/exercises/HarakatCard"
import ChoixLettre        from "@/components/exercises/ChoixLettre"
import AssocierLettres    from "@/components/exercises/AssocierLettres"
import TrouverLesPaires   from "@/components/exercises/TrouverLesPaires"
import EntendreEtChoisir  from "@/components/exercises/EntendreEtChoisir"
import VraiFaux           from "@/components/exercises/VraiFaux"
import DicterRomanisation from "@/components/exercises/DicterRomanisation"
import NumeroterOrdre     from "@/components/exercises/NumeroterOrdre"
import PlacerDansEtoile   from "@/components/exercises/PlacerDansEtoile"
import TexteReligieux     from "@/components/exercises/TexteReligieux"
import SelectionImages    from "@/components/exercises/SelectionImages"
import TriDeuxCategories  from "@/components/exercises/TriDeuxCategories"
import RelierParTrait     from "@/components/exercises/RelierParTrait"

// ── Types ────────────────────────────────────────────────────────────────────

type ExPhase  = "flashcard" | "harakat" | "choix" | "association" | "paires" | "entendre" | "vrai_faux" | "dicter" | "numeroter" | "placer_etoile" | "texte_religieux" | "selection_images" | "tri_deux_cat" | "relier_trait"
type TrnPhase = "t1" | "t2" | "t3" | "t4" | "t5" | "t6"
type Phase    = ExPhase | TrnPhase | "video" | "finished" | "empty"

// ── Mapping registry key (PascalCase) ↔ phase interne (lowercase) ─────────────
// La séquence est stockée en DB avec les clés du registry (ex. "FlashCard"),
// mais le moteur de rendu utilise les phases internes historiques.
const REGISTRY_TO_PHASE: Record<string, ExPhase> = {
  FlashCard:          "flashcard",
  ChoixLettre:        "choix",
  AssocierLettres:    "association",
  TrouverLesPaires:   "paires",
  EntendreEtChoisir:  "entendre",
  VraiFaux:           "vrai_faux",
  DicterRomanisation: "dicter",
  NumeroterOrdre:     "numeroter",
  PlacerDansEtoile:   "placer_etoile",
  TexteReligieux:     "texte_religieux",
  SelectionImages:    "selection_images",
  TriDeuxCategories:  "tri_deux_cat",
  RelierParTrait:     "relier_trait",
}

const TRN_KEYS: TrnPhase[] = ["t1", "t2", "t3", "t4", "t5", "t6"]

/**
 * Construit la séquence de phases (queue) à partir d'une liste de clés du registry.
 * Insère automatiquement une transition (t1..t6) entre chaque exercice consécutif.
 * Retourne null si la séquence est invalide (vide ou aucune clé connue).
 *
 * Note: la flashcard est une présentation passive (pas un exercice validé),
 * on ne montre donc pas d'écran de félicitations juste après.
 */
function buildPhaseQueue(registryKeys: string[]): Phase[] | null {
  const phases = registryKeys
    .map(k => REGISTRY_TO_PHASE[k])
    .filter((p): p is ExPhase => !!p)
  if (phases.length === 0) return null

  const out: Phase[] = []
  let trnIdx = 0
  phases.forEach((p, i) => {
    out.push(p)
    if (i < phases.length - 1 && p !== "flashcard") {
      out.push(TRN_KEYS[trnIdx % TRN_KEYS.length])
      trnIdx++
    }
  })
  return out
}

// ── Constants ────────────────────────────────────────────────────────────────

const EX_PHASES: ExPhase[] = ["flashcard", "harakat", "choix", "association", "paires", "entendre", "vrai_faux", "dicter", "numeroter", "placer_etoile", "texte_religieux", "selection_images", "tri_deux_cat", "relier_trait"]

const PHASE_LABELS = ["Lettres", "Voyelles", "Prononc.", "Associer", "Paires", "Écoute", "Vrai/Faux", "Dicter", "Ordre", "Étoile", "Lecture", "Choisir", "Trier", "Relier"]

const PHASE_SEQUENCE: Phase[] = [
  "flashcard", "harakat", "t1",
  "choix",     "t2",
  "association","t3",
  "paires",    "t4",
  "entendre",  "t5",
  "vrai_faux", "t6",
  "dicter",    "finished",
]

// Sequence for vocab lessons (no harakat)
// Pas de transition après flashcard (présentation passive, pas d'exercice validé).
const VOCAB_PHASE_SEQUENCE: Phase[] = [
  "flashcard",
  "choix",     "t1",
  "association","t2",
  "paires",    "t3",
  "entendre",  "t4",
  "vrai_faux", "t5",
  "dicter",    "finished",
]

const TRANSITIONS: Record<TrnPhase, { emoji: string; title: string; sub: string }> = {
  t1: { emoji: "⭐", title: "Super !",                 sub: "Choisis la bonne prononciation."  },
  t2: { emoji: "🎯", title: "Bien joué !",             sub: "Associe les lettres à leur son."   },
  t3: { emoji: "🔥", title: "Tu cartonnes !",          sub: "Trouve les paires."                },
  t4: { emoji: "⚡", title: "Excellent !",             sub: "Écoute et identifie."              },
  t5: { emoji: "🎯", title: "Dernière ligne droite !", sub: "Vrai ou Faux ?"                    },
  t6: { emoji: "🏆", title: "Presque fini !",          sub: "Écris la romanisation."            },
}

const HEART_PHASES: ExPhase[] = ["paires", "entendre", "vrai_faux"]
const FEEDBACK_PHASES: ExPhase[] = ["choix", "entendre", "vrai_faux", "dicter"]
const MATCHING_PHASES: ExPhase[] = ["association", "paires", "numeroter", "placer_etoile", "selection_images", "tri_deux_cat", "relier_trait"]
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
  "Super !", "Excellent !", "Parfait !", "Bravo !",
  "Bien joué !", "C'est ça !", "Magnifique !", "Tu assures !",
]
const randomSuccess = () => SUCCESS_MESSAGES[Math.floor(Math.random() * SUCCESS_MESSAGES.length)]

// ── Composants internes ───────────────────────────────────────────────────────

function TransitionScreen({ emoji, title, sub, onContinue, animate = true }: {
  emoji: string; title: string; sub: string; onContinue: () => void; animate?: boolean
}) {
  return (
    <div
      className="flex flex-col items-center gap-4 py-12 px-4 text-center"
      style={animate ? { animation: 'fadeUp 0.4s ease both' } : undefined}
    >
      <span className="text-7xl" style={animate ? { animation: 'bounceIn 0.5s ease both 0.1s' } : undefined}>
        {emoji}
      </span>
      <h2 className="text-2xl font-bold text-white">{title}</h2>
      <p className="text-sm text-[#8a9baa] max-w-xs">{sub}</p>
      <div className="w-full max-w-xs mt-2">
        <ContinueButton onClick={onContinue} label="Continuer" />
      </div>
    </div>
  )
}

function FinishedScreen({ onNext, hasNext, animate = true }: { onNext: () => void; hasNext: boolean; animate?: boolean }) {
  return (
    <div className="flex flex-col items-center gap-4 py-8 px-4 text-center" style={animate ? { animation: 'fadeUp 0.4s ease both' } : undefined}>
      <span className="text-7xl" style={animate ? { animation: 'bounceIn 0.5s ease both' } : undefined}>🎉</span>
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
          label={hasNext ? 'Leçon suivante' : 'Retour au parcours'}
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
  authoredExercises: _authoredExercises = [],
  userId,
  nextLessonId,
  isLastLesson,
}: {
  lesson:             any
  exercises:          any[]
  vocabulary?:        any[]
  authoredExercises?: any[]
  userId:             string
  nextLessonId?:      string | null
  isLastLesson?:      boolean
}) {
  const router    = useRouter()
  const { speak } = useAudio()
  const settings  = getSettings()

  const { addXP, addGemmes, incrementStreak, updateQuete, completeLesson } = useUserProgress()

  // ── Determine if this is an alphabet lesson ──
  const lessonSlug = lesson?.slug ?? ''
  // L'alphabet n'existe qu'en MSA (pas en Darija).
  const isAlphabetLesson = lessonSlug.startsWith('msa-alphabet-')
  const alphabetLetters: AlphabetLetter[] = isAlphabetLesson ? (MSA_ALPHABET_LETTERS[lessonSlug] ?? []) : []

  // ── Données lettres ───────────────────────────────────────────────────────
  // ⚠️ memoizé pour stabiliser les refs : sinon les useMemo en aval (choixData…)
  // se ré-exécutent à chaque render et `shuffle()` change l'ordre des choix.
  const staticGroup: DarijaLetter[] = LETTER_GROUPS[lessonSlug] ?? []
  const vocabGroup = useMemo<DarijaLetter[]>(() => {
    if (!Array.isArray(_vocabulary)) return []
    return _vocabulary.filter(v => v?.word).map(v => ({
      id:       v.id as string,
      letter:   v.word as string,
      latin:    (v.transliteration ?? '') as string,
      fr:       ((v.translation as any)?.fr ?? (v.translation as any)?.default ?? '') as string,
      imageUrl: (v.imageUrl ?? undefined) as string | undefined,
    }))
  }, [_vocabulary])
  const letterGroup: DarijaLetter[] = staticGroup.length > 0 ? staticGroup : vocabGroup
  const hasLetterGroup = letterGroup.length > 0

  const target = letterGroup[0] ?? { letter: '', latin: '', fr: '' }
  const pool   = letterGroup.slice(1)

  // ── Map id → DarijaLetter (pour résoudre les configs authored) ───────────
  const vocabById = useMemo(() => {
    const m = new Map<string, DarijaLetter>()
    if (Array.isArray(_vocabulary)) {
      for (const v of _vocabulary) {
        if (!v?.id) continue
        m.set(v.id, {
          id:       v.id,
          letter:   v.word ?? '',
          latin:    v.transliteration ?? '',
          fr:       (v.translation as any)?.fr ?? (v.translation as any)?.default ?? '',
          imageUrl: v.imageUrl ?? undefined,
        })
      }
    }
    return m
  }, [_vocabulary])

  // Liste authored triée — la queue est construite à partir de cette liste,
  // donc l'index dans la queue (en filtrant les transitions) = index ici.
  const authoredList = useMemo(() => {
    return Array.isArray(_authoredExercises)
      ? [..._authoredExercises].sort((a: any, b: any) => (a?.order ?? 0) - (b?.order ?? 0))
      : []
  }, [_authoredExercises])

  // ── DB exercises ──────────────────────────────────────────────────────────
  const DB_TYPES = ['MULTIPLE_CHOICE', 'FILL_BLANK', 'TRANSLATION', 'REORDER', 'LISTENING']
  const dbExercises = Array.isArray(_exercises)
    ? _exercises.filter((e: any) => e?.id && DB_TYPES.includes(e?.type))
    : []
  const useGenericDbExercises =
    lesson?.content?.presentation === 'generic-db' ||
    lesson?.content?.source?.type === 'pdf-dataset'

  // ── TOUS les hooks inconditionnellement ──────────────────────────────────

  const [flashLetterIdx, setFlashLetterIdx] = useState(0)
  const [harakatLetterIdx, setHarakatLetterIdx] = useState(0)

  // Use alphabet sequence (with harakat), authored exercises, DB-driven sequence, or just flashcards
  const [queue, setQueue] = useState<Phase[]>(() => {
    let seq: Phase[]

    // 1. Exercices authored (LessonExercise[]) — source de vérité prioritaire pour les leçons vocab
    const authoredKeys = Array.isArray(_authoredExercises)
      ? _authoredExercises
          .slice()
          .sort((a: any, b: any) => (a?.order ?? 0) - (b?.order ?? 0))
          .map((ex: any) => ex?.typology)
          .filter((k: any): k is string => typeof k === 'string')
      : []

    // 2. Ancienne séquence stockée en DB (Lesson.content.sequence)
    const dbSeq = (lesson as any)?.content?.sequence

    if (!isAlphabetLesson && authoredKeys.length > 0) {
      const built = buildPhaseQueue(authoredKeys)
      seq = built ?? []
    } else if (!isAlphabetLesson && Array.isArray(dbSeq) && dbSeq.length > 0) {
      const built = buildPhaseQueue(dbSeq as string[])
      seq = built ?? []
    } else if (isAlphabetLesson) {
      seq = PHASE_SEQUENCE.filter(p => p !== 'finished')
    } else {
      // Aucun exercice authored : l'écran "Cours en construction" prendra le relais.
      seq = []
    }

    if (!settings.listeningExercises) seq = seq.filter(p => p !== 'entendre' && p !== 't4')
    if (!settings.encouragement)      seq = seq.filter(p => !['t1','t2','t3','t4','t5','t6'].includes(p))
    if ((lesson as any)?.videoUrl) seq = ['video', ...seq]
    return seq
  })
  const phase: Phase = queue.length === 0 ? 'empty' : queue[0]

  // Séquence d'exercices initiale de CETTE leçon (capturée au 1er rendu,
  // sans vidéo ni transitions). Sert à afficher les pastilles de phases
  // propres à la leçon plutôt que le catalogue global EX_PHASES.
  const initialExSeqRef = useRef<ExPhase[] | null>(null)
  if (initialExSeqRef.current === null) {
    initialExSeqRef.current = queue.filter(p => EX_PHASES.includes(p as ExPhase)) as ExPhase[]
  }
  const lessonExPhases: ExPhase[] = initialExSeqRef.current

  // ── Curseur authored : à quel exercice authored sommes-nous ? ────────────
  // La queue alterne [ex, transition, ex, transition, ...] donc le nombre
  // de phases d'exercice restantes (en comptant la courante) indique notre position.
  const currentAuthored = useMemo(() => {
    if (isAlphabetLesson || authoredList.length === 0) return null
    const remaining = queue.filter(p => EX_PHASES.includes(p as ExPhase)).length
    const consumed  = Math.max(0, authoredList.length - remaining)
    return authoredList[consumed] ?? null
  }, [queue, authoredList, isAlphabetLesson])

  const currentCfg: any   = currentAuthored?.config ?? null
  const customPrompt: string | undefined = typeof currentCfg?.prompt === 'string' && currentCfg.prompt.trim()
    ? currentCfg.prompt.trim()
    : undefined

  // Résout une liste d'IDs vocab → DarijaLetter[]
  const resolveIds = (ids: any): DarijaLetter[] => {
    if (!Array.isArray(ids)) return []
    return ids.map((id: any) => vocabById.get(id)).filter((x): x is DarijaLetter => !!x)
  }

  // FlashCard : liste des items à parcourir
  const flashItems = useMemo<DarijaLetter[]>(() => {
    if (currentAuthored?.typology === 'FlashCard') {
      const items = resolveIds(currentCfg?.vocabIds)
      if (items.length > 0) return items
    }
    return letterGroup
  }, [currentAuthored, currentCfg, vocabById, letterGroup])

  // ChoixLettre : target + 2 distracteurs
  const choixData = useMemo(() => {
    if (currentAuthored?.typology === 'ChoixLettre') {
      const t = vocabById.get(currentCfg?.targetVocabId)
      const d = resolveIds(currentCfg?.distractorVocabIds)
      if (t) return { target: t, choices: shuffle([t, ...d]) }
    }
    const fbT = letterGroup[0] ?? { letter: '', latin: '', fr: '' }
    const fbP = letterGroup.slice(1)
    return {
      target:  fbT,
      choices: letterGroup.length >= 3 ? shuffle([fbT, ...shuffle(fbP).slice(0, 2)]) : [fbT],
    }
  }, [currentAuthored, currentCfg, vocabById, letterGroup])

  // EntendreEtChoisir : target + 3 distracteurs
  const entendreData = useMemo(() => {
    if (currentAuthored?.typology === 'EntendreEtChoisir') {
      const t = vocabById.get(currentCfg?.targetVocabId)
      const d = resolveIds(currentCfg?.distractorVocabIds)
      if (t) return { target: t, choices: shuffle([t, ...d]) }
    }
    const fbT = letterGroup[0] ?? { letter: '', latin: '', fr: '' }
    const fbP = letterGroup.slice(1)
    return {
      target:  fbT,
      choices: letterGroup.length >= 4 ? shuffle([fbT, ...shuffle(fbP).slice(0, 3)]) : shuffle(letterGroup),
    }
  }, [currentAuthored, currentCfg, vocabById, letterGroup])

  // DicterRomanisation : target + 3 distracteurs (latin)
  const dicterData = useMemo(() => {
    if (currentAuthored?.typology === 'DicterRomanisation') {
      const t = vocabById.get(currentCfg?.targetVocabId)
      const d = resolveIds(currentCfg?.distractorVocabIds)
      if (t) return {
        target:  t,
        choices: shuffle([t.latin, ...d.map(x => x.latin)].filter(Boolean) as string[]),
      }
    }
    const fbT = letterGroup[0] ?? { letter: '', latin: '', fr: '' }
    const fbP = letterGroup.slice(1)
    return {
      target:  fbT,
      choices: shuffle([fbT.latin ?? '', ...shuffle(fbP).slice(0, 6).map(l => l.latin ?? '')]),
    }
  }, [currentAuthored, currentCfg, vocabById, letterGroup])

  // VraiFaux : mot affiché + mot proposé (vocab picker) → isTrue auto-calculé
  const vraiFauxData = useMemo(() => {
    if (currentAuthored?.typology === 'VraiFaux') {
      const t = vocabById.get(currentCfg?.targetVocabId)
      if (t) {
        const p = vocabById.get(currentCfg?.proposedVocabId)
        if (p) return {
          target:   t,
          proposed: { latin: p.latin ?? '', fr: p.fr },
          isTrue:   currentCfg?.targetVocabId === currentCfg?.proposedVocabId,
        }
        // Backward compat : ancien format proposedRomanisation + isTrue manuel
        return {
          target:   t,
          proposed: { latin: typeof currentCfg?.proposedRomanisation === 'string' ? currentCfg.proposedRomanisation : (t.latin ?? '') },
          isTrue:   currentCfg?.isTrue !== false,
        }
      }
    }
    const fbT = letterGroup[0] ?? { letter: '', latin: '', fr: '' }
    const fbP = letterGroup.slice(1)
    const isTrue = fbP.length > 0 ? Math.random() > 0.5 : true
    const pSrc = isTrue ? fbT : (fbP[0] ?? fbT)
    return {
      target:   fbT,
      proposed: { latin: pSrc.latin ?? '', fr: pSrc.fr },
      isTrue,
    }
  }, [currentAuthored, currentCfg, vocabById, letterGroup])

  // AssocierLettres : 4 paires
  const assocPairs = useMemo<DarijaLetter[]>(() => {
    if (currentAuthored?.typology === 'AssocierLettres') {
      const items = resolveIds(currentCfg?.vocabIds)
      if (items.length > 0) return shuffle(items)
    }
    return shuffle(letterGroup.slice(0, Math.min(4, letterGroup.length)))
  }, [currentAuthored, currentCfg, vocabById, letterGroup])

  // TrouverLesPaires : 5 paires
  const pairsPairs = useMemo<DarijaLetter[]>(() => {
    if (currentAuthored?.typology === 'TrouverLesPaires') {
      const items = resolveIds(currentCfg?.vocabIds)
      if (items.length > 0) return shuffle(items)
    }
    return shuffle(letterGroup.slice(0, Math.min(5, letterGroup.length)))
  }, [currentAuthored, currentCfg, vocabById, letterGroup])

  // NumeroterOrdre : items avec correctPos
  const numeroterData = useMemo(() => {
    if (currentAuthored?.typology === 'NumeroterOrdre' && Array.isArray(currentCfg?.items)) {
      return currentCfg.items as Array<{ id: string; ar: string; latin?: string; fr: string; correctPos: number }>
    }
    return [] as Array<{ id: string; ar: string; latin?: string; fr: string; correctPos: number }>
  }, [currentAuthored, currentCfg])

  // PlacerDansEtoile : zones + words
  const placerEtoileData = useMemo(() => {
    if (currentAuthored?.typology === 'PlacerDansEtoile') {
      const zones = Array.isArray(currentCfg?.zones) ? currentCfg.zones : []
      const words = Array.isArray(currentCfg?.words) ? currentCfg.words : []
      return { zones, words }
    }
    return { zones: [], words: [] as string[] }
  }, [currentAuthored, currentCfg])

  // SelectionImages : items + minSelection / freeSelection
  const selectionImagesData = useMemo(() => {
    if (currentAuthored?.typology === 'SelectionImages') {
      return {
        question: typeof currentCfg?.question === 'string' ? currentCfg.question : undefined,
        questionFr: typeof currentCfg?.questionFr === 'string' ? currentCfg.questionFr : undefined,
        items: Array.isArray(currentCfg?.items) ? currentCfg.items : [],
        minSelection: typeof currentCfg?.minSelection === 'number' ? currentCfg.minSelection : undefined,
        freeSelection: currentCfg?.freeSelection === true,
      }
    }
    return { question: undefined as string | undefined, questionFr: undefined as string | undefined, items: [] as any[], minSelection: undefined as number | undefined, freeSelection: false }
  }, [currentAuthored, currentCfg])

  // TriDeuxCategories : 2 catégories + items
  const triDeuxCatData = useMemo(() => {
    if (currentAuthored?.typology === 'TriDeuxCategories') {
      return {
        question: typeof currentCfg?.question === 'string' ? currentCfg.question : undefined,
        questionFr: typeof currentCfg?.questionFr === 'string' ? currentCfg.questionFr : undefined,
        categorieA: currentCfg?.categorieA ?? { label: 'A' },
        categorieB: currentCfg?.categorieB ?? { label: 'B' },
        items: Array.isArray(currentCfg?.items) ? currentCfg.items : [],
      }
    }
    return { question: undefined as string | undefined, questionFr: undefined as string | undefined, categorieA: { label: 'A' }, categorieB: { label: 'B' }, items: [] as any[] }
  }, [currentAuthored, currentCfg])

  // RelierParTrait : pairesGauche + pairesDroite + correct
  const relierTraitData = useMemo(() => {
    if (currentAuthored?.typology === 'RelierParTrait') {
      return {
        question: typeof currentCfg?.question === 'string' ? currentCfg.question : undefined,
        questionFr: typeof currentCfg?.questionFr === 'string' ? currentCfg.questionFr : undefined,
        pairesGauche: Array.isArray(currentCfg?.pairesGauche) ? currentCfg.pairesGauche : [],
        pairesDroite: Array.isArray(currentCfg?.pairesDroite) ? currentCfg.pairesDroite : [],
        correct: (currentCfg?.correct ?? {}) as Record<string, string>,
      }
    }
    return { question: undefined as string | undefined, questionFr: undefined as string | undefined, pairesGauche: [] as any[], pairesDroite: [] as any[], correct: {} as Record<string, string> }
  }, [currentAuthored, currentCfg])

  // TexteReligieux : bloc arabe + fr + source
  const texteReligieuxData = useMemo(() => {
    if (currentAuthored?.typology === 'TexteReligieux') {
      return {
        arabe: typeof currentCfg?.arabe === 'string' ? currentCfg.arabe : '',
        fr: typeof currentCfg?.fr === 'string' ? currentCfg.fr : '',
        source: typeof currentCfg?.source === 'string' ? currentCfg.source : undefined,
        titre: typeof currentCfg?.titre === 'string' ? currentCfg.titre : undefined,
      }
    }
    return { arabe: '', fr: '', source: undefined as string | undefined, titre: undefined as string | undefined }
  }, [currentAuthored, currentCfg])

  // Reset l'index FlashCard quand on change d'exercice authored
  useEffect(() => {
    setFlashLetterIdx(0)
  }, [currentAuthored?.id])

  const [hearts,      setHearts]   = useState(5)
  const [answered,    setAnswered] = useState(false)
  const [isCorrect,   setIsCorrect]= useState<boolean | null>(null)
  const [feedbackMsg, setFeedback] = useState("")
  const [xpAdded,     setXpAdded] = useState(false)
  const [isReady,      setIsReady]      = useState(false)
  const [shouldValidate, setShouldValidate] = useState(false)
  const [renderKey,    setRenderKey]    = useState(0)
  const [showSignaler, setShowSignaler] = useState(false)

  // Gate d'hydratation : shuffle() dans les useMemo (choixData, etc.) utilise
  // Math.random() et produit un ordre différent entre SSR pre-render et client,
  // ce qui cause un mismatch d'hydratation. On ne rend l'exercice qu'après mount.
  const [mounted, setMounted] = useState(false)
  useEffect(() => { setMounted(true) }, [])

  useEffect(() => {
    const matching = MATCHING_PHASES.includes(phase as ExPhase)
    if (isReady && matching && !answered) {
      setAnswered(true)
      setIsCorrect(true)
      setFeedback(randomSuccess())
    }
  }, [isReady, phase, answered]) // eslint-disable-line react-hooks/exhaustive-deps

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
  if ((useGenericDbExercises || !hasLetterGroup) && dbExercises.length > 0) {
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
  // Index dans la séquence propre à la leçon (et non le catalogue global).
  const remainingEx = queue.filter(p => EX_PHASES.includes(p as ExPhase)).length
  const lessonPhaseIdx = phase === "finished"
    ? lessonExPhases.length
    : Math.max(0, lessonExPhases.length - remainingEx)
  // Progression Duolingo-like : proportionnelle aux exos de CETTE leçon.
  const globalPct = lessonExPhases.length > 0
    ? Math.round((lessonPhaseIdx / lessonExPhases.length) * 100)
    : 0
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

  const handleContinuer = () => {
    if (isCorrect === false) {
      resetPhaseState()
    } else {
      advancePhase()
    }
  }

  // FlashCard : défile toutes les lettres du groupe (ou des vocabIds authored)
  const handleFlashContinue = () => {
    const current = flashItems[flashLetterIdx] as any
    if (current?.id) markVocabSeen(current.id).catch(() => {})
    if (flashLetterIdx < flashItems.length - 1) {
      setFlashLetterIdx(i => i + 1)
    } else {
      advancePhase()
    }
  }

  // HarakatCard : défile toutes les lettres du groupe (pour alphabet)
  const handleHarakatContinue = () => {
    if (harakatLetterIdx < alphabetLetters.length - 1) {
      setHarakatLetterIdx(i => i + 1)
    } else {
      advancePhase()
    }
  }

  const trackRetention = (correct: boolean) => {
    const vid = (target as any)?.id as string | undefined
    if (!vid) return
    markVocabSeen(vid).catch(() => {})
    markVocabResult(vid, correct).catch(() => {})
  }

  const handleSuccess = () => {
    setShouldValidate(false)
    setAnswered(true)
    setIsCorrect(true)
    setFeedback(randomSuccess())
    trackRetention(true)
  }

  const handleFailed = (correctHint?: string) => {
    setShouldValidate(false)
    setAnswered(true)
    setIsCorrect(false)
    setHearts(h => Math.max(0, h - 1))
    setFeedback(correctHint ?? target.latin)
    trackRetention(false)
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

  const handleSpeak = (l: DarijaLetter) => { if (settings.soundEffects) speak(l.letter) }
  const handleSpeakText = (text: string) => { if (settings.soundEffects) speak(text) }

  const handleNext = () => {
    router.push('/progress')
  }

  // ── Écran de fin ─────────────────────────────────────────────────────────
  if (phase === "finished") {
    return (
      <div className="min-h-screen bg-[#131f24] flex flex-col items-center justify-center px-4">
        <ExerciseCard className="max-w-sm w-full">
          <FinishedScreen onNext={handleNext} hasNext={!!nextLessonId} animate={settings.animations} />
        </ExerciseCard>
      </div>
    )
  }

  // ── Cours sans exercice : écran "en construction" (charte Maroc) ─────────
  if (phase === "empty") {
    return (
      <div className="min-h-screen bg-[#0f1720] flex flex-col items-center justify-center px-4">
        <ExerciseCard className="max-w-sm w-full">
          <div className="relative overflow-hidden flex flex-col items-center text-center gap-4 py-8 px-6"
               style={{ borderRadius: 24, border: '2px solid #d4a84b55',
                        background: 'radial-gradient(circle at 30% 20%, #d4a84b10, #0f1720 65%)' }}>
            <svg viewBox="0 0 100 100" className="absolute inset-0 w-full h-full" style={{ opacity: 0.05 }} aria-hidden>
              <g fill="#d4a84b">
                <rect x="10" y="10" width="80" height="80" />
                <rect x="10" y="10" width="80" height="80" transform="rotate(45 50 50)" />
              </g>
            </svg>
            <div className="relative z-[5] text-5xl">🏗️</div>
            <div className="relative z-[5] font-black uppercase tracking-widest text-sm" style={{ color: '#d4a84b' }}>
              Cours en construction
            </div>
            <div className="relative z-[5] text-sm" style={{ color: '#e4eef3', opacity: 0.85 }}>
              Aucun exercice n'est encore publié pour ce cours.
            </div>
            <button
              onClick={handleNext}
              className="relative z-[5] mt-2 px-6 py-3 rounded-2xl font-black text-sm uppercase tracking-widest text-white"
              style={{ background: '#006233', boxShadow: '0 4px 0 #004a26' }}
            >
              Retour au parcours
            </button>
          </div>
        </ExerciseCard>
      </div>
    )
  }

  // ── Vidéo d'intro (si lesson.videoUrl) ────────────────────────────────────
  if (phase === "video") {
    const videoUrl = (lesson as any).videoUrl as string
    const videoPoster = (lesson as any).videoPoster as string | null | undefined
    return (
      <div className="min-h-screen bg-[#131f24] flex items-center justify-center">
        <LessonVideo
          url={videoUrl}
          poster={videoPoster}
          title={(lesson as any).title}
          onContinue={advancePhase}
        />
      </div>
    )
  }

  // ── Écran de transition ───────────────────────────────────────────────────
  if (["t1","t2","t3","t4","t5","t6"].includes(phase)) {
    const trn = TRANSITIONS[phase as TrnPhase]
    return (
      <div className="min-h-screen bg-[#131f24] flex flex-col items-center justify-center px-4">
        <ExerciseCard className="max-w-sm w-full">
          <TransitionScreen {...trn} onContinue={advancePhase} animate={settings.animations} />
        </ExerciseCard>
      </div>
    )
  }

  // ── Lettre courante ─────────────────────────────────────────────────────
  const flashTarget = flashItems[flashLetterIdx] ?? flashItems[0] ?? target
  const harakatTarget = alphabetLetters[harakatLetterIdx] ?? alphabetLetters[0]

  const flashProgress = flashItems.length > 1
    ? `${flashLetterIdx + 1} / ${flashItems.length}`
    : undefined
  const harakatProgress = alphabetLetters.length > 1
    ? `${harakatLetterIdx + 1} / ${alphabetLetters.length}`
    : undefined

  const lessonMode: 'lettre' | 'mot' = staticGroup.length > 0 ? 'lettre' : 'mot'

  // ── Rendu de l'exercice courant ───────────────────────────────────────────
  const renderExercise = () => {
    switch (phase as ExPhase) {
      case "flashcard":
        return (
          <FlashCard
            letter={isAlphabetLesson ? { ...flashTarget, name: (alphabetLetters[flashLetterIdx] ?? alphabetLetters[0])?.name } : flashTarget}
            onContinue={handleFlashContinue}
            onSpeak={handleSpeak}
            progress={flashProgress}
            mode={lessonMode}
            prompt={customPrompt}
          />
        )
      case "harakat":
        if (!harakatTarget) { advancePhase(); return null }
        return (
          <HarakatCard
            letter={harakatTarget}
            onContinue={handleHarakatContinue}
            onSpeak={handleSpeakText}
            progress={harakatProgress}
          />
        )
      case "choix":
        return (
          <ChoixLettre
            letter={choixData.target}
            choices={choixData.choices}
            onSuccess={handleSuccess}
            onFailed={handleFailed}
            onSpeak={handleSpeak}
            onReadyChange={setIsReady}
            shouldValidate={shouldValidate}
            mode={lessonMode}
            prompt={customPrompt}
          />
        )
      case "association":
        return <AssocierLettres pairs={assocPairs} onConfirm={advancePhase} onReadyChange={setIsReady} mode={lessonMode} prompt={customPrompt} />
      case "paires":
        return <TrouverLesPaires pairs={pairsPairs} onConfirm={advancePhase} onReadyChange={setIsReady} mode={lessonMode} prompt={customPrompt} />
      case "entendre":
        return (
          <EntendreEtChoisir
            letter={entendreData.target}
            choices={entendreData.choices}
            onSuccess={handleSuccess}
            onFailed={handleFailed}
            onSpeak={handleSpeak}
            onReadyChange={setIsReady}
            shouldValidate={shouldValidate}
            mode={lessonMode}
            prompt={customPrompt}
          />
        )
      case "vrai_faux":
        return (
          <VraiFaux
            letter={vraiFauxData.target}
            proposed={vraiFauxData.proposed}
            isTrue={vraiFauxData.isTrue}
            onSuccess={handleSuccess}
            onFailed={handleFailed}
            onSpeak={handleSpeak}
            onReadyChange={setIsReady}
            shouldValidate={shouldValidate}
            mode={lessonMode}
            prompt={customPrompt}
          />
        )
      case "dicter":
        return (
          <DicterRomanisation
            letter={dicterData.target}
            choices={dicterData.choices}
            onSuccess={handleSuccess}
            onFailed={handleFailed}
            onSpeak={handleSpeak}
            onReadyChange={setIsReady}
            shouldValidate={shouldValidate}
            prompt={customPrompt}
          />
        )
      case "numeroter":
        if (numeroterData.length === 0) { advancePhase(); return null }
        return (
          <NumeroterOrdre
            items={numeroterData}
            onConfirm={advancePhase}
            onReadyChange={setIsReady}
            prompt={customPrompt}
          />
        )
      case "placer_etoile":
        if (placerEtoileData.zones.length === 0) { advancePhase(); return null }
        return (
          <PlacerDansEtoile
            zones={placerEtoileData.zones}
            words={placerEtoileData.words}
            onConfirm={advancePhase}
            onReadyChange={setIsReady}
            prompt={customPrompt}
          />
        )
      case "texte_religieux":
        if (!texteReligieuxData.arabe && !texteReligieuxData.fr) { advancePhase(); return null }
        return (
          <TexteReligieux
            arabe={texteReligieuxData.arabe}
            fr={texteReligieuxData.fr}
            source={texteReligieuxData.source}
            titre={texteReligieuxData.titre}
            onConfirm={advancePhase}
            onReadyChange={setIsReady}
            prompt={customPrompt}
          />
        )
      case "selection_images":
        if (selectionImagesData.items.length === 0) { advancePhase(); return null }
        return (
          <SelectionImages
            question={selectionImagesData.question}
            questionFr={selectionImagesData.questionFr}
            items={selectionImagesData.items}
            minSelection={selectionImagesData.minSelection}
            freeSelection={selectionImagesData.freeSelection}
            onConfirm={advancePhase}
            onReadyChange={setIsReady}
            prompt={customPrompt}
          />
        )
      case "tri_deux_cat":
        if (triDeuxCatData.items.length === 0) { advancePhase(); return null }
        return (
          <TriDeuxCategories
            question={triDeuxCatData.question}
            questionFr={triDeuxCatData.questionFr}
            categorieA={triDeuxCatData.categorieA}
            categorieB={triDeuxCatData.categorieB}
            items={triDeuxCatData.items}
            onConfirm={advancePhase}
            onReadyChange={setIsReady}
            prompt={customPrompt}
          />
        )
      case "relier_trait":
        if (relierTraitData.pairesGauche.length === 0 || relierTraitData.pairesDroite.length === 0) { advancePhase(); return null }
        return (
          <RelierParTrait
            question={relierTraitData.question}
            questionFr={relierTraitData.questionFr}
            pairesGauche={relierTraitData.pairesGauche}
            pairesDroite={relierTraitData.pairesDroite}
            correct={relierTraitData.correct}
            onConfirm={advancePhase}
            onReadyChange={setIsReady}
            prompt={customPrompt}
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
          {lessonExPhases.map((p, i) => {
            const isDone   = i < lessonPhaseIdx
            const isActive = i === lessonPhaseIdx
            const label    = PHASE_LABELS[EX_PHASES.indexOf(p)] ?? ''
            return (
              <div
                key={i}
                title={label}
                className={`flex items-center justify-center rounded-full text-[10px] font-bold transition-all duration-200 ${
                  isDone   ? 'w-6 h-6 bg-[#58cc02] text-white' :
                  isActive ? 'w-7 h-7 bg-[#1cb0f6] text-white' :
                             'w-6 h-6 bg-[#2a3d47] text-[#6b7f8a]'
                }`}
              >
                {isDone ? '✓' : i + 1}
              </div>
            )
          })}
        </div>
      </header>

      {/* ── CONTENU ────────────────────────────────────────────────────── */}
      <main className="flex-1 flex flex-col items-center px-4 py-6 pb-40">
        <ExerciseCard className="max-w-lg w-full" key={renderKey}>
          {mounted ? renderExercise() : <div style={{ minHeight: 400 }} />}
        </ExerciseCard>
      </main>

      {/* ── MODAL SIGNALER ──────────────────────────────────────────────── */}
      {showSignaler && <SignalerModal onClose={() => setShowSignaler(false)} />}

      {/* ── FOOTER ──────────────────────────────────────────────────────── */}
      {showFooter && (
        <footer className="fixed bottom-0 left-0 right-0 z-50">
          {!answered ? (
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
            <div style={{ animation: 'fadeUp 0.2s ease both' }}>
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
                    CONTINUER
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
