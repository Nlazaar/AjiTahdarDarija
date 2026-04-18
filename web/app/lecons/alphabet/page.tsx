"use client";

import React, { useState, useEffect, useMemo, useCallback } from "react";
import { useRouter } from "next/navigation";
import { darijaAlphabet } from "@/data/alphabet";
import { useAudio } from "@/hooks/useAudio";
import { useExerciseEngine } from "@/hooks/useExerciseEngine";

// UI Components
import { ExerciseCard } from "@/components/ui/ExerciseCard";
import { ContinueButton } from "@/components/ui/ContinueButton";
import { DarijaLetter } from "@/types/alphabet";

// Exercise Components
import FlashCard from "@/components/exercises/FlashCard";
import ChoixLettre from "@/components/exercises/ChoixLettre";
import AssocierLettres from "@/components/exercises/AssocierLettres";
import TrouverLesPaires from "@/components/exercises/TrouverLesPaires";
import EntendreEtChoisir from "@/components/exercises/EntendreEtChoisir";
import VraiFaux from "@/components/exercises/VraiFaux";
import DicterRomanisation from "@/components/exercises/DicterRomanisation";

type Phase =
  | "flashcard"
  | "choix"
  | "transition1"
  | "association"
  | "transition2"
  | "paires"
  | "transition3"
  | "entendre"
  | "transition4"
  | "vrai_faux"
  | "transition5"
  | "dicter"
  | "finished";

const PHASE_LABELS: Record<string, { icon: string; label: string }> = {
  flashcard:   { icon: "🆕", label: "Intro"       },
  choix:       { icon: "🔤", label: "Prononc."    },
  association: { icon: "🔗", label: "Associer"    },
  paires:      { icon: "🃏", label: "Paires"      },
  entendre:    { icon: "🔊", label: "Écoute"      },
  vrai_faux:   { icon: "✓?", label: "Vrai/Faux"   },
  dicter:      { icon: "✍️", label: "Dicter"      },
}

const PHASE_NAMES = Object.keys(PHASE_LABELS);

const phaseWeights: Record<string, [number, number]> = {
  flashcard:   [0,   10],
  choix:       [10,  25],
  association: [25,  42],
  paires:      [42,  58],
  entendre:    [58,  72],
  vrai_faux:   [72,  85],
  dicter:      [85, 100],
  finished:    [100, 100],
};

function shuffle<T>(arr: T[]): T[] {
  return [...arr].sort(() => 0.5 - Math.random());
}

function chunk<T>(arr: T[], size: number): T[][] {
  const result: T[][] = [];
  for (let i = 0; i < arr.length; i += size) {
    result.push(arr.slice(i, i + size));
  }
  return result;
}

export default function AlphabetLessonPage() {
  const router = useRouter();
  const audio = useAudio();
  
  // Phase and Hearts
  const [phase, setPhase] = useState<Phase>("flashcard");
  const [hearts, setHearts] = useState(5);
  
  // Data State
  const [pool5, setPool5] = useState<DarijaLetter[]>([]);
  const [assocRounds, setAssocRounds] = useState<DarijaLetter[][]>([]);
  const [pairesRounds, setPairesRounds] = useState<DarijaLetter[][]>([]);
  const [entendreExercises, setEntendreExercises] = useState<{letter: DarijaLetter, choices: DarijaLetter[]}[]>([]);
  const [vraiFauxExercises, setVraiFauxExercises] = useState<{letter: DarijaLetter, proposed: string, isTrue: boolean}[]>([]);
  const [dicterPool, setDicterPool] = useState<DarijaLetter[]>([]);

  // Indices
  const [flashcardIdx, setFlashcardIdx] = useState(0);
  const [roundIdx, setRoundIdx] = useState(0);
  const [pairesRoundIdx, setPairesRoundIdx] = useState(0);
  const [entendreIdx, setEntendreIdx] = useState(0);
  const [vraiFauxIdx, setVraiFauxIdx] = useState(0);
  const [dicterIdx, setDicterIdx] = useState(0);
  const [isAnswered, setIsAnswered] = useState(false);

  const onSpeak = useCallback((l: DarijaLetter) => {
    audio.speak(l.letter);
  }, [audio]);

  // ENGINE for Phase "choix"
  const engine = useExerciseEngine<DarijaLetter>(pool5, (l) => l.latin);

  // Initialize Data
  useEffect(() => {
    const all = shuffle(darijaAlphabet);
    const p5 = all.slice(0, 5);
    setPool5(p5);
    
    const all28 = shuffle(darijaAlphabet).slice(0, 28);
    setAssocRounds(chunk(all28, 4));
    setPairesRounds(chunk(all28, 5));

    // Entendre: 6 random
    const ePool = shuffle(darijaAlphabet).slice(0, 6);
    setEntendreExercises(ePool.map(l => ({
      letter: l,
      choices: shuffle([...shuffle(darijaAlphabet.filter(x => x.latin !== l.latin)).slice(0, 3), l])
    })));

    // VraiFaux: 8 random
    const vfLetters = shuffle(darijaAlphabet).slice(0, 8);
    setVraiFauxExercises(vfLetters.map(l => {
      const isTrue = Math.random() > 0.5;
      return {
        letter: l,
        isTrue,
        proposed: isTrue ? l.latin : darijaAlphabet.filter(x => x.latin !== l.latin)[Math.floor(Math.random()*27)].latin
      };
    }));

    // Dicter: 5 random
    setDicterPool(shuffle(darijaAlphabet).slice(0, 5));
  }, []);

  const loseHeart = useCallback(() => {
    setHearts(h => Math.max(1, h - 1));
  }, []);

  const handlePhaseSuccess = () => {
    setIsAnswered(true);
  };

  const handlePhaseFailed = () => {
    setIsAnswered(true);
    loseHeart();
  };

  // Progression calculation
  const globalPercent = useMemo(() => {
    const [start, end] = phaseWeights[phase] || [0, 0];
    const range = end - start;
    let internal = 0;

    switch(phase) {
      case "flashcard":   internal = (flashcardIdx / 5); break;
      case "choix":       internal = (engine.progressPercent / 100); break;
      case "association": internal = (roundIdx / assocRounds.length); break;
      case "paires":      internal = (pairesRoundIdx / pairesRounds.length); break;
      case "entendre":    internal = (entendreIdx / entendreExercises.length); break;
      case "vrai_faux":   internal = (vraiFauxIdx / vraiFauxExercises.length); break;
      case "dicter":      internal = (dicterIdx / dicterPool.length); break;
      case "finished":    internal = 1; break;
      default:            internal = 1; // Transitions carry the end of previous
    }
    return Math.min(100, Math.round(start + internal * range));
  }, [phase, flashcardIdx, engine.progressPercent, roundIdx, assocRounds.length, pairesRoundIdx, pairesRounds.length, entendreIdx, entendreExercises.length, vraiFauxIdx, vraiFauxExercises.length, dicterIdx, dicterPool.length]);

  // --- NAVIGATION HANDLERS ---
  
  const nextFlashcard = () => {
    if (flashcardIdx < 4) setFlashcardIdx(f => f + 1);
    else setPhase("choix");
  };

  const nextChoix = () => {
    engine.next();
    if (engine.isFinished) setPhase("transition1");
  };

  const nextAssoc = () => {
    if (roundIdx < assocRounds.length - 1) setRoundIdx(r => r + 1);
    else setPhase("transition2");
  };

  const nextPaires = () => {
    if (pairesRoundIdx < pairesRounds.length - 1) setPairesRoundIdx(p => p + 1);
    else setPhase("transition3");
  };

  const nextEntendre = () => {
    setIsAnswered(false);
    if (entendreIdx < entendreExercises.length - 1) setEntendreIdx(e => e + 1);
    else setPhase("transition4");
  };

  const nextVraiFaux = () => {
    setIsAnswered(false);
    if (vraiFauxIdx < vraiFauxExercises.length - 1) setVraiFauxIdx(v => v + 1);
    else setPhase("transition5");
  };

  const nextDicter = () => {
    setIsAnswered(false);
    if (dicterIdx < dicterPool.length - 1) setDicterIdx(d => d + 1);
    else setPhase("finished");
  };

  // --- VIEWS ---

  if (pool5.length === 0) return <div className="min-h-screen flex items-center justify-center font-bold text-royal animate-pulse">Chargement de la leçon...</div>;

  const currentPhaseIdx = PHASE_NAMES.indexOf(phase.startsWith("transition") ? PHASE_NAMES[parseInt(phase.replace("transition", ""))] : phase);
  const activePhaseIdx = PHASE_NAMES.findIndex(n => phase.startsWith(n));

  return (
    <div className="min-h-screen bg-[#fafbfc] font-outfit pb-20">
      {/* HEADER STICKY */}
      <header className="sticky top-0 z-50 bg-white border-b border-gray-100 px-4 py-3 shadow-sm">
        <div className="max-w-2xl mx-auto space-y-3">
          <div className="flex items-center gap-4">
            <button onClick={() => router.push("/learn")} className="text-gray-400 hover:text-gray-600 transition-colors text-2xl">✕</button>
            <div className="flex-1 h-3 bg-gray-100 rounded-full overflow-hidden">
              <div 
                className="h-full bg-green-400 rounded-full transition-all duration-700 ease-[cubic-bezier(0.34,1.56,0.64,1)]" 
                style={{ width: `${globalPercent}%` }}
              />
            </div>
            <span className="text-[10px] font-black text-gray-400 w-8">{globalPercent}%</span>
          </div>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center justify-center gap-1 py-2">
              {Object.entries(PHASE_LABELS).map(([key, { label }], i) => {
                const phaseOrder = PHASE_NAMES;
                const currentActivePhase = 
                  phase === "flashcard"   ? "flashcard"   :
                  phase === "choix"       ? "choix"       :
                  phase === "transition1" ? "association" :
                  phase === "association" ? "association" :
                  phase === "transition2" ? "paires"      :
                  phase === "paires"      ? "paires"      :
                  phase === "transition3" ? "entendre"    :
                  phase === "entendre"    ? "entendre"    :
                  phase === "transition4" ? "vrai_faux"   :
                  phase === "vrai_faux"   ? "vrai_faux"   :
                  phase === "transition5" ? "dicter"      :
                  phase === "dicter"      ? "dicter"      :
                  "finished";

                const isDone   = phaseOrder.indexOf(currentActivePhase) > i || phase === "finished"
                const isActive = phaseOrder[i] === currentActivePhase
                return (
                  <div
                    key={key}
                    title={label}
                    className={`
                      flex items-center justify-center
                      text-[10px] font-bold rounded-full
                      transition-all duration-200
                      ${isDone   ? "w-6 h-6 bg-green-400 text-white"              : ""}
                      ${isActive ? "w-7 h-7 bg-royal text-white ring-2 ring-royal ring-offset-1" : ""}
                      ${!isDone && !isActive ? "w-6 h-6 bg-gray-200 text-gray-400" : ""}
                    `}
                  >
                    {i + 1}
                  </div>
                )
              })}
            </div>
            {["paires", "entendre", "vrai_faux"].some(p => phase.startsWith(p)) && (
              <div className="flex items-center gap-1.5 bg-red-50 px-3 py-1 rounded-full border border-red-100 animate-fadeUp">
                <span className="text-red-500 text-sm">❤️</span>
                <span className="text-red-700 font-bold text-sm tracking-tighter">{hearts}</span>
              </div>
            )}
          </div>
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-4 pt-8">
        {/* EXERCISES */}
        {phase === "flashcard" && (
          <FlashCard 
            key={`flash-${flashcardIdx}`}
            letter={pool5[flashcardIdx]} 
            onContinue={nextFlashcard} 
            onSpeak={onSpeak} 
          />
        )}

        {phase === "choix" && engine.currentExercise && (
          <ChoixLettre
            key={`choix-${engine.currentIndex}-${engine.currentExercise.latin}`}
            letter={engine.currentExercise}
            choices={shuffle([
              ...shuffle(darijaAlphabet.filter(l => l.latin !== engine.currentExercise!.latin)).slice(0, 2),
              engine.currentExercise
            ])}
            onSpeak={onSpeak}
            onSuccess={() => { engine.markSuccess(); nextChoix(); }}
            onFailed={() => { engine.markFailed(); nextChoix(); }}
          />
        )}

        {phase === "association" && assocRounds[roundIdx] && (
          <AssocierLettres
            key={`assoc-${roundIdx}`}
            pairs={assocRounds[roundIdx]}
            onConfirm={nextAssoc}
          />
        )}

        {phase === "paires" && pairesRounds[pairesRoundIdx] && (
          <TrouverLesPaires
            key={`paires-${pairesRoundIdx}`}
            pairs={pairesRounds[pairesRoundIdx]}
            onConfirm={nextPaires}
          />
        )}

        {phase === "entendre" && entendreExercises[entendreIdx] && (
          <EntendreEtChoisir
            key={`entendre-${entendreIdx}`}
            letter={entendreExercises[entendreIdx].letter}
            choices={entendreExercises[entendreIdx].choices}
            onSpeak={onSpeak}
            onSuccess={handlePhaseSuccess}
            onFailed={handlePhaseFailed}
          />
        )}

        {phase === "vrai_faux" && vraiFauxExercises[vraiFauxIdx] && (
          <VraiFaux
            key={`vf-${vraiFauxIdx}`}
            letter={vraiFauxExercises[vraiFauxIdx].letter}
            proposed={vraiFauxExercises[vraiFauxIdx].proposed}
            isTrue={vraiFauxExercises[vraiFauxIdx].isTrue}
            onSpeak={onSpeak}
            onSuccess={handlePhaseSuccess}
            onFailed={handlePhaseFailed}
          />
        )}

        {phase === "dicter" && dicterPool[dicterIdx] && (() => {
          const current = dicterPool[dicterIdx];
          const distractors = dicterPool
            .filter(l => l.latin !== current.latin)
            .sort(() => Math.random() - 0.5)
            .slice(0, 3)
            .map(l => l.latin);
          const choices = [current.latin, ...distractors].sort(() => Math.random() - 0.5);
          return (
            <DicterRomanisation
              key={`dict-${dicterIdx}`}
              letter={current}
              choices={choices}
              onSpeak={onSpeak}
              onSuccess={handlePhaseSuccess}
              onFailed={handlePhaseFailed}
            />
          );
        })()}

        {/* FEEDBACK CONTINUATION FOR NEW PHASES */}
        {isAnswered && (
          <div className="mt-6 flex flex-col gap-4 animate-fadeUp">
            {phase === "entendre" && <ContinueButton onClick={nextEntendre} />}
            {phase === "vrai_faux" && <ContinueButton onClick={nextVraiFaux} />}
            {phase === "dicter" && <ContinueButton onClick={nextDicter} />}
          </div>
        )}

        {/* TRANSITION SCREENS */}
        {phase.startsWith("transition") && (
          <div className="flex flex-col items-center justify-center py-20 text-center animate-bounceIn max-w-sm mx-auto">
            <div className="text-8xl mb-6 drop-shadow-lg">
              {phase === "transition1" ? "⭐" : phase === "transition2" ? "🌟" : phase === "transition3" ? "🔥" : phase === "transition4" ? "⚡" : "🎯"}
            </div>
            <h2 className="text-3xl font-bold text-gray-800 mb-2">
              {phase === "transition1" ? "Phase 1 réussie !" : 
               phase === "transition2" ? "Super !" : 
               phase === "transition3" ? "Tu cartones !" : 
               phase === "transition4" ? "Presque fini !" : "Dernière étape !"}
            </h2>
            <p className="text-gray-500 mb-10 font-medium">
              {phase === "transition1" ? "Place désormais les lettres." : 
               phase === "transition2" ? "Trouve les paires." : 
               phase === "transition3" ? "Écoute et identifie." : 
               phase === "transition4" ? "Vrai ou Faux ?" : "Dicte la romanisation."}
            </p>
            <ContinueButton onClick={() => {
              if (phase === "transition1") setPhase("association");
              else if (phase === "transition2") setPhase("paires");
              else if (phase === "transition3") setPhase("entendre");
              else if (phase === "transition4") setPhase("vrai_faux");
              else if (phase === "transition5") setPhase("dicter");
            }} label="C'est parti !" />
          </div>
        )}

        {/* FINISHED SCREEN */}
        {phase === "finished" && (
          <div className="flex flex-col items-center justify-center py-10 text-center animate-bounceIn">
            <div className="text-9xl mb-8 drop-shadow-2xl hover:scale-110 transition-transform cursor-pointer">🎉</div>
            <h2 className="text-3xl font-black text-royal mb-4 tracking-tight">Leçon Alphabet complète !</h2>
            <p className="text-gray-500 mb-10 max-w-sm mx-auto font-medium leading-relaxed">
              7 types d'exercices maîtrisés — tu as acquis une base solide pour lire le Darija !
            </p>
            
            <div className="flex flex-col gap-3 w-full max-w-xs">
              <ContinueButton onClick={() => window.location.reload()} label="Recommencer" />
              <button 
                onClick={() => router.push("/learn")}
                className="w-full py-4 px-6 border-2 border-royal/20 text-royal font-bold rounded-2xl hover:bg-royal/5 transition-all active:scale-95"
              >
                Retour au parcours
              </button>
            </div>

            <div className="grid grid-cols-7 gap-2 mt-12 w-full max-w-xs">
              {Object.values(PHASE_LABELS).map(({ icon }, i) => (
                <div key={i} className="w-8 h-8 rounded-full bg-green-100 border border-green-200 flex items-center justify-center text-[10px] animate-fadeUp" style={{ animationDelay: `${i * 100}ms` }}>
                  {icon}
                </div>
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
