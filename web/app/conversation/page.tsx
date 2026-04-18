"use client";

import React, { useCallback, useEffect, useRef, useState } from "react";
import { useAudio } from "@/hooks/useAudio";
import { useASR } from "@/hooks/useASR";
import { useUser } from "@/context/UserContext";

// ── Types ────────────────────────────────────────────────────────────────────

type Role = "user" | "assistant";

interface Message {
  id: string;
  role: Role;
  content: string;
  pending?: boolean;
}

// ── Constants ────────────────────────────────────────────────────────────────

const SYSTEM_PROMPT = `Réponds en Darija marocaine AUTHENTIQUE uniquement (jamais arabe classique/égyptien/du Golfe).
Utilise le vocabulaire marocain : daba, bzaf, bghit, wakha, labas, mashi, wach, zwina, bla, smiya...
Adapte le niveau de l'élève : commence simple, progresse doucement.`;

// ── Helpers ───────────────────────────────────────────────────────────────────

/**
 * Extrait la translittération latine d'une réponse bot formatée.
 * Format attendu : ligne 1 = arabe, ligne 2 = latin, ligne 3+ = traduction/exemple
 * Ex: "لاباس\nLabas\nÇa va" → "Labas"
 * La translittération latine est bien mieux prononcée par le TTS que l'arabe script.
 */
/**
 * Extrait uniquement les lignes en arabe pour le TTS Azure (ar-MA-JamalNeural).
 * Azure prononce parfaitement l'arabe — on lui donne que l'arabe, pas le français ni la translittération.
 */
/** Extrait la ligne 🔊 (arabe script) pour Azure TTS ar-MA-JamalNeural */
function extractForSpeech(text: string): string {
  const lines = text.split("\n").map(l => l.trim());
  const arabic = lines.find(l => l.startsWith("🔊"));
  if (arabic) return arabic.replace(/^🔊\s*/i, "").trim();
  // Fallback : toute ligne contenant de l'arabe
  const arabicLine = lines.find(l => /[\u0600-\u06FF]/.test(l));
  return arabicLine ?? lines[0] ?? text;
}

/**
 * Formate la réponse du bot ligne par ligne :
 * - Lignes arabes  → grande police Amiri, direction RTL, couleur accent
 * - Lignes latines → translittération en italique
 * - Autres lignes  → traduction / exemple en gris
 */
function FormattedBotMessage({ content }: { content: string }) {
  const lines = content.split("\n").filter(l => l.trim());
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
      {lines.map((line, i) => {
        if (line.startsWith("🗣️")) return (
          <div key={i} style={{
            fontSize: 18, fontWeight: 800, color: "#58cc02",
            background: "rgba(88,204,2,0.08)",
            borderRadius: 8, padding: "8px 12px", letterSpacing: "0.02em",
          }}>{line}</div>
        );
        if (line.startsWith("🔊")) return null; // caché — utilisé uniquement pour le TTS
        if (line.startsWith("🇫🇷")) return (
          <div key={i} style={{ fontSize: 14, color: "var(--c-text)" }}>{line}</div>
        );
        if (line.startsWith("💡")) return (
          <div key={i} style={{
            fontSize: 13, color: "var(--c-sub)",
            borderLeft: "2px solid #58cc02", paddingLeft: 8,
            marginTop: 2, fontStyle: "italic",
          }}>{line}</div>
        );
        return <div key={i} style={{ fontSize: 14, color: "var(--c-text)" }}>{line}</div>;
      })}
    </div>
  );
}

// ── Sous-composants ──────────────────────────────────────────────────────────

function Bubble({ msg, onSpeak }: { msg: Message; onSpeak: (text: string) => void }) {
  const isUser = msg.role === "user";
  return (
    <div style={{
      display: "flex",
      flexDirection: "column",
      alignItems: isUser ? "flex-end" : "flex-start",
      marginBottom: 12,
    }}>
      {/* Avatar label */}
      <span style={{
        fontSize: 11, fontWeight: 700, letterSpacing: "0.05em",
        textTransform: "uppercase",
        color: "var(--c-sub)", marginBottom: 4,
        paddingLeft: isUser ? 0 : 4, paddingRight: isUser ? 4 : 0,
      }}>
        {isUser ? "Toi" : "Aji 🤖"}
      </span>

      <div style={{
        display: "flex",
        alignItems: "flex-end",
        gap: 6,
        flexDirection: isUser ? "row-reverse" : "row",
      }}>
        <div style={{
          maxWidth: "70%",
          padding: "10px 14px",
          borderRadius: isUser ? "18px 18px 4px 18px" : "18px 18px 18px 4px",
          background: isUser ? "#58cc02" : "var(--c-card)",
          color: isUser ? "white" : "var(--c-text)",
          fontSize: 15,
          lineHeight: 1.6,
          border: isUser ? "none" : "1px solid var(--c-border)",
          boxShadow: "0 1px 4px rgba(0,0,0,0.08)",
        }}>
          {msg.pending ? (
            <span style={{ display: "flex", gap: 4, alignItems: "center" }}>
              <Dot delay={0} /><Dot delay={0.15} /><Dot delay={0.3} />
            </span>
          ) : isUser ? (
            <span>{msg.content}</span>
          ) : (
            <FormattedBotMessage content={msg.content} />
          )}
        </div>

        {/* Bouton écouter (messages bot uniquement) */}
        {!isUser && !msg.pending && (
          <button
            onClick={() => onSpeak(extractForSpeech(msg.content))}
            title="Écouter"
            style={{
              background: "var(--c-card2)",
              border: "1px solid var(--c-border)",
              borderRadius: "50%",
              width: 30, height: 30,
              display: "flex", alignItems: "center", justifyContent: "center",
              cursor: "pointer", fontSize: 14, flexShrink: 0,
              transition: "background 0.15s",
            }}
          >
            🔊
          </button>
        )}
      </div>
    </div>
  );
}

function Dot({ delay }: { delay: number }) {
  return (
    <span style={{
      width: 7, height: 7, borderRadius: "50%",
      background: "var(--c-sub)",
      display: "inline-block",
      animation: "bounce 1s infinite",
      animationDelay: `${delay}s`,
    }} />
  );
}

// ── Page principale ──────────────────────────────────────────────────────────

const WELCOME: Record<string, string> = {
  DARIJA: "أهلاً! أنا أجي، أستاذك الافتراضي.\n(Ahlan! Ana Aji, ustad-ek el-iftiradi.)\n\nBienvenue ! Je suis Aji, ton professeur de **Darija marocaine**. Que veux-tu apprendre aujourd'hui ?",
  MSA:    "مَرْحَباً! أَنَا أَجِي، أُسْتَاذُكَ الاِفْتِرَاضِي.\n(Marhaban! Ana Aji, ustadhuka l-iftiradi.)\n\nBienvenue ! Je suis Aji, ton professeur d'**arabe littéraire (MSA)**. Que veux-tu apprendre aujourd'hui ?",
  BOTH:   "أهلاً / مَرْحَباً!\n\nBienvenue ! Je suis Aji, ton professeur de **Darija + Arabe Littéraire**. Je t'enseignerai les deux en parallèle. Par quoi veux-tu commencer ?",
};

export default function ConversationPage() {
  const { langTrack } = useUser();

  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      role: "assistant",
      content: WELCOME[langTrack] ?? WELCOME.DARIJA,
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [mounted, setMounted] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  const { speak } = useAudio();

  // ASR — résultat injecté dans le champ texte
  const { state: asrState, start: startASRBase, stop: stopASR, supported: asrSupported } = useASR();
  const startASR = useCallback(() => {
    startASRBase((text) => setInput((prev) => prev ? `${prev} ${text}` : text));
  }, [startASRBase]);

  // Évite la désynchronisation hydration SSR/client pour les features browser-only
  useEffect(() => { setMounted(true); }, []);

  // Auto-scroll
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const send = useCallback(async (text: string) => {
    const trimmed = text.trim();
    if (!trimmed || loading) return;

    setInput("");
    setError("");

    const userMsg: Message = { id: `u-${Date.now()}`, role: "user", content: trimmed };
    const pendingMsg: Message = { id: `p-${Date.now()}`, role: "assistant", content: "", pending: true };

    setMessages((prev) => [...prev, userMsg, pendingMsg]);
    setLoading(true);

    // Construire l'historique (sans le message pending)
    const history = [...messages, userMsg].map((m) => ({
      role: m.role,
      content: m.content,
    }));

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: history,
          track: langTrack,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error ?? `Erreur ${res.status}`);
      }

      const reply = data.text ?? "...";

      setMessages((prev) =>
        prev.map((m) => (m.pending ? { ...m, content: reply, pending: false } : m))
      );
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Erreur inconnue";
      setError(msg);
      setMessages((prev) => prev.filter((m) => !m.pending));
    } finally {
      setLoading(false);
    }
  }, [messages, loading]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      send(input);
    }
  };

  const suggestions = [
    "Apprends-moi à saluer",
    "Comment dire merci ?",
    "Les chiffres en Darija",
    "Comment me présenter ?",
  ];

  return (
    <div style={{
      display: "flex", flexDirection: "column",
      height: "calc(100vh - 40px)",
      maxWidth: 720, margin: "0 auto",
      padding: "20px 16px 0",
    }}>
      {/* Header */}
      <div style={{
        display: "flex", alignItems: "center", gap: 12,
        marginBottom: 20, paddingBottom: 16,
        borderBottom: "1px solid var(--c-border)",
      }}>
        <div style={{
          width: 44, height: 44, borderRadius: "50%",
          background: "linear-gradient(135deg, #58cc02, #46a302)",
          display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: 22, flexShrink: 0,
        }}>
          🤖
        </div>
        <div>
          <div style={{ fontWeight: 800, fontSize: 16, color: "var(--c-text)" }}>
            Aji — Professeur virtuel
          </div>
          <div style={{ fontSize: 12, color: "var(--c-sub)" }}>
            Darija marocaine • Propulsé par Claude AI
          </div>
        </div>
        <div style={{
          marginLeft: "auto",
          width: 8, height: 8, borderRadius: "50%",
          background: "#58cc02",
          boxShadow: "0 0 6px #58cc02",
        }} />
      </div>

      {/* Messages */}
      <div style={{
        flex: 1, overflowY: "auto",
        paddingRight: 4,
        display: "flex", flexDirection: "column",
      }}>
        {messages.map((msg) => (
          <Bubble key={msg.id} msg={msg} onSpeak={speak} />
        ))}

        {/* Suggestions (si conversation vide) */}
        {messages.length === 1 && (
          <div style={{ marginTop: 8, marginBottom: 16 }}>
            <p style={{ fontSize: 12, color: "var(--c-sub)", marginBottom: 8 }}>
              Suggestions :
            </p>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
              {suggestions.map((s) => (
                <button
                  key={s}
                  onClick={() => send(s)}
                  style={{
                    padding: "6px 12px",
                    borderRadius: 20,
                    border: "1px solid var(--c-border)",
                    background: "var(--c-card)",
                    color: "var(--c-text)",
                    fontSize: 13,
                    cursor: "pointer",
                    transition: "background 0.15s",
                  }}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
        )}

        {error && (
          <div style={{
            padding: "10px 14px", borderRadius: 10,
            background: "rgba(255,75,75,0.1)",
            border: "1px solid rgba(255,75,75,0.3)",
            color: "#ff4b4b", fontSize: 13, marginBottom: 12,
          }}>
            ⚠️ {error}
          </div>
        )}

        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div style={{
        padding: "12px 0 16px",
        borderTop: "1px solid var(--c-border)",
      }}>
        {/* ASR transcript preview */}
        {asrState === "listening" && (
          <div style={{
            fontSize: 12, color: "#58cc02",
            marginBottom: 8, display: "flex", alignItems: "center", gap: 6,
          }}>
            <span style={{
              width: 8, height: 8, borderRadius: "50%",
              background: "#ff4b4b",
              animation: "bounce 1s infinite",
              display: "inline-block",
            }} />
            Écoute en cours… (Darija / arabe)
          </div>
        )}

        <div style={{ display: "flex", gap: 8, alignItems: "flex-end" }}>
          {/* Textarea */}
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Écris en français, arabe ou Darija… (Entrée pour envoyer)"
            rows={2}
            style={{
              flex: 1,
              padding: "10px 14px",
              borderRadius: 14,
              border: "1.5px solid var(--c-border)",
              background: "var(--c-card)",
              color: "var(--c-text)",
              fontSize: 14,
              resize: "none",
              outline: "none",
              fontFamily: "inherit",
              lineHeight: 1.5,
              transition: "border-color 0.15s",
            }}
            onFocus={(e) => (e.target.style.borderColor = "#58cc02")}
            onBlur={(e) => (e.target.style.borderColor = "var(--c-border)")}
            disabled={loading}
          />

          {/* Bouton micro (ASR) — rendu uniquement côté client pour éviter l'hydration mismatch */}
          {mounted && asrSupported && (
            <button
              onClick={asrState === "listening" ? stopASR : startASR}
              title={asrState === "listening" ? "Arrêter" : "Dicter en Darija"}
              style={{
                width: 44, height: 44,
                borderRadius: 12,
                border: "1.5px solid var(--c-border)",
                background: asrState === "listening" ? "#ff4b4b" : "var(--c-card)",
                color: asrState === "listening" ? "white" : "var(--c-sub)",
                fontSize: 20,
                cursor: "pointer",
                display: "flex", alignItems: "center", justifyContent: "center",
                flexShrink: 0,
                transition: "background 0.15s, color 0.15s",
              }}
            >
              🎙️
            </button>
          )}

          {/* Bouton envoyer */}
          <button
            onClick={() => send(input)}
            disabled={loading || !input.trim()}
            style={{
              width: 44, height: 44,
              borderRadius: 12,
              border: "none",
              background: loading || !input.trim() ? "var(--c-card2)" : "#58cc02",
              color: loading || !input.trim() ? "var(--c-sub)" : "white",
              fontSize: 20,
              cursor: loading || !input.trim() ? "not-allowed" : "pointer",
              display: "flex", alignItems: "center", justifyContent: "center",
              flexShrink: 0,
              transition: "background 0.15s",
              fontWeight: 900,
            }}
          >
            {loading ? "⏳" : "➤"}
          </button>
        </div>

        <p style={{ fontSize: 11, color: "var(--c-sub)", marginTop: 6, textAlign: "center" }}>
          20 messages/heure • Réponses en Darija + translittération + français
        </p>
      </div>

      {/* CSS animations */}
      <style>{`
        @keyframes bounce {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-4px); }
        }
      `}</style>
    </div>
  );
}
