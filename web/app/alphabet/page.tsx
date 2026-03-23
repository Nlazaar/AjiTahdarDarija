"use client";
import React, { useMemo, useState } from "react";
import ProgressBar from "../../../web/components/ProgressBar";
import AlphabetExercise from "../../../web/components/AlphabetExercise";
import { darijaAlphabet } from "../../../backend/data/alphabet/alphabet";
import Link from "next/link";

type Letter = { letter: string; latin: string; fr: string };

function sampleLetters(count: number): Letter[] {
  // Deterministic selection to avoid server/client hydration mismatches.
  // For now pick the first `count` letters from the data set.
  return darijaAlphabet.slice(0, count);
}

export default function AlphabetPage() {
  const initial = useMemo(() => sampleLetters(5), []);
  const total = initial.length;

  const [items, setItems] = useState(
    initial.map((it, idx) => ({ id: idx, item: it, status: "pending" as "pending" | "failed" | "success" }))
  );

  const [queue, setQueue] = useState<number[]>(items.map((t) => t.id));
  const [pos, setPos] = useState(0);

  const succeededCount = items.filter((i) => i.status === "success").length;

  const currentId = queue[pos];
  const current = items.find((i) => i.id === currentId);

  function getChoices(correct: string) {
    // Deterministic choice generation to keep server/client rendering identical.
    const others = darijaAlphabet.filter((d) => d.latin !== correct).map((d) => d.latin);
    const pick = others.slice(0, 2);
    const arr = [correct, ...pick];
    // stable sort (by string) so order is deterministic
    return arr.sort();
  }

  const handleResult = (ok: boolean) => {
    if (!current) return;
    setItems((prev) => prev.map((p) => (p.id === current.id ? { ...p, status: ok ? "success" : "failed" } : p)));

    // move to next
    if (pos + 1 < queue.length) {
      setPos(pos + 1);
    } else {
      // end of pass
      const failed = items.filter((i) => i.id === current.id ? (ok ? false : true) : i.status === "failed").map((i) => i.id);
      // recompute failed after updating state: use callback style
      setTimeout(() => {
        setItems((latest) => {
          const failedNow = latest.filter((x) => x.status !== "success").map((x) => x.id);
          if (failedNow.length === 0) {
            setQueue([]);
            setPos(0);
          } else {
            setQueue(failedNow);
            setPos(0);
          }
          return latest;
        });
      }, 50);
    }
  };

  function getAudioUrl(latin: string) {
    // backend endpoint that serves/generated audio
    const API = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3001'
    return `${API}/audio/alphabet/${encodeURIComponent(latin)}`
  }

  return (
    <main className="min-h-screen bg-gray-50 flex flex-col items-center py-8 px-4">
      <div className="w-full max-w-3xl">
        <header className="mb-4">
          <h1 className="text-3xl font-bold">Alphabet</h1>
        </header>

        <div className="mb-6">
          <ProgressBar total={total} succeeded={succeededCount} />
        </div>

        <section>
          {current ? (
            <div>
              <AlphabetExercise
                item={current.item}
                choices={getChoices(current.item.latin)}
                onResult={handleResult}
                getAudioUrl={getAudioUrl}
              />
              <div className="mt-4 text-sm text-gray-600 text-center">Exercice {pos + 1} / {queue.length}</div>
            </div>
          ) : (
            <div className="bg-white rounded-xl p-8 text-center shadow-md">
              <h2 className="text-2xl font-semibold mb-3">Félicitations !</h2>
              <p className="text-gray-600 mb-6">Vous avez réussi tous les exercices de cette série.</p>
              <div className="flex justify-center gap-4">
                <Link href="/" className="px-4 py-2 rounded-full bg-blue-600 text-white">Retour au parcours</Link>
              </div>
            </div>
          )}
        </section>

      </div>
    </main>
  );
}
