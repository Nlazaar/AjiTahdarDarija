'use client';

import { useMemo, useState } from 'react';
import SpeakerButton from '@/components/SpeakerButton';

type Elt = { id?: string; ar?: string; fr?: string; emoji?: string };

// Emojis indiquant une réponse correcte dans les données PDF
const CORRECT_EMOJI_RE = /[🔴🟡🟢🔵🟠🟣✅]/u;

function isCorrect(el: Elt): boolean {
  if (!el.emoji) return false;
  return CORRECT_EMOJI_RE.test(el.emoji);
}

// Strip correctness-spoiling emojis before rendering
function cleanEmoji(e?: string): string | undefined {
  if (!e) return undefined;
  return e.replace(CORRECT_EMOJI_RE, '').replace(/[❌⬜]/gu, '').trim() || undefined;
}

export default function ElementPicker({
  title, prompt, elements, onDone,
}: {
  title?: string;
  prompt?: string;
  elements: Elt[];
  onDone: (result: { correct: boolean; xp: number; score: number }) => void;
}) {
  const modele = elements.find(e => e.id === 'modele' || e.id === '1' || e.id === 'modèle');
  const items = useMemo(() => elements.filter(e => e !== modele), [elements, modele]);
  const correctIds = useMemo(() => new Set(items.filter(isCorrect).map(e => e.id ?? e.ar ?? '')), [items]);
  const [picked, setPicked] = useState<Set<string>>(new Set());
  const [submitted, setSubmitted] = useState(false);

  const toggle = (id: string) => {
    if (submitted) return;
    setPicked(prev => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const handleSubmit = () => {
    if (submitted) return;
    setSubmitted(true);
    const total = correctIds.size || items.length;
    const hits = [...picked].filter(id => correctIds.has(id)).length;
    const misses = [...picked].filter(id => !correctIds.has(id)).length;
    const score = Math.max(0, Math.min(100, Math.round(((hits - misses) / Math.max(1, total)) * 100)));
    const correct = score >= 70;
    setTimeout(() => onDone({ correct, xp: correct ? 10 : 3, score }), 900);
  };

  return (
    <div className="w-full max-w-2xl mx-auto px-4 py-6 flex flex-col gap-5">
      {title && <h2 className="text-lg font-black text-center" style={{ color: '#e8eaed' }}>{title}</h2>}
      {prompt && <p className="text-[14px] font-medium text-center" style={{ color: '#a7b3ba' }}>{prompt}</p>}

      {modele && (
        <div className="flex items-center justify-center gap-3 rounded-2xl p-4" style={{ background: '#1e2d35', border: '2px solid #2a3d47' }}>
          <span className="text-[11px] uppercase tracking-widest font-black" style={{ color: '#6b7f8a' }}>Modèle</span>
          <span className="text-3xl font-black" style={{ color: '#ffc800', fontFamily: 'Amiri, serif' }}>{modele.ar}</span>
          {modele.ar && <SpeakerButton text={modele.ar} size="sm" />}
        </div>
      )}

      <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
        {items.map((el, i) => {
          const id = el.id ?? el.ar ?? String(i);
          const isPicked = picked.has(id);
          const wasCorrect = correctIds.has(id);
          let bg = '#1e2d35';
          let border = '#2a3d47';
          if (submitted) {
            if (isPicked && wasCorrect) { bg = '#22543d'; border = '#58cc02'; }
            else if (isPicked && !wasCorrect) { bg = '#5a2129'; border = '#ff4b4b'; }
            else if (!isPicked && wasCorrect) { border = '#58cc02'; }
          } else if (isPicked) {
            bg = '#2d4a5c'; border = '#1cb0f6';
          }
          return (
            <button
              key={id}
              onClick={() => toggle(id)}
              disabled={submitted}
              className="aspect-square rounded-2xl flex flex-col items-center justify-center gap-1 transition-all"
              style={{ background: bg, border: `2px solid ${border}`, cursor: submitted ? 'default' : 'pointer' }}
            >
              <span className="text-3xl font-black" style={{ color: '#e8eaed', fontFamily: 'Amiri, serif' }}>{el.ar}</span>
              {cleanEmoji(el.emoji) && <span className="text-lg">{cleanEmoji(el.emoji)}</span>}
            </button>
          );
        })}
      </div>

      <button
        onClick={handleSubmit}
        disabled={submitted || picked.size === 0}
        className="mt-4 py-3 rounded-xl text-[13px] font-black uppercase tracking-wider text-white"
        style={{
          background: submitted || picked.size === 0 ? '#3a4651' : '#58cc02',
          boxShadow: submitted || picked.size === 0 ? 'none' : '0 4px 0 #46a302',
          cursor: submitted || picked.size === 0 ? 'not-allowed' : 'pointer',
        }}
      >
        {submitted ? 'Vérification…' : 'Valider'}
      </button>
    </div>
  );
}
