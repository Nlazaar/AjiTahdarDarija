"use client";

import React from "react";
import FlashCard          from "./FlashCard";
import ChoixLettre        from "./ChoixLettre";
import AssocierLettres    from "./AssocierLettres";
import TrouverLesPaires   from "./TrouverLesPaires";
import EntendreEtChoisir  from "./EntendreEtChoisir";
import VraiFaux           from "./VraiFaux";
import DicterRomanisation from "./DicterRomanisation";
import NumeroterOrdre     from "./NumeroterOrdre";
import PlacerDansEtoile   from "./PlacerDansEtoile";
import TexteReligieux     from "./TexteReligieux";
import SelectionImages    from "./SelectionImages";
import TriDeuxCategories  from "./TriDeuxCategories";
import RelierParTrait     from "./RelierParTrait";
import VoixVisuel, { type VoixVisuelItem } from "./VoixVisuel";
import TrouverIntrus, { type TrouverIntrusItem } from "./TrouverIntrus";
import type { DarijaLetter } from "./types";

export type PreviewVocab = {
  id: string;
  word: string;
  transliteration?: string | null;
  translation?: any;
  imageUrl?: string | null;
  audioUrl?: string | null;
};

interface Props {
  typology: string;
  config: any;
  vocab: PreviewVocab[];
}

function toLetter(v?: PreviewVocab): DarijaLetter | null {
  if (!v) return null;
  return {
    letter: v.word,
    latin: v.transliteration ?? '',
    fr: ((v.translation as any)?.fr ?? (v.translation as any)?.default ?? '') as string,
    imageUrl: v.imageUrl ?? undefined,
  } as DarijaLetter;
}

export default function ExercisePreview({ typology, config, vocab }: Props) {
  const cfg = config ?? {};
  const noop = () => {};
  const noopReady = (_b: boolean) => {};
  const speak = (_l: DarijaLetter) => {};

  const map = new Map(vocab.map(v => [v.id, v]));
  const resolve = (id: any): DarijaLetter | null => toLetter(map.get(id));
  const resolveMany = (ids: any): DarijaLetter[] =>
    Array.isArray(ids) ? ids.map(resolve).filter((x): x is DarijaLetter => !!x) : [];

  const prompt = typeof cfg.prompt === 'string' && cfg.prompt.trim() ? cfg.prompt.trim() : undefined;

  switch (typology) {
    case 'FlashCard': {
      const items = resolveMany(cfg.vocabIds);
      const first = items[0];
      if (!first) return <Empty msg="Sélectionne au moins 1 item." />;
      return (
        <FlashCard
          letter={first}
          onContinue={noop}
          onSpeak={speak}
          progress={`1 / ${items.length}`}
          mode="mot"
          prompt={prompt}
        />
      );
    }
    case 'ChoixLettre': {
      const target = resolve(cfg.targetVocabId);
      const distractors = resolveMany(cfg.distractorVocabIds);
      if (!target) return <Empty msg="Choisis un item cible." />;
      return (
        <ChoixLettre
          letter={target}
          choices={[target, ...distractors]}
          onSuccess={noop}
          onFailed={noop}
          onSpeak={speak}
          onReadyChange={noopReady}
          mode="mot"
          prompt={prompt}
        />
      );
    }
    case 'EntendreEtChoisir': {
      const target = resolve(cfg.targetVocabId);
      const distractors = resolveMany(cfg.distractorVocabIds);
      if (!target) return <Empty msg="Choisis un item cible." />;
      return (
        <EntendreEtChoisir
          letter={target}
          choices={[target, ...distractors]}
          onSuccess={noop}
          onFailed={noop}
          onSpeak={speak}
          onReadyChange={noopReady}
          mode="mot"
          prompt={prompt}
        />
      );
    }
    case 'VraiFaux': {
      const target = resolve(cfg.targetVocabId);
      const proposed = resolve(cfg.proposedVocabId);
      if (!target) return <Empty msg="Choisis un item cible." />;
      return (
        <VraiFaux
          letter={target}
          proposed={{ latin: proposed?.latin ?? target.latin, fr: proposed?.fr }}
          isTrue={cfg.targetVocabId === cfg.proposedVocabId}
          onSuccess={noop}
          onFailed={noop}
          onSpeak={speak}
          onReadyChange={noopReady}
          mode="mot"
          prompt={prompt}
        />
      );
    }
    case 'DicterRomanisation': {
      const target = resolve(cfg.targetVocabId);
      const distractors = resolveMany(cfg.distractorVocabIds);
      if (!target) return <Empty msg="Choisis un item cible." />;
      return (
        <DicterRomanisation
          letter={target}
          choices={[target.latin, ...distractors.map(d => d.latin)]}
          onSuccess={noop}
          onFailed={noop}
          onSpeak={speak}
          onReadyChange={noopReady}
          prompt={prompt}
        />
      );
    }
    case 'AssocierLettres': {
      const items = resolveMany(cfg.vocabIds);
      if (items.length < 2) return <Empty msg="Sélectionne au moins 2 items." />;
      return <AssocierLettres pairs={items} onConfirm={noop} onReadyChange={noopReady} mode="mot" prompt={prompt} />;
    }
    case 'TrouverLesPaires': {
      const items = resolveMany(cfg.vocabIds);
      if (items.length < 2) return <Empty msg="Sélectionne au moins 2 items." />;
      return <TrouverLesPaires pairs={items} onConfirm={noop} onReadyChange={noopReady} mode="mot" prompt={prompt} />;
    }
    case 'NumeroterOrdre': {
      const items = Array.isArray(cfg.items) ? cfg.items : [];
      if (items.length === 0) return <Empty msg="Ajoute des items à ordonner." />;
      return <NumeroterOrdre items={items} onConfirm={noop} onReadyChange={noopReady} prompt={prompt} />;
    }
    case 'PlacerDansEtoile': {
      const zones = Array.isArray(cfg.zones) ? cfg.zones : [];
      const words = Array.isArray(cfg.words) ? cfg.words : [];
      if (zones.length === 0) return <Empty msg="Définis les zones de l'étoile." />;
      return <PlacerDansEtoile zones={zones} words={words} onConfirm={noop} onReadyChange={noopReady} prompt={prompt} />;
    }
    case 'TexteReligieux': {
      const arabe = typeof cfg.arabe === 'string' ? cfg.arabe : '';
      const fr = typeof cfg.fr === 'string' ? cfg.fr : '';
      if (!arabe && !fr) return <Empty msg="Ajoute le texte arabe et/ou français." />;
      return (
        <TexteReligieux
          arabe={arabe}
          fr={fr}
          source={typeof cfg.source === 'string' ? cfg.source : undefined}
          titre={typeof cfg.titre === 'string' ? cfg.titre : undefined}
          onConfirm={noop}
          onReadyChange={noopReady}
          prompt={prompt}
        />
      );
    }
    case 'SelectionImages': {
      const items = Array.isArray(cfg.items) ? cfg.items : [];
      if (items.length === 0) return <Empty msg="Ajoute des items à sélectionner." />;
      return (
        <SelectionImages
          question={cfg.question}
          questionFr={cfg.questionFr}
          items={items}
          minSelection={typeof cfg.minSelection === 'number' ? cfg.minSelection : undefined}
          freeSelection={cfg.freeSelection === true}
          onConfirm={noop}
          onReadyChange={noopReady}
          prompt={prompt}
        />
      );
    }
    case 'TriDeuxCategories': {
      const items = Array.isArray(cfg.items) ? cfg.items : [];
      if (items.length === 0) return <Empty msg="Ajoute des items à trier." />;
      return (
        <TriDeuxCategories
          question={cfg.question}
          questionFr={cfg.questionFr}
          categorieA={cfg.categorieA ?? { label: 'A' }}
          categorieB={cfg.categorieB ?? { label: 'B' }}
          items={items}
          onConfirm={noop}
          onReadyChange={noopReady}
          prompt={prompt}
        />
      );
    }
    case 'RelierParTrait': {
      const pairesGauche = Array.isArray(cfg.pairesGauche) ? cfg.pairesGauche : [];
      const pairesDroite = Array.isArray(cfg.pairesDroite) ? cfg.pairesDroite : [];
      if (pairesGauche.length === 0 || pairesDroite.length === 0) {
        return <Empty msg="Ajoute des items des deux côtés." />;
      }
      return (
        <RelierParTrait
          question={cfg.question}
          questionFr={cfg.questionFr}
          pairesGauche={pairesGauche}
          pairesDroite={pairesDroite}
          correct={(cfg.correct ?? {}) as Record<string, string>}
          onConfirm={noop}
          onReadyChange={noopReady}
          prompt={prompt}
        />
      );
    }
    case 'VoixVisuel': {
      const ids: string[] = Array.isArray(cfg.vocabIds) ? cfg.vocabIds : [];
      const items: VoixVisuelItem[] = ids
        .map((id) => map.get(id))
        .filter((v): v is PreviewVocab => !!v)
        .map((v) => ({
          id: v.id,
          audio: { url: v.audioUrl ?? undefined, fallbackText: v.word },
          visual: { kind: 'text', value: v.word, lang: 'ar' as const },
          label: typeof v.translation === 'object' && v.translation?.fr ? v.translation.fr : v.transliteration ?? v.word,
        }));
      if (items.length < 2) return <Empty msg="Sélectionne au moins 2 items." />;
      return (
        <VoixVisuel
          config={{
            mode: cfg.mode === 'drag' ? 'drag' : 'ligne',
            prompt,
            items,
          }}
          onReadyChange={noopReady}
        />
      );
    }
    case 'TrouverIntrus': {
      const ids: string[] = Array.isArray(cfg.vocabIds) ? cfg.vocabIds : [];
      const played: string[] = Array.isArray(cfg.playedIds) ? cfg.playedIds : [];
      const items: TrouverIntrusItem[] = ids
        .map((id) => map.get(id))
        .filter((v): v is PreviewVocab => !!v)
        .map((v) => ({
          id: v.id,
          audio: { url: v.audioUrl ?? undefined, fallbackText: v.word },
          visual: { kind: 'text', value: v.word, lang: 'ar' as const },
          label: typeof v.translation === 'object' && v.translation?.fr ? v.translation.fr : v.transliteration ?? v.word,
        }));
      if (items.length < 3) return <Empty msg="Sélectionne au moins 3 items." />;
      if (played.length === 0 || played.length >= items.length) {
        return <Empty msg="Coche 1 à N-1 voix pour définir un intrus." />;
      }
      return (
        <TrouverIntrus
          config={{ prompt, items, playedIds: played }}
          onReadyChange={noopReady}
        />
      );
    }
    default:
      return <Empty msg={`Aperçu non disponible pour "${typology}"`} />;
  }
}

function Empty({ msg }: { msg: string }) {
  return (
    <div style={{
      padding: 30,
      textAlign: 'center',
      color: 'var(--c-sub)',
      fontSize: 13,
      border: '1px dashed var(--c-border)',
      borderRadius: 12,
      background: 'var(--c-bg)',
    }}>
      {msg}
    </div>
  );
}
