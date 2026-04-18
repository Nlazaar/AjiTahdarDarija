'use client';

import SpeakerButton from '@/components/SpeakerButton';

type Elt = { id?: string; ar?: string; fr?: string; emoji?: string };

/**
 * Fallback pour les mécaniques PDF non-interactives (découpage, écriture, tracé...).
 * Affiche le contenu en lecture + bouton "Continuer".
 */
export default function PdfExercisePreview({
  title, prompt, mecanique, elements, onDone,
}: {
  title?: string;
  prompt?: string;
  mecanique?: string;
  elements: Elt[];
  onDone: (result: { correct: boolean; xp: number; score: number }) => void;
}) {
  return (
    <div className="w-full max-w-2xl mx-auto px-4 py-6 flex flex-col gap-5">
      {title && <h2 className="text-lg font-black text-center" style={{ color: '#e8eaed' }}>{title}</h2>}
      {prompt && <p className="text-[14px] text-center" style={{ color: '#a7b3ba' }}>{prompt}</p>}

      {mecanique && (
        <div className="text-center text-[11px] uppercase tracking-widest font-black px-3 py-1 rounded-full self-center" style={{ color: '#6b7f8a', background: '#1e2d35', border: '1px solid #2a3d47' }}>
          {mecanique}
        </div>
      )}

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        {elements.map((el, i) => (
          <div
            key={el.id ?? i}
            className="rounded-2xl p-4 flex flex-col items-center gap-2"
            style={{ background: '#1e2d35', border: '2px solid #2a3d47' }}
          >
            {el.emoji && <span className="text-2xl">{el.emoji}</span>}
            {el.ar && <span className="text-2xl font-black text-center" style={{ color: '#ffc800', fontFamily: 'Amiri, serif' }}>{el.ar}</span>}
            {el.fr && <span className="text-[11px] text-center" style={{ color: '#a7b3ba' }}>{el.fr}</span>}
            {el.ar && <SpeakerButton text={el.ar} size="sm" />}
          </div>
        ))}
      </div>

      <button
        onClick={() => onDone({ correct: true, xp: 5, score: 100 })}
        className="mt-4 py-3 rounded-xl text-[13px] font-black uppercase tracking-wider text-white"
        style={{ background: '#58cc02', boxShadow: '0 4px 0 #46a302' }}
      >
        J'ai lu, continuer
      </button>
    </div>
  );
}
