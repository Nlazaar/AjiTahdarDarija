'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useUserProgress } from '@/contexts/UserProgressContext';
import { SCENARIOS, type ScenarioData, type BotStep, type ChoiceStep, type Step } from './scenarios';

/* ─── Dark theme ─────────────────────────────────────────────────────────── */
const BG     = '#131f24';
const CARD   = '#1e2d36';
const CARD2  = '#243b4a';
const BORDER = 'rgba(255,255,255,0.07)';
const TEXT   = '#ffffff';
const SUB    = '#8b9eb0';
const BLUE   = '#1cb0f6';

/* ─────────────────────────────────────────────
   WAVE BARS
───────────────────────────────────────────── */
function WaveBars({ animated, color = 'white', size = 20 }: { animated: boolean; color?: string; size?: number }) {
  const barW = Math.max(2, size * 0.1);
  const maxH = size * 0.55;
  const ratios = [0.4, 0.9, 0.6, 1, 0.7];
  return (
    <div style={{ display: 'flex', alignItems: 'flex-end', gap: barW * 0.8, height: maxH }}>
      {ratios.map((r, i) => (
        <div key={i} style={{
          width: barW, height: maxH, borderRadius: barW,
          background: color,
          transformOrigin: 'bottom',
          transform: `scaleY(${animated ? 1 : r})`,
          transition: animated ? 'none' : 'transform 0.2s',
          animation: animated ? `pWave ${0.45 + i * 0.07}s ease-in-out ${i * 0.08}s infinite alternate` : 'none',
        }} />
      ))}
    </div>
  );
}

/* ─────────────────────────────────────────────
   SPEAK BUTTON
───────────────────────────────────────────── */
function SpeakBtn({ text }: { text: string }) {
  const [playing, setPlaying] = useState(false);
  const speak = () => {
    if (playing) return;
    setPlaying(true);
    const utt = new SpeechSynthesisUtterance(text);
    utt.lang = 'ar-MA';
    utt.onend = () => setPlaying(false);
    speechSynthesis.speak(utt);
    setTimeout(() => setPlaying(false), 3500);
  };
  return (
    <button onClick={speak} style={{
      width: 32, height: 32, borderRadius: 10, border: 'none',
      background: playing ? 'rgba(59,130,246,0.25)' : CARD2, cursor: 'pointer',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      flexShrink: 0, transition: 'background 0.2s',
    }}>
      <WaveBars animated={playing} color="#3b82f6" size={18} />
    </button>
  );
}

/* ─────────────────────────────────────────────
   BOT BUBBLE
───────────────────────────────────────────── */
function BotBubble({ step, accent, emoji }: { step: BotStep; accent: string; emoji: string }) {
  return (
    <div style={{ display: 'flex', gap: 10, alignItems: 'flex-start', maxWidth: '88%' }}>
      <div style={{
        width: 36, height: 36, borderRadius: 12,
        background: `${accent}20`, border: `2px solid ${accent}40`,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontSize: 17, flexShrink: 0,
      }}>
        {emoji}
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
        <div style={{
          background: CARD, borderRadius: '4px 18px 18px 18px',
          border: `1.5px solid ${BORDER}`, padding: '14px 16px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.2)',
        }}>
          {step.darija && (
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: 8, marginBottom: 8 }}>
              <div style={{
                fontSize: 21, fontFamily: 'var(--font-amiri), serif',
                color: TEXT, direction: 'rtl', lineHeight: 1.7,
                flex: 1, textAlign: 'right',
              }}>
                {step.darija}
              </div>
              <SpeakBtn text={step.darija} />
            </div>
          )}

          {step.translit && (
            <div style={{
              fontSize: 13, color: SUB, fontStyle: 'italic',
              borderTop: step.darija ? `1px solid ${BORDER}` : 'none',
              paddingTop: step.darija ? 8 : 0, marginBottom: 8, lineHeight: 1.5,
            }}>
              {step.translit}
            </div>
          )}

          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: 6,
            background: 'rgba(28,176,246,0.12)', borderRadius: 8, padding: '4px 10px',
            fontSize: 13, color: BLUE, fontWeight: 600, lineHeight: 1.4,
          }}>
            🇫🇷 {step.fr}
          </div>
        </div>

        {step.note && (
          <div style={{
            background: 'rgba(245,158,11,0.10)', border: '1.5px solid rgba(245,158,11,0.25)',
            borderRadius: '4px 14px 14px 14px', padding: '8px 12px',
            fontSize: 12, color: '#fbbf24', lineHeight: 1.5,
          }}>
            💡 {step.note}
          </div>
        )}
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────
   USER BUBBLE
───────────────────────────────────────────── */
function UserBubble({ darija, translit, fr }: { darija: string; translit: string; fr: string }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
      <div style={{
        background: 'linear-gradient(135deg, #3b82f6, #2563eb)',
        color: 'white', borderRadius: '18px 4px 18px 18px',
        padding: '12px 16px', maxWidth: '78%',
        boxShadow: '0 3px 10px rgba(37,99,235,0.3)',
        display: 'flex', flexDirection: 'column', gap: 4,
      }}>
        <div style={{ fontSize: 19, fontFamily: 'var(--font-amiri), serif', direction: 'rtl', lineHeight: 1.6 }}>
          {darija}
        </div>
        <div style={{ fontSize: 12, opacity: 0.8, fontStyle: 'italic' }}>{translit}</div>
        <div style={{ fontSize: 12, opacity: 0.85, borderTop: '1px solid rgba(255,255,255,0.2)', paddingTop: 4 }}>
          {fr}
        </div>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────
   SCENARIO PICKER
───────────────────────────────────────────── */
function ScenarioPicker({ onSelect }: { onSelect: (s: ScenarioData) => void }) {
  return (
    <div style={{ maxWidth: 640, margin: '0 auto', padding: '0 16px 80px' }}>
      <div style={{ padding: '32px 0 24px' }}>
        <h1 style={{ fontSize: 28, fontWeight: 900, color: TEXT, marginBottom: 8 }}>
          Entraînement
        </h1>
        <p style={{ fontSize: 15, color: SUB, lineHeight: 1.5 }}>
          Pratique le Darija dans de vraies conversations guidées
        </p>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
        <div style={{ flex: 1, height: 1.5, background: BORDER }} />
        <span style={{ fontSize: 11, fontWeight: 800, color: SUB, textTransform: 'uppercase', letterSpacing: '0.07em' }}>
          Conversations 💬
        </span>
        <div style={{ flex: 1, height: 1.5, background: BORDER }} />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
        {SCENARIOS.map(s => (
          <button key={s.id} onClick={() => onSelect(s)}
            style={{
              display: 'flex', flexDirection: 'column', alignItems: 'flex-start',
              padding: '16px', borderRadius: 20,
              background: `${CARD}`,
              border: `2px solid ${s.accent}30`,
              cursor: 'pointer', textAlign: 'left',
              transition: 'transform 0.12s, box-shadow 0.12s',
              boxShadow: `0 4px 0 ${s.accent}20`,
            }}
            onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.transform = 'translateY(-2px)'; }}
            onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.transform = 'none'; }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%', marginBottom: 8 }}>
              <span style={{ fontSize: 30 }}>{s.emoji}</span>
              <span style={{
                fontSize: 10, fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.06em',
                padding: '3px 10px', borderRadius: 20,
                background: s.level === 'Débutant' ? 'rgba(88,204,2,0.15)' : 'rgba(109,40,217,0.2)',
                color: s.level === 'Débutant' ? '#58cc02' : '#a78bfa',
              }}>
                {s.level}
              </span>
            </div>
            <div style={{ fontSize: 15, fontWeight: 900, color: TEXT, marginBottom: 2 }}>{s.title}</div>
            <div style={{ fontSize: 12, fontWeight: 700, color: s.accent, marginBottom: 6 }}>
              {s.character} · {s.role}
            </div>
            <div style={{ fontSize: 12, color: SUB, lineHeight: 1.4, marginBottom: 10 }}>
              {s.description}
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <span style={{ fontSize: 11, color: s.accent, fontWeight: 700 }}>+{s.xp} XP</span>
              <span style={{ fontSize: 11, color: SUB }}>· ~5 min</span>
            </div>
          </button>
        ))}
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: 10, margin: '28px 0 16px' }}>
        <div style={{ flex: 1, height: 1.5, background: BORDER }} />
        <span style={{ fontSize: 11, fontWeight: 800, color: SUB, textTransform: 'uppercase', letterSpacing: '0.07em' }}>
          Bientôt 🔜
        </span>
        <div style={{ flex: 1, height: 1.5, background: BORDER }} />
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
        {[
          { emoji: '🎵', title: 'Chansons', desc: 'Apprends avec la musique marocaine' },
          { emoji: '🎙️', title: 'Extraits audio', desc: 'Dialogues de la vie quotidienne' },
        ].map(item => (
          <div key={item.title} style={{
            padding: '16px', borderRadius: 20,
            background: CARD2, border: `2px dashed ${BORDER}`, opacity: 0.6,
          }}>
            <span style={{ fontSize: 28, display: 'block', marginBottom: 6 }}>{item.emoji}</span>
            <div style={{ fontSize: 14, fontWeight: 700, color: TEXT }}>{item.title}</div>
            <div style={{ fontSize: 12, color: SUB, marginTop: 2 }}>{item.desc}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────
   DONE SCREEN
───────────────────────────────────────────── */
function DoneScreen({ scenario, onBack }: { scenario: ScenarioData; onBack: () => void }) {
  return (
    <div style={{
      flex: 1, display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center',
      padding: '32px 24px', textAlign: 'center',
    }}>
      <div style={{ fontSize: 64, marginBottom: 16 }}>🎉</div>
      <div style={{ fontSize: 24, fontWeight: 900, color: TEXT, marginBottom: 8 }}>
        Bravo !
      </div>
      <div style={{ fontSize: 15, color: SUB, marginBottom: 28, lineHeight: 1.5 }}>
        Tu as terminé <strong style={{ color: TEXT }}>{scenario.title}</strong> avec {scenario.character}.
      </div>

      {/* XP badge */}
      <div style={{
        background: `linear-gradient(135deg, ${scenario.accent}, ${scenario.accent}cc)`,
        color: 'white', borderRadius: 20, padding: '16px 32px',
        marginBottom: 28, boxShadow: `0 6px 0 ${scenario.accent}60`,
      }}>
        <div style={{ fontSize: 13, fontWeight: 700, opacity: 0.9, marginBottom: 4 }}>Tu gagnes</div>
        <div style={{ fontSize: 36, fontWeight: 900 }}>+{scenario.xp} XP</div>
      </div>

      <div style={{ fontSize: 14, color: SUB, marginBottom: 32, lineHeight: 1.6, maxWidth: 300 }}>
        Continue à pratiquer chaque jour pour progresser vite en Darija !
      </div>

      <button onClick={onBack} style={{
        padding: '14px 36px', borderRadius: 16,
        background: `linear-gradient(135deg, ${scenario.accent}, ${scenario.accent}cc)`,
        color: 'white', border: 'none', cursor: 'pointer',
        fontSize: 16, fontWeight: 800,
        boxShadow: `0 4px 0 ${scenario.accent}60`,
        transition: 'transform 0.1s',
      }}
        onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.transform = 'translateY(-2px)'; }}
        onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.transform = 'none'; }}
      >
        Choisir un autre scénario →
      </button>
    </div>
  );
}

/* ─────────────────────────────────────────────
   DIALOGUE PLAYER
───────────────────────────────────────────── */
function DialoguePlayer({ scenario, onBack, onFinish }: {
  scenario: ScenarioData;
  onBack: () => void;
  onFinish: () => void;
}) {
  const steps = scenario.steps;
  const [revealedCount, setRevealedCount] = useState(1);
  const [choicesMade, setChoicesMade] = useState<Map<number, number>>(new Map());
  const [finished, setFinished] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const t = setTimeout(() => {
      bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, 80);
    return () => clearTimeout(t);
  }, [revealedCount, choicesMade]);

  const lastStep = steps[revealedCount - 1];
  const progress = Math.round((revealedCount / steps.length) * 100);

  const handleContinue = () => {
    const nextIdx = revealedCount;
    if (nextIdx < steps.length) {
      setRevealedCount(c => c + 1);
    }
  };

  const handleChoice = (stepIdx: number, choiceIdx: number) => {
    setChoicesMade(prev => new Map(prev).set(stepIdx, choiceIdx));
    const nextIdx = stepIdx + 1;
    if (nextIdx < steps.length) {
      setRevealedCount(nextIdx + 1);
    }
  };

  const handleFinish = () => {
    setFinished(true);
    onFinish();
  };

  if (finished) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', maxWidth: 640, margin: '0 auto', background: BG }}>
        <div style={{
          display: 'flex', alignItems: 'center', gap: 12, padding: '14px 16px',
          borderBottom: `1.5px solid ${BORDER}`, background: CARD, flexShrink: 0,
        }}>
          <div style={{
            width: 44, height: 44, borderRadius: 14,
            background: `${scenario.accent}20`, border: `2px solid ${scenario.accent}30`,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 22,
          }}>
            {scenario.emoji}
          </div>
          <div>
            <div style={{ fontSize: 15, fontWeight: 900, color: TEXT }}>{scenario.character}</div>
            <div style={{ fontSize: 12, color: scenario.accent, fontWeight: 600 }}>{scenario.title}</div>
          </div>
        </div>
        <DoneScreen scenario={scenario} onBack={onBack} />
        <style>{`@keyframes pWave { 0% { transform: scaleY(0.2); } 100% { transform: scaleY(1); } }`}</style>
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', maxWidth: 640, margin: '0 auto', background: BG }}>

      {/* ── Header ── */}
      <div style={{
        display: 'flex', alignItems: 'center', gap: 12,
        padding: '14px 16px', borderBottom: `1.5px solid ${BORDER}`,
        background: CARD, flexShrink: 0,
      }}>
        <button onClick={onBack} style={{
          width: 36, height: 36, borderRadius: 10,
          background: CARD2, border: 'none', cursor: 'pointer',
          fontSize: 16, color: TEXT,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          ←
        </button>

        <div style={{
          width: 44, height: 44, borderRadius: 14,
          background: `${scenario.accent}20`, border: `2px solid ${scenario.accent}30`,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 22, flexShrink: 0,
        }}>
          {scenario.emoji}
        </div>

        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontSize: 15, fontWeight: 900, color: TEXT }}>{scenario.character}</div>
          <div style={{ fontSize: 12, color: scenario.accent, fontWeight: 600 }}>
            {scenario.role} · {scenario.title}
          </div>
        </div>

        {/* XP badge */}
        <div style={{
          padding: '4px 10px', borderRadius: 10,
          background: `${scenario.accent}18`, border: `1.5px solid ${scenario.accent}30`,
          fontSize: 12, fontWeight: 800, color: scenario.accent,
        }}>
          +{scenario.xp} XP
        </div>
      </div>

      {/* ── Progress bar ── */}
      <div style={{ height: 4, background: 'rgba(255,255,255,0.08)', flexShrink: 0 }}>
        <div style={{
          height: '100%', width: `${progress}%`,
          background: `linear-gradient(90deg, ${scenario.accent}99, ${scenario.accent})`,
          transition: 'width 0.4s ease',
          borderRadius: '0 2px 2px 0',
        }} />
      </div>

      {/* ── Messages ── */}
      <div style={{
        flex: 1, overflowY: 'auto', padding: '20px 16px',
        display: 'flex', flexDirection: 'column', gap: 16,
      }}>
        {steps.slice(0, revealedCount).map((step, idx) => {
          if (step.type === 'bot' || step.type === 'end') {
            return (
              <BotBubble
                key={idx}
                step={step as BotStep}
                accent={scenario.accent}
                emoji={scenario.emoji}
              />
            );
          }

          const choiceStep = step as ChoiceStep;
          const madeChoice = choicesMade.get(idx);

          if (madeChoice !== undefined) {
            const chosen = choiceStep.choices[madeChoice];
            return (
              <UserBubble
                key={idx}
                darija={chosen.darija}
                translit={chosen.translit}
                fr={chosen.fr}
              />
            );
          }

          if (idx === revealedCount - 1) {
            return (
              <div key={idx} style={{ display: 'flex', justifyContent: 'flex-end' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8, maxWidth: '90%' }}>
                  <div style={{ fontSize: 11, fontWeight: 700, color: SUB, textAlign: 'right', marginBottom: 2 }}>
                    Que veux-tu dire ?
                  </div>
                  {choiceStep.choices.map((choice, ci) => (
                    <button
                      key={ci}
                      onClick={() => handleChoice(idx, ci)}
                      style={{
                        background: CARD,
                        border: `2px solid ${scenario.accent}30`,
                        borderRadius: 16, padding: '10px 14px',
                        cursor: 'pointer', textAlign: 'right',
                        transition: 'all 0.15s',
                        boxShadow: `0 2px 0 ${scenario.accent}15`,
                      }}
                      onMouseEnter={e => {
                        const el = e.currentTarget as HTMLButtonElement;
                        el.style.background = `${scenario.accent}15`;
                        el.style.borderColor = scenario.accent + '60';
                        el.style.transform = 'translateY(-1px)';
                      }}
                      onMouseLeave={e => {
                        const el = e.currentTarget as HTMLButtonElement;
                        el.style.background = CARD;
                        el.style.borderColor = scenario.accent + '30';
                        el.style.transform = 'none';
                      }}
                    >
                      <div style={{
                        fontSize: 17, fontFamily: 'var(--font-amiri), serif',
                        direction: 'rtl', color: TEXT, lineHeight: 1.6, marginBottom: 2,
                      }}>
                        {choice.darija}
                      </div>
                      <div style={{ fontSize: 12, color: SUB, fontStyle: 'italic' }}>{choice.translit}</div>
                      <div style={{ fontSize: 12, color: scenario.accent, fontWeight: 600, marginTop: 2 }}>
                        {choice.fr}
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            );
          }

          return null;
        })}

        <div ref={bottomRef} />
      </div>

      {/* ── Bottom action bar ── */}
      {lastStep && lastStep.type !== 'choice' && (
        <div style={{
          padding: '12px 16px', borderTop: `1.5px solid ${BORDER}`,
          background: CARD, flexShrink: 0,
        }}>
          {lastStep.type === 'end' ? (
            <button onClick={handleFinish} style={{
              width: '100%', padding: '14px', borderRadius: 16,
              background: `linear-gradient(135deg, ${scenario.accent}, ${scenario.accent}cc)`,
              color: 'white', border: 'none', cursor: 'pointer',
              fontSize: 16, fontWeight: 800,
              boxShadow: `0 4px 0 ${scenario.accent}60`,
              transition: 'transform 0.1s',
            }}
              onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.transform = 'translateY(-2px)'; }}
              onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.transform = 'none'; }}
            >
              Terminer la conversation · +{scenario.xp} XP 🎉
            </button>
          ) : (
            <button onClick={handleContinue} style={{
              width: '100%', padding: '14px', borderRadius: 16,
              background: CARD2, border: `2px solid ${scenario.accent}30`,
              color: TEXT, cursor: 'pointer',
              fontSize: 15, fontWeight: 700,
              transition: 'all 0.15s',
            }}
              onMouseEnter={e => {
                const el = e.currentTarget as HTMLButtonElement;
                el.style.background = `${scenario.accent}15`;
                el.style.borderColor = scenario.accent + '50';
              }}
              onMouseLeave={e => {
                const el = e.currentTarget as HTMLButtonElement;
                el.style.background = CARD2;
                el.style.borderColor = scenario.accent + '30';
              }}
            >
              Continuer →
            </button>
          )}
        </div>
      )}

      <style>{`@keyframes pWave { 0% { transform: scaleY(0.2); } 100% { transform: scaleY(1); } }`}</style>
    </div>
  );
}

/* ─────────────────────────────────────────────
   PAGE
───────────────────────────────────────────── */
export default function PracticePage() {
  const { addXP } = useUserProgress();
  const [scenario, setScenario] = useState<ScenarioData | null>(null);

  const handleFinish = () => {
    if (scenario) addXP(scenario.xp);
  };

  const handleBack = () => setScenario(null);

  if (!scenario) return <ScenarioPicker onSelect={setScenario} />;

  return (
    <DialoguePlayer
      scenario={scenario}
      onBack={handleBack}
      onFinish={handleFinish}
    />
  );
}
