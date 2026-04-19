"use client";

import React, { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";

interface Config {
  AI_PROVIDER: string;
  OPENAI_API_KEY: string; OPENAI_MODEL: string;
  GROQ_API_KEY: string;   GROQ_MODEL: string;
  AZURE_SPEECH_KEY: string; AZURE_SPEECH_REGION: string; AZURE_SPEECH_VOICE: string;
}

// ── Mots de test Darija avec arabe vocalisé ───────────────────────────────────
const TTS_SAMPLES = [
  // Salutations
  { fr: "Bonjour / Ça va",     ph: "labas",              ar: "لاَبَاسْ" },
  { fr: "Bonjour (réponse)",   ph: "labas, alhamdullah", ar: "لاَبَاسْ، اَلْحَمْدُ لِلَّهْ" },
  { fr: "Merci",               ph: "choukran",            ar: "شُكْرَاً" },
  { fr: "Merci beaucoup",      ph: "barakallaoufik",      ar: "بَارَكَ اللَّهُ فِيكْ" },
  { fr: "S'il te plaît",       ph: "3afak",               ar: "عَافَاكْ" },
  { fr: "Oui",                 ph: "ih / ayeh",           ar: "إِيهْ" },
  { fr: "Non",                 ph: "la / machi",          ar: "لاَ / مَاشِي" },
  { fr: "D'accord / Ok",       ph: "wakha",               ar: "وَاخَّا" },
  // Expressions courantes
  { fr: "Maintenant",          ph: "daba",                ar: "دَابَا" },
  { fr: "Beaucoup",            ph: "bzaf",                ar: "بْزَافْ" },
  { fr: "Je veux",             ph: "bghit",               ar: "بْغِيتْ" },
  { fr: "Je veux manger",      ph: "bghit nakoul",        ar: "بْغِيتْ نَاكُولْ" },
  { fr: "Je veux boire",       ph: "bghit nchrab",        ar: "بْغِيتْ نَشْرَبْ" },
  { fr: "Comment tu t'appelles", ph: "chno smitk",        ar: "شْنُو سْمِيتَكْ" },
  { fr: "Mon prénom est...",   ph: "smiti ...",           ar: "سْمِيتِي ..." },
  { fr: "Comment tu vas ?",    ph: "kif dayr ?",          ar: "كِيفْ دَايَرْ ؟" },
  { fr: "Où est... ?",         ph: "fin kayn... ?",       ar: "فِينْ كَايَنْ ؟" },
  { fr: "Combien ça coûte ?",  ph: "bchhal hada ?",       ar: "بْشْحَالْ هَادَا ؟" },
  // Famille
  { fr: "Père",                ph: "bba / wlidi",         ar: "بَّا / وَلِيدِي" },
  { fr: "Mère",                ph: "mma / wlidati",       ar: "مَّا / وَلِيدَاتِي" },
  // Phrases longues
  { fr: "Je ne comprends pas", ph: "ma fhamtch",          ar: "مَا فْهَمْتْشْ" },
  { fr: "Parle lentement",     ph: "hdar bchwiya",        ar: "هْدَرْ بْشْوِيَّا" },
];

function TTSTest() {
  const [playing, setPlaying] = React.useState<string | null>(null);
  const [custom, setCustom] = React.useState("");
  const [voice, setVoice] = React.useState<"ar" | "fr">("ar");

  async function play(text: string, id: string) {
    setPlaying(id);
    try {
      const r = await fetch(`/api/tts?text=${encodeURIComponent(text)}`);
      if (!r.ok) { alert("TTS erreur: " + r.status); return; }
      const url = URL.createObjectURL(await r.blob());
      const a = new Audio(url);
      a.onended = () => setPlaying(null);
      await a.play();
    } catch (e: any) {
      alert(e.message);
      setPlaying(null);
    }
  }

  return (
    <div>
      {/* Sélecteur voix / texte personnalisé */}
      <div style={{ display: "flex", gap: 8, marginBottom: 14, flexWrap: "wrap" }}>
        <button onClick={() => setVoice("ar")} style={{
          padding: "6px 14px", borderRadius: 8, cursor: "pointer", fontSize: 12, fontWeight: 700,
          border: "1.5px solid", borderColor: voice === "ar" ? "#58cc02" : "var(--c-border)",
          background: voice === "ar" ? "rgba(88,204,2,0.1)" : "var(--c-bg)", color: voice === "ar" ? "#46a302" : "var(--c-sub)",
        }}>🇲🇦 Arabe vocalisé (ar-MA)</button>
        <button onClick={() => setVoice("fr")} style={{
          padding: "6px 14px", borderRadius: 8, cursor: "pointer", fontSize: 12, fontWeight: 700,
          border: "1.5px solid", borderColor: voice === "fr" ? "#1cb0f6" : "var(--c-border)",
          background: voice === "fr" ? "rgba(28,176,246,0.1)" : "var(--c-bg)", color: voice === "fr" ? "#1cb0f6" : "var(--c-sub)",
        }}>🔤 Phonétique (texte libre)</button>
        <div style={{ display: "flex", gap: 6, flex: 1, minWidth: 200 }}>
          <input value={custom} onChange={e => setCustom(e.target.value)}
            placeholder={voice === "ar" ? "Texte arabe..." : "bghit nakoul..."}
            style={{ flex: 1, padding: "6px 10px", borderRadius: 8, border: "1px solid var(--c-border)", background: "var(--c-bg)", color: "var(--c-text)", fontSize: 13, outline: "none" }} />
          <button onClick={() => custom.trim() && play(custom.trim(), "custom")} disabled={!custom.trim()} style={{
            padding: "6px 12px", borderRadius: 8, border: "none",
            background: "#58cc02", color: "white", fontWeight: 700, cursor: "pointer", fontSize: 13,
          }}>▶</button>
        </div>
      </div>

      {/* Grille de mots */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))", gap: 8 }}>
        {TTS_SAMPLES.map((s, i) => {
          const id = `s-${i}`;
          const textToPlay = voice === "ar" ? s.ar : s.ph;
          const isPlaying = playing === id;
          return (
            <div key={id} style={{
              display: "flex", alignItems: "center", gap: 8,
              padding: "10px 12px", borderRadius: 10,
              background: isPlaying ? "rgba(88,204,2,0.08)" : "var(--c-card)",
              border: `1px solid ${isPlaying ? "#58cc02" : "var(--c-border)"}`,
              transition: "all 0.15s",
            }}>
              <button onClick={() => play(textToPlay, id)} style={{
                width: 32, height: 32, borderRadius: "50%", border: "none", flexShrink: 0,
                background: isPlaying ? "#58cc02" : "var(--c-card2)",
                color: isPlaying ? "white" : "var(--c-sub)",
                cursor: "pointer", fontSize: 14, display: "flex", alignItems: "center", justifyContent: "center",
              }}>
                {isPlaying ? "⏸" : "▶"}
              </button>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 13, fontWeight: 700, color: "#58cc02" }}>{s.ph}</div>
                {voice === "ar" && (
                  <div style={{ fontSize: 13, fontFamily: "var(--font-amiri), serif", direction: "rtl", color: "var(--c-sub)" }}>{s.ar}</div>
                )}
                <div style={{ fontSize: 11, color: "var(--c-sub)" }}>{s.fr}</div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

const DEFAULT: Config = {
  AI_PROVIDER: "groq",
  OPENAI_API_KEY: "", OPENAI_MODEL: "gpt-4o-mini",
  GROQ_API_KEY:   "", GROQ_MODEL:   "llama-3.3-70b-versatile",
  AZURE_SPEECH_KEY: "", AZURE_SPEECH_REGION: "francecentral", AZURE_SPEECH_VOICE: "ar-MA-JamalNeural",
};

function Badge({ ok, label }: { ok: boolean; label: string }) {
  return (
    <span style={{
      display: "inline-flex", alignItems: "center", gap: 5, padding: "3px 10px",
      borderRadius: 20, fontSize: 12, fontWeight: 700,
      background: ok ? "rgba(88,204,2,0.12)" : "rgba(255,75,75,0.12)",
      color: ok ? "#46a302" : "#ff4b4b",
      border: `1px solid ${ok ? "rgba(88,204,2,0.3)" : "rgba(255,75,75,0.3)"}`,
    }}>
      <span style={{ width: 6, height: 6, borderRadius: "50%", background: ok ? "#58cc02" : "#ff4b4b" }} />
      {label}
    </span>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div style={{ marginBottom: 28 }}>
      <h2 style={{ fontSize: 11, fontWeight: 800, letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--c-sub)", marginBottom: 10, paddingBottom: 8, borderBottom: "1px solid var(--c-border)" }}>{title}</h2>
      {children}
    </div>
  );
}

const inp: React.CSSProperties = {
  width: "100%", padding: "8px 12px", borderRadius: 8,
  border: "1.5px solid var(--c-border)", background: "var(--c-bg)",
  color: "var(--c-text)", fontSize: 13, outline: "none", boxSizing: "border-box", fontFamily: "monospace",
};
const sel: React.CSSProperties = { ...inp, fontFamily: "inherit" };

export default function AdminPage() {
  const router = useRouter();
  const [cfg, setCfg] = useState<Config>(DEFAULT);
  const [health, setHealth] = useState<any>(null);
  const [chatStatus, setChatStatus] = useState<any>(null);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState<{ ok: boolean; text: string } | null>(null);
  const [testIn, setTestIn] = useState("");
  const [testOut, setTestOut] = useState<any>(null);
  const [testing, setTesting] = useState(false);
  const [audioCount, setAudioCount] = useState<number | null>(null);

  const API = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3001";

  const load = useCallback(async () => {
    const [h, cs, c] = await Promise.allSettled([
      fetch(`${API}/health`).then(r => r.json()),
      fetch("/api/chat").then(r => r.json()),
      fetch("/api/admin/config", { credentials: "include" }).then(r => r.json()),
    ]);
    if (h.status === "fulfilled") setHealth(h.value);
    if (cs.status === "fulfilled") setChatStatus(cs.value);
    if (c.status === "fulfilled" && c.value?.config) setCfg(prev => ({ ...prev, ...c.value.config }));
    fetch(`${API}/health`).then(r => r.ok ? r.json() : null).then(d => {
      if (d?.audioCount != null) setAudioCount(d.audioCount);
    }).catch(() => {});
  }, [API]);

  useEffect(() => { load(); }, [load]);

  async function save() {
    setSaving(true); setMsg(null);
    try {
      const r = await fetch("/api/admin/config", { method: "POST", headers: { "Content-Type": "application/json" }, credentials: "include", body: JSON.stringify(cfg) });
      const d = await r.json();
      setMsg(r.ok ? { ok: true, text: "Sauvegardé ✓ Effectif immédiatement" } : { ok: false, text: d.error });
      if (r.ok) load();
    } catch (e: any) { setMsg({ ok: false, text: e.message }); }
    setSaving(false);
    setTimeout(() => setMsg(null), 4000);
  }

  async function test() {
    if (!testIn.trim()) return;
    setTesting(true); setTestOut(null);
    try {
      const r = await fetch("/api/chat", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ messages: [{ role: "user", content: testIn }] }) });
      setTestOut(await r.json());
    } catch (e: any) { setTestOut({ error: e.message }); }
    setTesting(false);
  }

  async function testTTS() {
    const r = await fetch("/api/tts?text=مرحبا، كيف داير؟");
    if (r.ok) {
      const url = URL.createObjectURL(await r.blob());
      new Audio(url).play();
    } else {
      const d = await r.json();
      alert("TTS Error: " + (d.error ?? r.status));
    }
  }

  return (
    <div style={{ maxWidth: 800, margin: "0 auto", padding: "24px 20px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 28 }}>
        <div>
          <h1 style={{ fontSize: 22, fontWeight: 900, color: "var(--c-text)", margin: 0 }}>🛠️ Administration</h1>
          <p style={{ fontSize: 12, color: "var(--c-sub)", marginTop: 2 }}>AjiTahdar Darija</p>
        </div>
        <button onClick={async () => { await fetch("/api/admin/login", { method: "DELETE" }); router.push("/admin/login"); }}
          style={{ padding: "7px 14px", borderRadius: 10, border: "1px solid var(--c-border)", background: "var(--c-card)", color: "var(--c-sub)", fontSize: 13, cursor: "pointer" }}>
          Déconnexion
        </button>
      </div>

      {/* Raccourcis */}
      <Section title="Contenu pédagogique">
        <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
          <a href="/admin/tracks" style={{
            padding: "10px 16px", borderRadius: 10, textDecoration: "none",
            background: "#1cb0f6", color: "white", fontWeight: 800, fontSize: 13,
            display: "inline-flex", alignItems: "center", gap: 6,
          }}>🗂️ Parcours (tracks)</a>
          <a href="/admin/contenu" style={{
            padding: "10px 16px", borderRadius: 10, textDecoration: "none",
            background: "#58cc02", color: "white", fontWeight: 800, fontSize: 13,
            display: "inline-flex", alignItems: "center", gap: 6,
          }}>🧩 Sections · Cours · Items</a>
          <a href="/admin/lessons" style={{
            padding: "10px 16px", borderRadius: 10, textDecoration: "none",
            background: "var(--c-card)", color: "var(--c-text)", fontWeight: 700, fontSize: 13,
            border: "1px solid var(--c-border)",
            display: "inline-flex", alignItems: "center", gap: 6,
          }}>📚 Leçons (ancienne vue)</a>
        </div>
      </Section>

      {/* Statuts */}
      <Section title="Services">
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
          <Badge ok={health?.status === "ok"}      label={`Backend ${health?.status === "ok" ? "actif" : "hors ligne"}`} />
          <Badge ok={health?.db === "connected"}   label={`DB ${health?.db ?? "?"}`} />
          <Badge ok={chatStatus?.openai?.configured} label={`OpenAI ${chatStatus?.openai?.configured ? "OK" : "—"}`} />
          <Badge ok={chatStatus?.groq?.configured}   label={`Groq ${chatStatus?.groq?.configured ? "OK" : "—"}`} />
          <Badge ok={!!cfg.AZURE_SPEECH_KEY && !cfg.AZURE_SPEECH_KEY.includes("••")} label={`Azure TTS`} />
        </div>
        {health && (
          <p style={{ fontSize: 12, color: "var(--c-sub)", margin: "8px 0 0" }}>
            Uptime: <strong>{Math.floor(health.uptime / 60)}m</strong> · Provider: <strong>{chatStatus?.provider ?? "—"}</strong>
            {audioCount != null && <> · Audio: <strong>{audioCount}/366</strong></>}
          </p>
        )}
      </Section>

      {/* Chatbot */}
      <Section title="Chatbot IA">
        <div style={{ background: "var(--c-card)", border: "1px solid var(--c-border)", borderRadius: 14, padding: "18px 20px" }}>
          <div style={{ marginBottom: 16 }}>
            <label style={{ fontSize: 12, fontWeight: 700, color: "var(--c-sub)", display: "block", marginBottom: 6 }}>PROVIDER ACTIF</label>
            <div style={{ display: "flex", gap: 8 }}>
              {["openai", "groq"].map(p => (
                <button key={p} onClick={() => setCfg(c => ({ ...c, AI_PROVIDER: p }))} style={{
                  padding: "8px 18px", borderRadius: 10, cursor: "pointer", fontWeight: 700, fontSize: 13,
                  border: "1.5px solid", borderColor: cfg.AI_PROVIDER === p ? "#58cc02" : "var(--c-border)",
                  background: cfg.AI_PROVIDER === p ? "rgba(88,204,2,0.12)" : "var(--c-bg)",
                  color: cfg.AI_PROVIDER === p ? "#46a302" : "var(--c-sub)",
                }}>
                  {p === "openai" ? "⭐ OpenAI (recommandé)" : "🆓 Groq (gratuit)"}
                </button>
              ))}
            </div>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
            <div>
              <label style={{ fontSize: 11, fontWeight: 700, color: "var(--c-sub)", display: "block", marginBottom: 4 }}>OPENAI API KEY</label>
              <input type="password" value={cfg.OPENAI_API_KEY} onChange={e => setCfg(c => ({ ...c, OPENAI_API_KEY: e.target.value }))} placeholder="sk-..." style={inp} />
              <p style={{ fontSize: 10, color: "var(--c-sub)", margin: "3px 0 0" }}>platform.openai.com</p>
            </div>
            <div>
              <label style={{ fontSize: 11, fontWeight: 700, color: "var(--c-sub)", display: "block", marginBottom: 4 }}>MODÈLE OPENAI</label>
              <select value={cfg.OPENAI_MODEL} onChange={e => setCfg(c => ({ ...c, OPENAI_MODEL: e.target.value }))} style={sel}>
                <option value="gpt-4o-mini">gpt-4o-mini (recommandé)</option>
                <option value="gpt-4o">gpt-4o (meilleur, plus cher)</option>
                <option value="gpt-3.5-turbo">gpt-3.5-turbo (moins cher)</option>
              </select>
            </div>
            <div>
              <label style={{ fontSize: 11, fontWeight: 700, color: "var(--c-sub)", display: "block", marginBottom: 4 }}>GROQ API KEY</label>
              <input type="password" value={cfg.GROQ_API_KEY} onChange={e => setCfg(c => ({ ...c, GROQ_API_KEY: e.target.value }))} placeholder="gsk_..." style={inp} />
              <p style={{ fontSize: 10, color: "var(--c-sub)", margin: "3px 0 0" }}>console.groq.com — gratuit</p>
            </div>
            <div>
              <label style={{ fontSize: 11, fontWeight: 700, color: "var(--c-sub)", display: "block", marginBottom: 4 }}>MODÈLE GROQ</label>
              <select value={cfg.GROQ_MODEL} onChange={e => setCfg(c => ({ ...c, GROQ_MODEL: e.target.value }))} style={sel}>
                <option value="llama-3.3-70b-versatile">llama-3.3-70b-versatile</option>
                <option value="llama-3.1-8b-instant">llama-3.1-8b-instant</option>
                <option value="mixtral-8x7b-32768">mixtral-8x7b</option>
              </select>
            </div>
          </div>
        </div>
      </Section>

      {/* Azure TTS */}
      <Section title="Voix (Azure TTS — Darija Marocain)">
        <div style={{ background: "var(--c-card)", border: "1px solid var(--c-border)", borderRadius: 14, padding: "18px 20px" }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 14, marginBottom: 12 }}>
            <div>
              <label style={{ fontSize: 11, fontWeight: 700, color: "var(--c-sub)", display: "block", marginBottom: 4 }}>AZURE SPEECH KEY</label>
              <input type="password" value={cfg.AZURE_SPEECH_KEY} onChange={e => setCfg(c => ({ ...c, AZURE_SPEECH_KEY: e.target.value }))} placeholder="Clé Azure..." style={inp} />
              <p style={{ fontSize: 10, color: "var(--c-sub)", margin: "3px 0 0" }}>portal.azure.com → Speech</p>
            </div>
            <div>
              <label style={{ fontSize: 11, fontWeight: 700, color: "var(--c-sub)", display: "block", marginBottom: 4 }}>RÉGION</label>
              <select value={cfg.AZURE_SPEECH_REGION} onChange={e => setCfg(c => ({ ...c, AZURE_SPEECH_REGION: e.target.value }))} style={sel}>
                <option value="francecentral">France Central</option>
                <option value="westeurope">West Europe</option>
                <option value="eastus">East US</option>
                <option value="northeurope">North Europe</option>
              </select>
            </div>
            <div>
              <label style={{ fontSize: 11, fontWeight: 700, color: "var(--c-sub)", display: "block", marginBottom: 4 }}>VOIX</label>
              <select value={cfg.AZURE_SPEECH_VOICE} onChange={e => setCfg(c => ({ ...c, AZURE_SPEECH_VOICE: e.target.value }))} style={sel}>
                <option value="ar-MA-JamalNeural">ar-MA-JamalNeural (homme) ⭐</option>
                <option value="ar-MA-MounaNeural">ar-MA-MounaNeural (femme)</option>
              </select>
            </div>
          </div>
          <button onClick={testTTS} style={{
            padding: "7px 14px", borderRadius: 8, border: "1px solid var(--c-border)",
            background: "var(--c-bg)", color: "var(--c-text)", fontSize: 12, cursor: "pointer",
          }}>
            🔊 Tester la voix
          </button>
          <p style={{ fontSize: 10, color: "var(--c-sub)", marginTop: 6 }}>
            Gratuit jusqu'à 500 000 caractères/mois · portal.azure.com → "Create resource" → "Speech"
          </p>
        </div>
      </Section>

      {/* Save */}
      <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 28 }}>
        <button onClick={save} disabled={saving} style={{
          padding: "11px 28px", borderRadius: 10, border: "none",
          background: saving ? "var(--c-card2)" : "#58cc02",
          color: saving ? "var(--c-sub)" : "white",
          fontWeight: 800, fontSize: 14, cursor: saving ? "wait" : "pointer",
        }}>
          {saving ? "⏳ Sauvegarde..." : "💾 Sauvegarder la configuration"}
        </button>
        {msg && <span style={{ fontSize: 13, fontWeight: 600, color: msg.ok ? "#46a302" : "#ff4b4b" }}>{msg.text}</span>}
      </div>

      {/* Test TTS Darija */}
      <Section title="Test voix (Azure ar-MA-JamalNeural)">
        <TTSTest />
      </Section>

      {/* Test chatbot */}
      <Section title="Tester le chatbot">
        <div style={{ display: "flex", gap: 8 }}>
          <input value={testIn} onChange={e => setTestIn(e.target.value)} onKeyDown={e => e.key === "Enter" && test()}
            placeholder='Ex: "Comment dire je veux aller au marché ?"'
            style={{ ...inp, fontFamily: "inherit", flex: 1 }} />
          <button onClick={test} disabled={testing || !testIn.trim()} style={{
            padding: "8px 18px", borderRadius: 8, border: "none",
            background: testing ? "var(--c-card2)" : "#58cc02",
            color: testing ? "var(--c-sub)" : "white",
            fontWeight: 700, cursor: testing ? "wait" : "pointer",
          }}>{testing ? "⏳" : "Tester"}</button>
        </div>
        {testOut && (
          <div style={{
            marginTop: 10, padding: "12px 14px", borderRadius: 10,
            background: testOut.error ? "rgba(255,75,75,0.08)" : "var(--c-card)",
            border: `1px solid ${testOut.error ? "rgba(255,75,75,0.3)" : "var(--c-border)"}`,
            fontSize: 13, color: testOut.error ? "#ff4b4b" : "var(--c-text)", whiteSpace: "pre-wrap",
          }}>
            {testOut.error ? `❌ ${testOut.error}` : `[${testOut.provider}]\n${testOut.text}`}
          </div>
        )}
      </Section>
    </div>
  );
}
