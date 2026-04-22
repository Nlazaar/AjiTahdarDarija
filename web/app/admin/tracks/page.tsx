"use client";

import React, { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { SortableList, DragHandle } from "@/components/admin/SortableList";

interface TrackRow {
  id: string;
  code: string;
  name: string;
  nameAr: string | null;
  description: string | null;
  emoji: string | null;
  color: string | null;
  order: number;
  isPublished: boolean;
}

const inp: React.CSSProperties = {
  width: "100%", padding: "8px 12px", borderRadius: 8,
  border: "1.5px solid var(--c-border)", background: "var(--c-bg)",
  color: "var(--c-text)", fontSize: 13, outline: "none", boxSizing: "border-box",
};
const lbl: React.CSSProperties = {
  fontSize: 10, fontWeight: 800, color: "var(--c-sub)",
  textTransform: "uppercase", letterSpacing: "0.05em",
  display: "block", marginBottom: 4,
};

const PALETTE = [
  "#58cc02", "#1cb0f6", "#a855f7", "#ff9600", "#ff4b4b",
  "#ffc800", "#ce82ff", "#00cd9c", "#fd7e14",
];

export default function AdminTracksPage() {
  const [tracks, setTracks] = useState<TrackRow[] | null>(null);
  const [err, setErr] = useState<string | null>(null);
  const [savingId, setSavingId] = useState<string | null>(null);
  const [msg, setMsg] = useState<{ ok: boolean; text: string } | null>(null);

  const load = useCallback(async () => {
    setErr(null);
    try {
      const r = await fetch("/api/admin/tracks", { cache: "no-store", credentials: "include" });
      const d = await r.json();
      if (!r.ok) throw new Error(d?.error ?? `HTTP ${r.status}`);
      setTracks(Array.isArray(d) ? d : []);
    } catch (e: any) {
      setErr(e.message);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  function update(id: string, patch: Partial<TrackRow>) {
    setTracks(prev => prev ? prev.map(t => t.id === id ? { ...t, ...patch } : t) : prev);
  }

  async function save(t: TrackRow) {
    setSavingId(t.id); setMsg(null);
    try {
      const r = await fetch(`/api/admin/tracks/${t.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          name: t.name.trim(),
          nameAr: t.nameAr?.trim() || null,
          description: t.description?.trim() || null,
          emoji: t.emoji?.trim() || null,
          color: t.color?.trim() || null,
          isPublished: t.isPublished,
        }),
      });
      const d = await r.json().catch(() => ({}));
      if (!r.ok) throw new Error(d?.error ?? `HTTP ${r.status}`);
      setMsg({ ok: true, text: `✓ ${t.code} sauvegardé` });
    } catch (e: any) {
      setMsg({ ok: false, text: e.message });
    }
    setSavingId(null);
    setTimeout(() => setMsg(null), 3500);
  }

  async function reorderByIds(orderedIds: string[]) {
    if (!tracks) return;
    const byId = new Map(tracks.map(t => [t.id, t]));
    const reordered = orderedIds.map((id, i) => {
      const t = byId.get(id);
      return t ? { ...t, order: i } : null;
    }).filter(Boolean) as TrackRow[];
    setTracks(reordered);
    try {
      const r = await fetch(`/api/admin/tracks/reorder`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ ordered: reordered.map((t, i) => ({ id: t.id, order: i })) }),
      });
      if (!r.ok) throw new Error(`HTTP ${r.status}`);
    } catch (e: any) {
      setMsg({ ok: false, text: `Réordre: ${e.message}` });
      load();
    }
  }

  function move(id: string, dir: -1 | 1) {
    if (!tracks) return;
    const idx = tracks.findIndex(t => t.id === id);
    const target = idx + dir;
    if (idx < 0 || target < 0 || target >= tracks.length) return;
    const next = tracks.map(t => t.id);
    [next[idx], next[target]] = [next[target], next[idx]];
    reorderByIds(next);
  }

  return (
    <div style={{ maxWidth: 900, margin: "0 auto", padding: "24px 20px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
        <div>
          <h1 style={{ fontSize: 22, fontWeight: 900, color: "var(--c-text)", margin: 0 }}>
            🗂️ Parcours (Tracks)
          </h1>
          <p style={{ fontSize: 12, color: "var(--c-sub)", marginTop: 2 }}>
            Niveau supérieur visible dans l'onglet "Mon parcours"
          </p>
        </div>
        <Link href="/admin" style={{
          padding: "7px 14px", borderRadius: 10, textDecoration: "none",
          border: "1px solid var(--c-border)", background: "var(--c-card)",
          color: "var(--c-sub)", fontSize: 13,
        }}>← Admin</Link>
      </div>

      {msg && (
        <div style={{
          marginBottom: 14, padding: "8px 12px", borderRadius: 8, fontSize: 13, fontWeight: 600,
          background: msg.ok ? "rgba(88,204,2,0.1)" : "rgba(255,75,75,0.1)",
          color: msg.ok ? "#46a302" : "#ff4b4b",
          border: `1px solid ${msg.ok ? "rgba(88,204,2,0.3)" : "rgba(255,75,75,0.3)"}`,
        }}>{msg.text}</div>
      )}

      {err && (
        <div style={{
          padding: "12px 14px", borderRadius: 10, marginBottom: 14,
          background: "rgba(255,75,75,0.08)", color: "#ff4b4b",
          border: "1px solid rgba(255,75,75,0.3)", fontSize: 13,
        }}>
          ❌ {err}
        </div>
      )}

      {!tracks && !err && (
        <div style={{ padding: 40, textAlign: "center", color: "var(--c-sub)", fontSize: 13 }}>
          Chargement…
        </div>
      )}

      {tracks && tracks.length === 0 && (
        <div style={{ padding: 24, textAlign: "center", color: "var(--c-sub)", fontSize: 13, border: "1px dashed var(--c-border)", borderRadius: 12 }}>
          Aucun parcours. Lancez le seed <code>_seed_tracks.ts</code>.
        </div>
      )}

      <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
        {tracks && (
          <SortableList
            items={tracks}
            onReorder={reorderByIds}
            renderItem={(t, { handleProps, isDragging }) => {
              const idx = tracks.findIndex(x => x.id === t.id);
              return (
          <div style={{
            background: "var(--c-card)", border: `1px solid ${isDragging ? "#58cc02" : "var(--c-border)"}`,
            borderRadius: 14, padding: "16px 18px",
            borderLeft: `4px solid ${t.color ?? "var(--c-border)"}`,
            boxShadow: isDragging ? "0 4px 12px rgba(0,0,0,0.15)" : undefined,
            marginBottom: 14,
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 14 }}>
              <DragHandle handleProps={handleProps} />
              <span style={{ fontSize: 24 }}>{t.emoji ?? "🗂️"}</span>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 10, fontWeight: 800, color: "var(--c-sub)", letterSpacing: "0.06em", textTransform: "uppercase" }}>{t.code}</div>
                <div style={{ fontSize: 15, fontWeight: 800, color: "var(--c-text)" }}>{t.name}</div>
              </div>
              <button onClick={() => move(t.id, -1)} disabled={idx === 0}
                style={{ padding: "6px 10px", borderRadius: 8, border: "1px solid var(--c-border)", background: "var(--c-bg)", cursor: idx === 0 ? "not-allowed" : "pointer", opacity: idx === 0 ? 0.4 : 1, color: "var(--c-text)" }}>↑</button>
              <button onClick={() => move(t.id, 1)} disabled={idx === tracks.length - 1}
                style={{ padding: "6px 10px", borderRadius: 8, border: "1px solid var(--c-border)", background: "var(--c-bg)", cursor: idx === tracks.length - 1 ? "not-allowed" : "pointer", opacity: idx === tracks.length - 1 ? 0.4 : 1, color: "var(--c-text)" }}>↓</button>
              <label style={{ display: "inline-flex", alignItems: "center", gap: 6, fontSize: 12, color: "var(--c-sub)", fontWeight: 700, userSelect: "none", cursor: "pointer" }}>
                <input type="checkbox" checked={t.isPublished} onChange={e => update(t.id, { isPublished: e.target.checked })} />
                Publié
              </label>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "3fr 1fr", gap: 12, marginBottom: 12 }}>
              <div>
                <label style={lbl}>Nom</label>
                <input style={inp} value={t.name} onChange={e => update(t.id, { name: e.target.value })} />
              </div>
              <div>
                <label style={lbl}>Emoji</label>
                <input style={{ ...inp, textAlign: "center", fontSize: 18 }} value={t.emoji ?? ""} onChange={e => update(t.id, { emoji: e.target.value })} maxLength={4} />
              </div>
            </div>

            <div style={{ marginBottom: 12 }}>
              <label style={lbl}>Nom en arabe</label>
              <input style={{ ...inp, direction: "rtl", fontFamily: "var(--font-amiri), serif", fontSize: 16 }}
                value={t.nameAr ?? ""} onChange={e => update(t.id, { nameAr: e.target.value })} />
            </div>

            <div style={{ marginBottom: 12 }}>
              <label style={lbl}>Description</label>
              <textarea style={{ ...inp, minHeight: 60, fontFamily: "inherit", resize: "vertical" }}
                value={t.description ?? ""} onChange={e => update(t.id, { description: e.target.value })} />
            </div>

            <div style={{ marginBottom: 14 }}>
              <label style={lbl}>Couleur</label>
              <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
                {PALETTE.map(c => (
                  <button key={c} onClick={() => update(t.id, { color: c })} style={{
                    width: 28, height: 28, borderRadius: 8, cursor: "pointer",
                    background: c, border: t.color === c ? "3px solid var(--c-text)" : "2px solid var(--c-border)",
                  }} />
                ))}
                <input style={{ ...inp, width: 110, fontFamily: "monospace" }}
                  value={t.color ?? ""} onChange={e => update(t.id, { color: e.target.value })} placeholder="#RRGGBB" />
              </div>
            </div>

            <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
              <button onClick={() => save(t)} disabled={savingId === t.id} style={{
                padding: "9px 20px", borderRadius: 10, border: "none",
                background: savingId === t.id ? "var(--c-card2)" : "#58cc02",
                color: savingId === t.id ? "var(--c-sub)" : "white",
                fontWeight: 800, fontSize: 13, cursor: savingId === t.id ? "wait" : "pointer",
              }}>
                {savingId === t.id ? "⏳ Sauvegarde…" : "💾 Sauvegarder"}
              </button>
              <span style={{ fontSize: 11, color: "var(--c-sub)" }}>
                Ordre: <strong>{t.order}</strong>
              </span>
            </div>
          </div>
              );
            }}
          />
        )}
      </div>
    </div>
  );
}
