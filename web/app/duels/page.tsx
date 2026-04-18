'use client';

import React, { useCallback, useEffect, useState } from 'react';
import { createDuel, listOpenDuels, listMyDuels, joinDuel, cancelDuel } from '@/lib/api';
import { useUser } from '@/context/UserContext';

const CARD = 'var(--c-card)';
const CARD2 = 'var(--c-card2)';
const BORDER = 'var(--c-border)';
const TEXT = 'var(--c-text)';
const SUB = 'var(--c-sub)';
const GREEN = '#58cc02';
const GREEN_D = '#46a302';
const BLUE = '#1cb0f6';
const BLUE_D = '#1899d6';
const AMBER = '#e9a84c';
const RED = '#ff4b4b';

type Duel = {
  id: string;
  status: 'WAITING' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED';
  p1: { id: string; name?: string | null; avatar?: string | null };
  p2?: { id: string; name?: string | null; avatar?: string | null } | null;
  p1Id: string;
  p2Id?: string | null;
  winnerId?: string | null;
  scoreP1: number;
  scoreP2: number;
  rounds: number;
  createdAt: string;
};

function DuelRow({ duel, meId, onJoin, onCancel }: {
  duel: Duel; meId: string | null;
  onJoin: () => void; onCancel: () => void;
}) {
  const isMine = meId && (duel.p1Id === meId || duel.p2Id === meId);
  const iAmP1 = meId === duel.p1Id;
  const opponent = iAmP1 ? duel.p2 : duel.p1;
  const statusLabel =
    duel.status === 'WAITING' ? 'En attente…' :
    duel.status === 'IN_PROGRESS' ? 'En cours' :
    duel.status === 'COMPLETED' ? (duel.winnerId == null ? 'Égalité' : duel.winnerId === meId ? 'Victoire 🏆' : 'Défaite') :
    'Annulé';
  const statusColor =
    duel.status === 'WAITING' ? AMBER :
    duel.status === 'IN_PROGRESS' ? BLUE :
    duel.status === 'COMPLETED' ? (duel.winnerId === meId ? GREEN : duel.winnerId == null ? SUB : RED) :
    SUB;

  return (
    <div style={{
      background: CARD, border: `1px solid ${BORDER}`, borderRadius: 16,
      padding: '14px 16px', display: 'flex', alignItems: 'center', gap: 12,
    }}>
      <div style={{
        fontSize: 32, flexShrink: 0,
        width: 48, height: 48, borderRadius: 12,
        background: CARD2, display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}>⚔️</div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: 13, fontWeight: 900, color: TEXT, marginBottom: 2 }}>
          {isMine
            ? (opponent ? `vs ${opponent.name ?? 'Adversaire'}` : 'En attente d\'un adversaire')
            : `${duel.p1.name ?? 'Joueur'} cherche un adversaire`}
        </div>
        <div style={{ fontSize: 11, color: SUB }}>
          {duel.rounds} rounds · {new Date(duel.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </div>
      </div>
      <div style={{
        fontSize: 11, fontWeight: 800, color: statusColor,
        padding: '4px 10px', borderRadius: 10, background: statusColor + '18',
        whiteSpace: 'nowrap' as const,
      }}>{statusLabel}</div>
      {duel.status === 'WAITING' && !isMine && (
        <button onClick={onJoin} style={{
          background: GREEN, color: 'white', border: 'none',
          padding: '8px 14px', borderRadius: 10, fontSize: 12, fontWeight: 900,
          cursor: 'pointer', boxShadow: `0 3px 0 ${GREEN_D}`,
        }}>Rejoindre</button>
      )}
      {duel.status === 'WAITING' && isMine && iAmP1 && (
        <button onClick={onCancel} style={{
          background: CARD2, color: SUB, border: `1px solid ${BORDER}`,
          padding: '8px 12px', borderRadius: 10, fontSize: 11, fontWeight: 800,
          cursor: 'pointer',
        }}>Annuler</button>
      )}
      {duel.status === 'IN_PROGRESS' && isMine && (
        <div style={{ fontSize: 12, fontWeight: 900, color: BLUE }}>
          {iAmP1 ? `${duel.scoreP1} vs ${duel.scoreP2}` : `${duel.scoreP2} vs ${duel.scoreP1}`}
        </div>
      )}
    </div>
  );
}

export default function DuelsPage() {
  const { user } = useUser();
  const meId = user?.id ?? null;
  const [tab, setTab] = useState<'open' | 'mine'>('open');
  const [open, setOpen] = useState<Duel[]>([]);
  const [mine, setMine] = useState<Duel[]>([]);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 2500);
  };

  const load = useCallback(async () => {
    try {
      const [o, m] = await Promise.allSettled([listOpenDuels(), listMyDuels()]);
      if (o.status === 'fulfilled') setOpen(o.value as Duel[]);
      if (m.status === 'fulfilled') setMine(m.value as Duel[]);
    } catch {}
    setLoading(false);
  }, []);

  useEffect(() => {
    load();
    const id = setInterval(load, 4000); // polling toutes les 4s
    return () => clearInterval(id);
  }, [load]);

  const handleCreate = async () => {
    try {
      await createDuel({ rounds: 5 });
      showToast('Duel créé — en attente d\'un adversaire');
      setTab('mine');
      load();
    } catch {
      showToast('Erreur : création impossible (connexion requise)');
    }
  };

  const handleJoin = async (id: string) => {
    try {
      await joinDuel(id);
      showToast('Tu as rejoint le duel !');
      setTab('mine');
      load();
    } catch {
      showToast('Impossible de rejoindre ce duel');
    }
  };

  const handleCancel = async (id: string) => {
    try {
      await cancelDuel(id);
      showToast('Duel annulé');
      load();
    } catch {
      showToast('Impossible d\'annuler');
    }
  };

  const list = tab === 'open' ? open : mine;

  return (
    <div style={{ maxWidth: 640, margin: '0 auto', padding: '32px 16px 100px', color: TEXT }}>
      <h1 style={{ fontSize: 28, fontWeight: 900, marginBottom: 4 }}>⚔️ Duels</h1>
      <p style={{ fontSize: 14, color: SUB, marginTop: 0, marginBottom: 20 }}>
        Affronte d'autres apprenants en temps réel — meilleur score gagne.
      </p>

      {/* Create CTA */}
      <button onClick={handleCreate} style={{
        width: '100%', padding: 14, borderRadius: 14, border: 'none',
        background: BLUE, color: 'white', fontSize: 14, fontWeight: 900,
        cursor: 'pointer', boxShadow: `0 4px 0 ${BLUE_D}`, marginBottom: 16,
        textTransform: 'uppercase' as const, letterSpacing: '0.05em',
      }}>+ Nouveau duel (5 rounds)</button>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: 6, marginBottom: 16 }}>
        {([
          { id: 'open' as const, label: `Ouverts (${open.length})` },
          { id: 'mine' as const, label: `Mes duels (${mine.length})` },
        ]).map(t => (
          <button key={t.id} onClick={() => setTab(t.id)} style={{
            flex: 1, padding: 10, borderRadius: 12, border: 'none',
            background: tab === t.id ? GREEN : CARD,
            color: tab === t.id ? 'white' : SUB,
            fontSize: 12, fontWeight: 800, cursor: 'pointer',
            boxShadow: tab === t.id ? `0 3px 0 ${GREEN_D}` : 'none',
          }}>{t.label}</button>
        ))}
      </div>

      {/* List */}
      {loading ? (
        <div style={{ textAlign: 'center', padding: '60px 0', color: SUB }}>Chargement…</div>
      ) : list.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '60px 20px', color: SUB }}>
          <div style={{ fontSize: 40, marginBottom: 8 }}>🕊️</div>
          <div style={{ fontSize: 14, fontWeight: 800, color: TEXT }}>
            {tab === 'open' ? 'Aucun duel ouvert pour l\'instant' : 'Tu n\'as pas encore joué'}
          </div>
          <div style={{ fontSize: 12, marginTop: 4 }}>
            {tab === 'open' ? 'Sois le premier à en créer un !' : 'Crée ou rejoins un duel ci-dessus.'}
          </div>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {list.map(d => (
            <DuelRow key={d.id} duel={d} meId={meId}
              onJoin={() => handleJoin(d.id)}
              onCancel={() => handleCancel(d.id)} />
          ))}
        </div>
      )}

      {/* Info */}
      <div style={{
        marginTop: 24, padding: '14px 16px', borderRadius: 14,
        background: CARD, border: `1px solid ${BORDER}`,
        fontSize: 12, color: SUB, lineHeight: 1.5,
      }}>
        💡 La liste se rafraîchit automatiquement toutes les 4 secondes.
        Soumets tes rounds pendant le duel ; le gagnant est déterminé quand les deux joueurs ont terminé.
      </div>

      {toast && (
        <div style={{
          position: 'fixed', bottom: 90, left: '50%', transform: 'translateX(-50%)',
          background: BLUE, color: 'white',
          padding: '12px 20px', borderRadius: 14,
          fontSize: 13, fontWeight: 800, zIndex: 2000,
          boxShadow: `0 4px 20px ${BLUE}66`,
        }}>{toast}</div>
      )}
    </div>
  );
}
