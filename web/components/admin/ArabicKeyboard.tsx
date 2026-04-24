"use client";

import React, { useRef, useState } from "react";

type InputEl = HTMLInputElement | HTMLTextAreaElement;

interface Props {
  value: string;
  onChange: (next: string) => void;
  /** Ref vers l'input/textarea pour insérer à la position du curseur. */
  targetRef?: React.RefObject<InputEl | null>;
  /** Contrôle l'affichage du clavier (inline). */
  open: boolean;
}

const LETTERS: string[][] = [
  ["ا", "ب", "ت", "ث", "ج", "ح", "خ"],
  ["د", "ذ", "ر", "ز", "س", "ش", "ص"],
  ["ض", "ط", "ظ", "ع", "غ", "ف", "ق"],
  ["ك", "ل", "م", "ن", "ه", "و", "ي"],
];

const HAMZAS: { ch: string; label: string }[] = [
  { ch: "ء", label: "ء" },
  { ch: "أ", label: "أ" },
  { ch: "إ", label: "إ" },
  { ch: "آ", label: "آ" },
  { ch: "ؤ", label: "ؤ" },
  { ch: "ئ", label: "ئ" },
  { ch: "ة", label: "ة" },
  { ch: "ى", label: "ى" },
  { ch: "لا", label: "لا" },
];

const HARAKAT: { ch: string; label: string; hint: string }[] = [
  { ch: "\u064E", label: "َ", hint: "Fatha (a)" },
  { ch: "\u0650", label: "ِ", hint: "Kasra (i)" },
  { ch: "\u064F", label: "ُ", hint: "Damma (u)" },
  { ch: "\u064B", label: "ً", hint: "Tanwīn fath (an)" },
  { ch: "\u064D", label: "ٍ", hint: "Tanwīn kasr (in)" },
  { ch: "\u064C", label: "ٌ", hint: "Tanwīn damm (un)" },
  { ch: "\u0652", label: "ْ", hint: "Sukūn" },
  { ch: "\u0651", label: "ّ", hint: "Shadda" },
  { ch: "\u0640", label: "ـ", hint: "Tatwil (kashida)" },
];

// Variantes vocalisées les plus fréquentes (lettre + haraka)
const LETTER_VARIANTS: { suffix: string; hint: string }[] = [
  { suffix: "",        hint: "nue" },
  { suffix: "\u064E",  hint: "+ fatha (a)" },
  { suffix: "\u0650",  hint: "+ kasra (i)" },
  { suffix: "\u064F",  hint: "+ damma (u)" },
  { suffix: "\u0652",  hint: "+ sukūn" },
  { suffix: "\u0651",  hint: "+ shadda" },
  { suffix: "\u0651\u064E", hint: "+ shadda + fatha" },
  { suffix: "\u0651\u0650", hint: "+ shadda + kasra" },
  { suffix: "\u0651\u064F", hint: "+ shadda + damma" },
  { suffix: "\u064B",  hint: "+ tanwīn fath (an)" },
  { suffix: "\u064D",  hint: "+ tanwīn kasr (in)" },
  { suffix: "\u064C",  hint: "+ tanwīn damm (un)" },
];

const BTN: React.CSSProperties = {
  minWidth: 36,
  height: 36,
  borderRadius: 8,
  border: "1px solid var(--c-border)",
  background: "var(--c-card)",
  color: "var(--c-text)",
  fontFamily: "var(--font-amiri), serif",
  fontSize: 20,
  cursor: "pointer",
  padding: "0 8px",
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  transition: "all 0.1s",
};

const BTN_HARAKA: React.CSSProperties = {
  ...BTN,
  background: "rgba(212,168,75,0.12)",
  borderColor: "rgba(212,168,75,0.5)",
  color: "#d4a84b",
  fontSize: 22,
  paddingBottom: 4,
};

const SECTION: React.CSSProperties = {
  display: "flex",
  flexWrap: "wrap",
  gap: 4,
  marginBottom: 6,
};

const LABEL: React.CSSProperties = {
  fontSize: 10,
  fontWeight: 800,
  letterSpacing: "0.08em",
  textTransform: "uppercase",
  color: "var(--c-sub)",
  margin: "4px 0 4px 2px",
};

type Mode = "simple" | "variantes";

export default function ArabicKeyboard({ value, onChange, targetRef, open }: Props) {
  const lastSelectionRef = useRef<{ start: number; end: number } | null>(null);
  const [mode, setMode] = useState<Mode>("simple");
  const [variantsFor, setVariantsFor] = useState<string | null>(null);

  const captureSelection = () => {
    const el = targetRef?.current;
    if (!el) return;
    lastSelectionRef.current = {
      start: el.selectionStart ?? el.value.length,
      end: el.selectionEnd ?? el.value.length,
    };
  };

  const insert = (ch: string) => {
    const el = targetRef?.current;
    if (!el) {
      onChange(value + ch);
      return;
    }
    const sel = lastSelectionRef.current ?? {
      start: el.selectionStart ?? value.length,
      end: el.selectionEnd ?? value.length,
    };
    const next = value.slice(0, sel.start) + ch + value.slice(sel.end);
    onChange(next);
    const nextPos = sel.start + ch.length;
    lastSelectionRef.current = { start: nextPos, end: nextPos };
    requestAnimationFrame(() => {
      el.focus();
      try { el.setSelectionRange(nextPos, nextPos); } catch { /* noop */ }
    });
  };

  const backspace = () => {
    const el = targetRef?.current;
    if (!el) {
      onChange(value.slice(0, -1));
      return;
    }
    const sel = lastSelectionRef.current ?? {
      start: el.selectionStart ?? value.length,
      end: el.selectionEnd ?? value.length,
    };
    if (sel.start !== sel.end) {
      const next = value.slice(0, sel.start) + value.slice(sel.end);
      onChange(next);
      lastSelectionRef.current = { start: sel.start, end: sel.start };
      requestAnimationFrame(() => {
        el.focus();
        try { el.setSelectionRange(sel.start, sel.start); } catch { /* noop */ }
      });
      return;
    }
    if (sel.start === 0) return;
    const next = value.slice(0, sel.start - 1) + value.slice(sel.start);
    onChange(next);
    const nextPos = sel.start - 1;
    lastSelectionRef.current = { start: nextPos, end: nextPos };
    requestAnimationFrame(() => {
      el.focus();
      try { el.setSelectionRange(nextPos, nextPos); } catch { /* noop */ }
    });
  };

  const handleLetterClick = (letter: string) => {
    if (mode === "simple") {
      insert(letter);
    } else {
      setVariantsFor((prev) => (prev === letter ? null : letter));
    }
  };

  const handleLetterContext = (e: React.MouseEvent, letter: string) => {
    e.preventDefault();
    setVariantsFor((prev) => (prev === letter ? null : letter));
  };

  if (!open) return null;

  return (
    <div
      onMouseDown={(e) => {
        // Empêche le blur du champ quand on clique sur le clavier
        if ((e.target as HTMLElement).tagName === "BUTTON") {
          e.preventDefault();
          captureSelection();
        }
      }}
      style={{
        marginTop: 8,
        padding: 10,
        border: "1px solid var(--c-border)",
        borderRadius: 10,
        background: "var(--c-card2)",
        direction: "ltr",
      }}
    >
      {/* En-tête : mode */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 8 }}>
        <div style={{ fontSize: 10, fontWeight: 800, letterSpacing: "0.08em", textTransform: "uppercase", color: "var(--c-sub)" }}>
          ⌨ Clavier arabe
        </div>
        <div style={{ display: "flex", gap: 0, borderRadius: 6, overflow: "hidden", border: "1px solid var(--c-border)" }}>
          <button
            type="button"
            onClick={() => { setMode("simple"); setVariantsFor(null); }}
            style={{
              fontSize: 10, fontWeight: 700, padding: "4px 8px", border: "none", cursor: "pointer",
              background: mode === "simple" ? "#d4a84b" : "transparent",
              color: mode === "simple" ? "#1a1a1a" : "var(--c-sub)",
            }}
          >
            Simple
          </button>
          <button
            type="button"
            onClick={() => setMode("variantes")}
            style={{
              fontSize: 10, fontWeight: 700, padding: "4px 8px", border: "none", cursor: "pointer",
              background: mode === "variantes" ? "#d4a84b" : "transparent",
              color: mode === "variantes" ? "#1a1a1a" : "var(--c-sub)",
            }}
          >
            Variantes
          </button>
        </div>
      </div>

      <div style={{ fontSize: 10, color: "var(--c-sub)", marginBottom: 6, lineHeight: 1.4 }}>
        {mode === "simple"
          ? "Clic = insère la lettre. Clic droit = variantes vocalisées."
          : "Clic = ouvre les variantes vocalisées de la lettre."}
      </div>

      <div style={LABEL}>Lettres</div>
      {LETTERS.map((row, i) => (
        <div key={i} style={{ ...SECTION, justifyContent: "space-between", gap: 4 }}>
          {row.map((ch) => (
            <button
              type="button"
              key={ch}
              style={{
                ...BTN,
                flex: 1,
                minWidth: 0,
                ...(variantsFor === ch ? { borderColor: "#d4a84b", background: "rgba(212,168,75,0.18)" } : null),
              }}
              onClick={() => handleLetterClick(ch)}
              onContextMenu={(e) => handleLetterContext(e, ch)}
              title={`${ch} — clic droit pour variantes`}
            >
              {ch}
            </button>
          ))}
        </div>
      ))}

      {variantsFor && (
        <div
          style={{
            marginTop: 4,
            marginBottom: 8,
            padding: 8,
            border: "1px solid rgba(212,168,75,0.5)",
            borderRadius: 8,
            background: "rgba(212,168,75,0.08)",
          }}
        >
          <div style={{ ...LABEL, color: "#d4a84b", marginTop: 0 }}>
            Variantes de « {variantsFor} »
          </div>
          <div style={SECTION}>
            {LETTER_VARIANTS.map((v) => {
              const composed = variantsFor + v.suffix;
              return (
                <button
                  type="button"
                  key={v.suffix || "_nue"}
                  style={{ ...BTN, fontSize: 22 }}
                  onClick={() => { insert(composed); }}
                  title={v.hint}
                >
                  {composed}
                </button>
              );
            })}
          </div>
        </div>
      )}

      <div style={LABEL}>Hamza & variantes</div>
      <div style={SECTION}>
        {HAMZAS.map((h) => (
          <button type="button" key={h.ch} style={BTN} onClick={() => insert(h.ch)} title={h.ch}>
            {h.label}
          </button>
        ))}
      </div>

      {mode === "simple" && (
        <>
          <div style={LABEL}>Voyelles / diacritiques (harakat)</div>
          <div style={SECTION}>
            {HARAKAT.map((h) => (
              <button type="button" key={h.ch} style={BTN_HARAKA} onClick={() => insert(h.ch)} title={h.hint}>
                <span style={{ display: "inline-block", minWidth: 14, textAlign: "center" }}>
                  {"\u25CC"}{h.ch}
                </span>
              </button>
            ))}
          </div>
        </>
      )}

      <div style={LABEL}>Espaces & ponctuation</div>
      <div style={SECTION}>
        <button type="button" style={{ ...BTN, minWidth: 120 }} onClick={() => insert(" ")}>Espace</button>
        <button type="button" style={BTN} onClick={() => insert("،")} title="Virgule arabe">،</button>
        <button type="button" style={BTN} onClick={() => insert("؛")} title="Point-virgule arabe">؛</button>
        <button type="button" style={BTN} onClick={() => insert("؟")} title="Point d'interrogation arabe">؟</button>
        <button type="button" style={BTN} onClick={() => insert(".")}>.</button>
        <button
          type="button"
          style={{ ...BTN, minWidth: 80, background: "rgba(255,75,75,0.1)", borderColor: "rgba(255,75,75,0.4)", color: "#ff4b4b" }}
          onClick={backspace}
          title="Supprimer le caractère précédent"
        >
          ⌫
        </button>
      </div>
    </div>
  );
}
