'use client';

import React, { useEffect, useState } from 'react';
import { useUser } from '@/context/UserContext';
import { useParcours } from '@/hooks/useParcours';

type ConfirmState =
  | { kind: 'none' }
  | { kind: 'full' }
  | { kind: 'module'; id: string; label: string }
  | { kind: 'lesson'; id: string; label: string };

/**
 * Menu flottant (bas-droite) visible uniquement si l'admin est loggé
 * (cookie `admin_session`). Permet de réinitialiser le parcours, un module
 * ou une leçon donnée pour l'user courant. Destiné à la phase de test.
 */
export default function ResetAdminMenu() {
  const { user } = useUser();
  const { unites } = useParcours();
  const [isAdmin, setIsAdmin] = useState(false);
  const [open, setOpen] = useState(false);
  const [busy, setBusy] = useState(false);
  const [confirm, setConfirm] = useState<ConfirmState>({ kind: 'none' });
  const [msg, setMsg] = useState<string | null>(null);

  useEffect(() => {
    fetch('/api/admin/debug/status', { cache: 'no-store' })
      .then((r) => r.json())
      .then((d) => setIsAdmin(!!d?.isAdmin))
      .catch(() => setIsAdmin(false));
  }, []);

  if (!isAdmin || !user?.id) return null;

  const flash = (text: string) => {
    setMsg(text);
    setTimeout(() => setMsg(null), 2600);
  };

  const run = async (url: string, label: string) => {
    if (!user?.id) return;
    setBusy(true);
    try {
      const r = await fetch(url, { method: 'POST' });
      if (!r.ok) throw new Error(await r.text());
      flash(`✓ ${label} réinitialisé`);
      setOpen(false);
      setConfirm({ kind: 'none' });
      // Recharge la page pour refléter immédiatement le reset dans le parcours
      setTimeout(() => window.location.reload(), 600);
    } catch (e: any) {
      flash(`✗ Erreur : ${e?.message ?? 'inconnu'}`);
    } finally {
      setBusy(false);
    }
  };

  const doFull     = () => run(`/api/admin/debug/reset/${user.id}`, 'tout');
  const doModule   = (id: string) => run(`/api/admin/debug/reset/${user.id}/module/${id}`, 'module');
  const doLesson   = (id: string) => run(`/api/admin/debug/reset/${user.id}/lesson/${id}`, 'leçon');

  return (
    <>
      {/* Toast message */}
      {msg && (
        <div style={{
          position: 'fixed', bottom: 86, right: 20, zIndex: 60,
          background: '#1a242b', border: '1px solid #d4a84b55',
          color: '#e4eef3', padding: '10px 14px', borderRadius: 12,
          fontSize: 12, fontWeight: 700, maxWidth: 280,
          boxShadow: '0 4px 18px rgba(0,0,0,0.4)',
        }}>{msg}</div>
      )}

      {/* FAB */}
      <button
        onClick={() => setOpen((v) => !v)}
        title="Reset admin"
        style={{
          position: 'fixed', bottom: 20, right: 20, zIndex: 50,
          width: 48, height: 48, borderRadius: '50%',
          background: '#c1272d', color: 'white',
          border: '2px solid #d4a84b',
          boxShadow: '0 4px 14px rgba(193,39,45,0.5)',
          fontSize: 20, cursor: 'pointer',
        }}
      >🧹</button>

      {/* Panel */}
      {open && (
        <div style={{
          position: 'fixed', bottom: 80, right: 20, zIndex: 50,
          width: 300, background: '#1a242b',
          border: '2px solid #d4a84b55', borderRadius: 16,
          padding: 14, boxShadow: '0 10px 30px rgba(0,0,0,0.5)',
        }}>
          <div style={{
            fontSize: 11, fontWeight: 900, color: '#d4a84b',
            letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: 10,
          }}>Reset admin (test)</div>

          {/* Full */}
          <button
            onClick={() => setConfirm({ kind: 'full' })}
            disabled={busy}
            style={btnStyle('#c1272d')}
          >🧨 Tout réinitialiser (vies, streak, xp, parcours)</button>

          {/* Module picker */}
          <div style={{ marginTop: 10 }}>
            <div style={labelStyle}>Un module</div>
            <select
              onChange={(e) => {
                const u = unites.find((u) => u.id === e.target.value);
                if (u) setConfirm({ kind: 'module', id: u.id, label: u.title });
                e.target.value = '';
              }}
              defaultValue=""
              style={selectStyle}
            >
              <option value="" disabled>Choisir un module…</option>
              {unites.map((u) => (
                <option key={u.id} value={u.id}>{u.title}</option>
              ))}
            </select>
          </div>

          {/* Lesson picker */}
          <div style={{ marginTop: 10 }}>
            <div style={labelStyle}>Une leçon</div>
            <select
              onChange={(e) => {
                for (const u of unites) {
                  const l = u.lecons.find((l) => l.id === e.target.value);
                  if (l) { setConfirm({ kind: 'lesson', id: l.id, label: `${u.title} — ${l.title}` }); break; }
                }
                e.target.value = '';
              }}
              defaultValue=""
              style={selectStyle}
            >
              <option value="" disabled>Choisir une leçon…</option>
              {unites.map((u) => (
                <optgroup key={u.id} label={u.title}>
                  {u.lecons.map((l) => (
                    <option key={l.id} value={l.id}>{l.title}</option>
                  ))}
                </optgroup>
              ))}
            </select>
          </div>
        </div>
      )}

      {/* Confirm modal */}
      {confirm.kind !== 'none' && (
        <div
          role="dialog"
          style={{
            position: 'fixed', inset: 0, zIndex: 70,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            background: 'rgba(0,0,0,0.6)', padding: 16,
          }}
        >
          <div style={{
            background: '#1a242b', border: '2px solid #d4a84b55',
            borderRadius: 18, padding: 20, maxWidth: 360, width: '100%',
            boxShadow: '0 10px 40px rgba(0,0,0,0.6)',
          }}>
            <div style={{
              fontSize: 12, fontWeight: 900, color: '#d4a84b',
              letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: 8,
            }}>Confirmer la réinitialisation</div>

            <div style={{ fontSize: 13, color: '#e4eef3', lineHeight: 1.5, marginBottom: 14 }}>
              {confirm.kind === 'full' && (
                <>Cette action va supprimer <strong>tout le progrès</strong> (parcours, XP, streak, badges, quêtes, vocabulaire appris) et remettre les <strong>vies à 5</strong>. Irréversible.</>
              )}
              {confirm.kind === 'module' && (
                <>Réinitialiser le module <strong>« {confirm.label} »</strong> — toutes les leçons de ce module repasseront en non-complétées.</>
              )}
              {confirm.kind === 'lesson' && (
                <>Réinitialiser la leçon <strong>« {confirm.label} »</strong>.</>
              )}
            </div>

            <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end' }}>
              <button
                onClick={() => setConfirm({ kind: 'none' })}
                disabled={busy}
                style={{
                  padding: '10px 16px', borderRadius: 12,
                  background: 'transparent', color: '#e4eef3',
                  border: '2px solid #2a3d47', fontWeight: 800,
                  fontSize: 12, textTransform: 'uppercase', letterSpacing: '0.04em',
                  cursor: busy ? 'default' : 'pointer',
                }}
              >Annuler</button>
              <button
                onClick={() => {
                  if (confirm.kind === 'full') doFull();
                  else if (confirm.kind === 'module') doModule(confirm.id);
                  else if (confirm.kind === 'lesson') doLesson(confirm.id);
                }}
                disabled={busy}
                style={{
                  padding: '10px 16px', borderRadius: 12,
                  background: '#c1272d', color: 'white', border: 'none',
                  fontWeight: 900, fontSize: 12, textTransform: 'uppercase',
                  letterSpacing: '0.04em', cursor: busy ? 'default' : 'pointer',
                  boxShadow: '0 3px 0 #8a1a1f',
                }}
              >{busy ? '…' : 'Confirmer'}</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

const btnStyle = (color: string): React.CSSProperties => ({
  width: '100%', padding: '10px 12px', borderRadius: 12,
  background: color, color: 'white', border: 'none',
  fontSize: 12, fontWeight: 900, textAlign: 'left',
  letterSpacing: '0.04em', cursor: 'pointer',
  boxShadow: `0 3px 0 ${color}88`,
});

const labelStyle: React.CSSProperties = {
  fontSize: 10, fontWeight: 800, color: '#8a9baa',
  textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 4,
};

const selectStyle: React.CSSProperties = {
  width: '100%', padding: '9px 10px', borderRadius: 10,
  background: '#0f1720', color: '#e4eef3',
  border: '1px solid #2a3d47', fontSize: 12, fontWeight: 600,
};
