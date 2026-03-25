'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useUser } from '@/context/UserContext';

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
  soundEffects:       true,
  animations:         true,
  encouragement:      true,
  listeningExercises: true,
  theme:              'default',
};

function loadSettings(): Settings {
  if (typeof window === 'undefined') return DEFAULT_SETTINGS;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? { ...DEFAULT_SETTINGS, ...JSON.parse(raw) } : DEFAULT_SETTINGS;
  } catch {
    return DEFAULT_SETTINGS;
  }
}

function saveSettings(s: Settings) {
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(s)); } catch {}
}

/* ─── Toggle component ────────────────────────────────────────────────────── */
function Toggle({ value, onChange }: { value: boolean; onChange: (v: boolean) => void }) {
  return (
    <button
      role="switch"
      aria-checked={value}
      onClick={() => onChange(!value)}
      style={{
        width: 50, height: 28, borderRadius: 99, border: 'none', cursor: 'pointer',
        background: value ? '#1cb0f6' : '#e5e7eb',
        position: 'relative', transition: 'background 0.2s', flexShrink: 0,
        padding: 3,
      }}
    >
      <div style={{
        width: 22, height: 22, borderRadius: '50%', background: 'white',
        boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
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
      <h2 style={{ fontSize: 17, fontWeight: 900, color: '#111827', marginBottom: 14, marginTop: 24 }}>
        {title}
      </h2>
      <div style={{
        background: 'white', borderRadius: 20,
        border: '2px solid #f0f0f0', overflow: 'hidden',
        boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
      }}>
        {children}
      </div>
    </div>
  );
}

/* ─── Row with toggle ─────────────────────────────────────────────────────── */
function ToggleRow({
  label, sub, value, onChange, last = false,
}: {
  label: string; sub?: string; value: boolean; onChange: (v: boolean) => void; last?: boolean;
}) {
  return (
    <div style={{
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      padding: '16px 20px',
      borderBottom: last ? 'none' : '1.5px solid #f3f4f6',
    }}>
      <div style={{ flex: 1, minWidth: 0, marginRight: 16 }}>
        <div style={{ fontSize: 15, fontWeight: 700, color: '#111827' }}>{label}</div>
        {sub && <div style={{ fontSize: 12, color: '#9ca3af', marginTop: 2 }}>{sub}</div>}
      </div>
      <Toggle value={value} onChange={onChange} />
    </div>
  );
}

/* ─── Link row ─────────────────────────────────────────────────────────────── */
function LinkRow({
  label, icon, href, last = false, danger = false,
}: {
  label: string; icon: string; href?: string; last?: boolean; danger?: boolean;
}) {
  const style: React.CSSProperties = {
    display: 'flex', alignItems: 'center', gap: 14,
    padding: '15px 20px',
    borderBottom: last ? 'none' : '1.5px solid #f3f4f6',
    textDecoration: 'none', cursor: 'pointer',
  };

  const content = (
    <>
      <span style={{ fontSize: 20, flexShrink: 0 }}>{icon}</span>
      <span style={{ fontSize: 15, fontWeight: 700, color: danger ? '#dc2626' : '#111827', flex: 1 }}>
        {label}
      </span>
      {!danger && <span style={{ color: '#d1d5db', fontSize: 14 }}>›</span>}
    </>
  );

  if (href) return <Link href={href} style={style}>{content}</Link>;
  return <div style={style}>{content}</div>;
}

/* ─── Page ─────────────────────────────────────────────────────────────────── */
export default function SettingsPage() {
  const { logout } = useUser();
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
    <div style={{ maxWidth: 640, margin: '0 auto', padding: '0 16px 80px' }}>

      {/* Header */}
      <div style={{ padding: '32px 0 8px' }}>
        <h1 style={{ fontSize: 28, fontWeight: 900, color: '#111827' }}>Paramètres</h1>
      </div>

      {/* Lesson settings */}
      <Section title="Paramètres des leçons">
        <ToggleRow
          label="Effets sonores"
          sub="Sons de feedback lors des exercices"
          value={settings.soundEffects}
          onChange={v => update('soundEffects', v)}
        />
        <ToggleRow
          label="Animations"
          sub="Transitions et célébrations animées"
          value={settings.animations}
          onChange={v => update('animations', v)}
        />
        <ToggleRow
          label="Messages d'encouragement"
          sub="Afficher des messages motivants"
          value={settings.encouragement}
          onChange={v => update('encouragement', v)}
        />
        <ToggleRow
          label="Exercices de compréhension orale"
          sub="Inclure des exercices d'écoute"
          value={settings.listeningExercises}
          onChange={v => update('listeningExercises', v)}
          last
        />
      </Section>

      {/* Appearance */}
      <Section title="Apparence">
        <div style={{ padding: '16px 20px' }}>
          <div style={{ fontSize: 15, fontWeight: 700, color: '#111827', marginBottom: 10 }}>
            Mode sombre
          </div>
          <select
            value={settings.theme}
            onChange={e => update('theme', e.target.value as Settings['theme'])}
            style={{
              width: '100%', padding: '12px 16px', borderRadius: 12,
              border: '2px solid #e5e7eb', fontSize: 14, fontWeight: 700,
              color: '#374151', background: '#f9fafb', cursor: 'pointer',
              appearance: 'none',
              backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='%236b7280' stroke-width='2'%3E%3Cpath d='M6 9l6 6 6-6'/%3E%3C/svg%3E")`,
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

      {/* Account */}
      <Section title="Compte">
        <LinkRow icon="👤" label="Mon profil"     href="/profile" />
        <LinkRow icon="👥" label="Mes amis"       href="/friends" />
        <LinkRow icon="🏆" label="Classement"     href="/leaderboard" last />
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
            border: '2px solid #fca5a5', background: '#fef2f2',
            color: '#dc2626', fontSize: 15, fontWeight: 900, cursor: 'pointer',
            letterSpacing: '0.04em',
          }}
        >
          SE DÉCONNECTER
        </button>
      </div>

      {/* Version */}
      <div style={{ textAlign: 'center', marginTop: 20, fontSize: 11, color: '#d1d5db', fontWeight: 600 }}>
        Darija Maroc · v1.0.0
      </div>
    </div>
  );
}
