'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useUser } from '@/context/UserContext';
import { useMascot, type MascotId } from '@/contexts/MascotContext';

/* ─── Colors ──────────────────────────────────────────────────────────────── */
const CARD   = '#1e2d36';
const CARD2  = '#243b4a';
const BORDER = 'rgba(255,255,255,0.07)';
const TEXT   = '#ffffff';
const SUB    = '#8b9eb0';
const GREEN  = '#58cc02';

/* ─── Settings stored in localStorage ────────────────────────────────────── */
const STORAGE_KEY = 'darija_settings';

interface Settings {
  soundEffects:    boolean;
  animations:      boolean;
  encouragement:   boolean;
  listeningExercises: boolean;
  theme:           'default' | 'light' | 'dark';
}

const DEFAULT_SETTINGS: Settings = {
  soundEffects: true, animations: true, encouragement: true,
  listeningExercises: true, theme: 'default',
};

function loadSettings(): Settings {
  if (typeof window === 'undefined') return DEFAULT_SETTINGS;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? { ...DEFAULT_SETTINGS, ...JSON.parse(raw) } : DEFAULT_SETTINGS;
  } catch { return DEFAULT_SETTINGS; }
}

function saveSettings(s: Settings) {
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(s)); } catch {}
}

/* ─── Toggle ─────────────────────────────────────────────────────────────── */
function Toggle({ value, onChange }: { value: boolean; onChange: (v: boolean) => void }) {
  return (
    <button
      role="switch" aria-checked={value}
      onClick={() => onChange(!value)}
      style={{
        width: 50, height: 28, borderRadius: 99, border: 'none', cursor: 'pointer',
        background: value ? GREEN : CARD2,
        position: 'relative', transition: 'background 0.2s', flexShrink: 0, padding: 3,
        boxShadow: value ? '0 0 0 1px rgba(88,204,2,0.4)' : `0 0 0 1px ${BORDER}`,
      }}
    >
      <div style={{
        width: 22, height: 22, borderRadius: '50%', background: 'white',
        boxShadow: '0 2px 4px rgba(0,0,0,0.3)',
        transform: value ? 'translateX(22px)' : 'translateX(0)',
        transition: 'transform 0.2s cubic-bezier(.4,0,.2,1)',
      }} />
    </button>
  );
}

/* ─── Section wrapper ─────────────────────────────────────────────────────── */
function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div style={{ marginBottom: 8 }}>
      <h2 style={{ fontSize: 13, fontWeight: 900, color: SUB, marginBottom: 10, marginTop: 24, textTransform: 'uppercase' as const, letterSpacing: '0.08em' }}>
        {title}
      </h2>
      <div style={{
        background: CARD, borderRadius: 20,
        border: `1px solid ${BORDER}`, overflow: 'hidden',
      }}>
        {children}
      </div>
    </div>
  );
}

/* ─── Toggle row ─────────────────────────────────────────────────────────── */
function ToggleRow({ label, sub, value, onChange, last = false }: {
  label: string; sub?: string; value: boolean; onChange: (v: boolean) => void; last?: boolean;
}) {
  return (
    <div style={{
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      padding: '16px 20px',
      borderBottom: last ? 'none' : `1px solid ${BORDER}`,
    }}>
      <div style={{ flex: 1, minWidth: 0, marginRight: 16 }}>
        <div style={{ fontSize: 15, fontWeight: 700, color: TEXT }}>{label}</div>
        {sub && <div style={{ fontSize: 12, color: SUB, marginTop: 2 }}>{sub}</div>}
      </div>
      <Toggle value={value} onChange={onChange} />
    </div>
  );
}

/* ─── Link row ─────────────────────────────────────────────────────────────── */
function LinkRow({ label, icon, href, last = false, danger = false }: {
  label: string; icon: string; href?: string; last?: boolean; danger?: boolean;
}) {
  const style: React.CSSProperties = {
    display: 'flex', alignItems: 'center', gap: 14,
    padding: '15px 20px',
    borderBottom: last ? 'none' : `1px solid ${BORDER}`,
    textDecoration: 'none', cursor: 'pointer',
  };

  const content = (
    <>
      <div style={{
        width: 38, height: 38, borderRadius: 10,
        background: danger ? 'rgba(255,75,75,0.12)' : CARD2,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontSize: 18, flexShrink: 0,
        border: `1px solid ${danger ? 'rgba(255,75,75,0.2)' : BORDER}`,
      }}>
        {icon}
      </div>
      <span style={{ fontSize: 15, fontWeight: 700, color: danger ? '#ff4b4b' : TEXT, flex: 1 }}>
        {label}
      </span>
      {!danger && <span style={{ color: 'rgba(255,255,255,0.2)', fontSize: 14 }}>›</span>}
    </>
  );

  if (href) return <Link href={href} style={style}>{content}</Link>;
  return <div style={style}>{content}</div>;
}

/* ─── Page ─────────────────────────────────────────────────────────────────── */
const MASCOT_OPTIONS: { id: MascotId; emoji: string; name: string; desc: string }[] = [
  { id: 'lion', emoji: '🦁', name: 'Simba',   desc: 'Le lion marocain'  },
  { id: 'girl', emoji: '👧', name: 'Nadia',   desc: 'La guide locale'   },
  { id: 'boy',  emoji: '👦', name: 'Yassine', desc: "L'élève curieux"   },
  { id: 'bird', emoji: '🦉', name: 'Duo',     desc: 'Le sage hibou'     },
];

export default function SettingsPage() {
  const { logout } = useUser();
  const { mascot, setMascot } = useMascot();
  const router = useRouter();
  const [settings, setSettings] = useState<Settings>(DEFAULT_SETTINGS);

  useEffect(() => { setSettings(loadSettings()); }, []);

  const update = <K extends keyof Settings>(key: K, value: Settings[K]) => {
    const next = { ...settings, [key]: value };
    setSettings(next);
    saveSettings(next);
  };

  const handleLogout = () => { logout(); router.push('/'); };

  return (
    <div style={{ maxWidth: 640, margin: '0 auto', padding: '0 16px 80px', color: TEXT }}>

      {/* Header */}
      <div style={{ padding: '32px 0 8px' }}>
        <h1 style={{ fontSize: 28, fontWeight: 900, color: TEXT }}>Paramètres</h1>
      </div>

      {/* Lesson settings */}
      <Section title="Paramètres des leçons">
        <ToggleRow label="Effets sonores" sub="Sons de feedback lors des exercices"
          value={settings.soundEffects} onChange={v => update('soundEffects', v)} />
        <ToggleRow label="Animations" sub="Transitions et célébrations animées"
          value={settings.animations} onChange={v => update('animations', v)} />
        <ToggleRow label="Messages d'encouragement" sub="Afficher des messages motivants"
          value={settings.encouragement} onChange={v => update('encouragement', v)} />
        <ToggleRow label="Exercices de compréhension orale" sub="Inclure des exercices d'écoute"
          value={settings.listeningExercises} onChange={v => update('listeningExercises', v)} last />
      </Section>

      {/* Appearance */}
      <Section title="Apparence">
        <div style={{ padding: '16px 20px' }}>
          <div style={{ fontSize: 15, fontWeight: 700, color: TEXT, marginBottom: 10 }}>
            Thème d'affichage
          </div>
          <select
            value={settings.theme}
            onChange={e => update('theme', e.target.value as Settings['theme'])}
            style={{
              width: '100%', padding: '12px 16px', borderRadius: 12,
              border: `1px solid ${BORDER}`, fontSize: 14, fontWeight: 700,
              color: TEXT, background: CARD2, cursor: 'pointer',
              appearance: 'none',
              backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='%238b9eb0' stroke-width='2'%3E%3Cpath d='M6 9l6 6 6-6'/%3E%3C/svg%3E")`,
              backgroundRepeat: 'no-repeat',
              backgroundPosition: 'right 14px center',
              paddingRight: 40,
            }}
          >
            <option value="default">Par défaut (système)</option>
            <option value="light">Clair</option>
            <option value="dark">Sombre</option>
          </select>
        </div>
      </Section>

      {/* Mascot */}
      <Section title="Mascotte">
        <div style={{ padding: '16px 20px' }}>
          <div style={{ fontSize: 13, color: SUB, marginBottom: 14 }}>
            Choisis ton guide d'apprentissage
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 10 }}>
            {MASCOT_OPTIONS.map(opt => {
              const isSelected = mascot ? mascot.id === opt.id : opt.id === 'lion';
              return (
                <button
                  key={opt.id}
                  onClick={() => setMascot({ id: opt.id, name: opt.name })}
                  style={{
                    padding: '16px 10px', borderRadius: 16,
                    border: `2px solid ${isSelected ? GREEN : BORDER}`,
                    background: isSelected ? 'rgba(88,204,2,0.10)' : CARD2,
                    cursor: 'pointer',
                    display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6,
                    transition: 'all 0.15s',
                    position: 'relative',
                  }}
                >
                  {isSelected && (
                    <div style={{
                      position: 'absolute', top: 7, right: 7,
                      width: 18, height: 18, borderRadius: '50%',
                      background: GREEN,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontSize: 10, color: 'white', fontWeight: 900,
                    }}>✓</div>
                  )}
                  <span style={{ fontSize: 34 }}>{opt.emoji}</span>
                  <div style={{ fontSize: 13, fontWeight: 800, color: isSelected ? GREEN : TEXT }}>
                    {opt.name}
                  </div>
                  <div style={{ fontSize: 11, color: SUB, textAlign: 'center', lineHeight: 1.3 }}>
                    {opt.desc}
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </Section>

      {/* Account */}
      <Section title="Compte">
        <LinkRow icon="👤" label="Mon profil"  href="/profile" />
        <LinkRow icon="👥" label="Mes amis"    href="/friends" />
        <LinkRow icon="🏆" label="Classement"  href="/leaderboard" last />
      </Section>

      {/* Subscription */}
      <Section title="Abonnement">
        <div style={{ padding: '16px 20px', borderBottom: `1px solid ${BORDER}` }}>
          <div style={{
            display: 'flex', alignItems: 'center', gap: 12,
            padding: '10px 14px', borderRadius: 14,
            background: 'linear-gradient(135deg, rgba(245,158,11,0.15), rgba(251,191,36,0.08))',
            border: '1px solid rgba(245,158,11,0.3)',
            marginBottom: 10,
          }}>
            <span style={{ fontSize: 22 }}>⭐</span>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 14, fontWeight: 900, color: '#f59e0b' }}>Super Darija Maroc</div>
              <div style={{ fontSize: 11, color: SUB, marginTop: 1 }}>Cœurs illimités, zéro pub, tous les modules</div>
            </div>
          </div>
        </div>
        <LinkRow icon="⭐" label="Choisis un abonnement" href="/abonnement" last />
      </Section>

      {/* Help */}
      <Section title="Assistance">
        <LinkRow icon="❓" label="Centre d'aide"  href="/aide" />
        <LinkRow icon="📧" label="Nous contacter" href="/aide" last />
      </Section>

      {/* Logout */}
      <div style={{ marginTop: 24 }}>
        <button
          onClick={handleLogout}
          style={{
            width: '100%', padding: '16px', borderRadius: 18,
            border: '1px solid rgba(255,75,75,0.3)', background: 'rgba(255,75,75,0.1)',
            color: '#ff4b4b', fontSize: 15, fontWeight: 900, cursor: 'pointer',
            letterSpacing: '0.04em', transition: 'background 0.15s',
          }}
        >
          SE DÉCONNECTER
        </button>
      </div>

      {/* Version */}
      <div style={{ textAlign: 'center', marginTop: 20, fontSize: 11, color: 'rgba(255,255,255,0.15)', fontWeight: 600 }}>
        Darija Maroc · v1.0.0
      </div>
    </div>
  );
}
