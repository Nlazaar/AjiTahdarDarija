"use client";

import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { EXERCISE_TYPES, EXERCISE_REGISTRY } from "@/lib/exerciseRegistry";

// ── Types ────────────────────────────────────────────────────────────────────

type Track = "DARIJA" | "MSA" | "RELIGION";

interface CityInfo {
  emoji?: string;
  photoUrl?: string;
  history?: string;
  typicalWord?: { ar?: string; latin?: string; fr?: string };
  food?: string;
  culturalFact?: string;
  toSee?: string;
  music?: string;
}

interface ModuleRow {
  id: string;
  slug: string;
  title: string;
  titleAr?: string | null;
  subtitle: string | null;
  level: number;
  track: Track;
  canonicalOrder: number;
  colorA: string | null;
  cityName?: string | null;
  cityNameAr?: string | null;
  emoji?: string | null;
  photoCaption?: string | null;
  isPublished: boolean;
  cityInfo?: CityInfo | null;
  _count?: { lessons: number };
}

interface LessonRow {
  id: string;
  title: string;
  slug: string | null;
  subtitle: string | null;
  order: number;
  level: number;
  moduleId: string | null;
  languageId: string;
  isPublished: boolean;
  isDeleted: boolean;
  content?: any;
}

interface VocabRow {
  id: string;
  word: string;
  transliteration: string | null;
  translation: any;
  audioUrl: string | null;
  imageUrl: string | null;
  languageId: string;
}

interface Language { id: string; code: string; name: string }

interface AuthoredExercise {
  id: string;
  lessonId: string;
  order: number;
  typology: string;
  config: any;
}

// ── Styles partagés ─────────────────────────────────────────────────────────

const inp: React.CSSProperties = {
  width: "100%", padding: "7px 10px", borderRadius: 8,
  border: "1.5px solid var(--c-border)", background: "var(--c-bg)",
  color: "var(--c-text)", fontSize: 13, outline: "none", boxSizing: "border-box",
};
const lbl: React.CSSProperties = { fontSize: 10, fontWeight: 800, color: "var(--c-sub)", textTransform: "uppercase", letterSpacing: "0.05em", display: "block", marginBottom: 4 };
const colHeader: React.CSSProperties = { padding: "10px 12px", borderBottom: "1px solid var(--c-border)", display: "flex", alignItems: "center", justifyContent: "space-between", background: "var(--c-bg)", gap: 8 };
const colTitle: React.CSSProperties = { fontSize: 12, fontWeight: 900, letterSpacing: "0.06em", textTransform: "uppercase", color: "var(--c-text)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" };
const colBtn: React.CSSProperties = { padding: "5px 10px", borderRadius: 8, border: "none", background: "#58cc02", color: "white", fontSize: 16, fontWeight: 900, cursor: "pointer", lineHeight: 1, flexShrink: 0 };
const colBtnGhost: React.CSSProperties = { padding: "5px 8px", borderRadius: 8, border: "1.5px solid var(--c-border)", background: "var(--c-bg)", color: "var(--c-sub)", fontSize: 13, fontWeight: 800, cursor: "pointer", lineHeight: 1, flexShrink: 0 };
const rowBase: React.CSSProperties = { padding: "10px 14px", borderBottom: "1px solid var(--c-border)", cursor: "pointer", display: "flex", alignItems: "center", gap: 10, fontSize: 13, transition: "background 0.1s" };

const TRACK_BADGE: Record<Track, { label: string; color: string }> = {
  DARIJA: { label: "🇲🇦 Darija", color: "#58cc02" },
  MSA: { label: "📖 MSA", color: "#1cb0f6" },
  RELIGION: { label: "☪︎ Rel.", color: "#a855f7" },
};

// ── Modal réutilisable ──────────────────────────────────────────────────────

function Modal({
  open, title, onClose, children, width = 560,
}: {
  open: boolean;
  title: string;
  onClose: () => void;
  children: React.ReactNode;
  width?: number;
}) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  if (!open) return null;
  return (
    <div
      onClick={onClose}
      style={{
        position: "fixed", inset: 0, zIndex: 1000,
        background: "rgba(0,0,0,0.55)", backdropFilter: "blur(3px)",
        display: "flex", alignItems: "center", justifyContent: "center",
        padding: 20,
      }}
    >
      <div
        onClick={e => e.stopPropagation()}
        style={{
          width: "100%", maxWidth: width, maxHeight: "90vh", overflow: "auto",
          background: "var(--c-card)", border: "1px solid var(--c-border)",
          borderRadius: 14, boxShadow: "0 12px 40px rgba(0,0,0,0.35)",
        }}
      >
        <div style={{
          padding: "14px 18px", borderBottom: "1px solid var(--c-border)",
          display: "flex", alignItems: "center", justifyContent: "space-between",
          position: "sticky", top: 0, background: "var(--c-card)", zIndex: 1,
        }}>
          <h2 style={{ fontSize: 15, fontWeight: 900, margin: 0, color: "var(--c-text)" }}>{title}</h2>
          <button onClick={onClose} style={{
            background: "transparent", border: "none", fontSize: 18,
            color: "var(--c-sub)", cursor: "pointer", padding: 4, lineHeight: 1,
          }}>×</button>
        </div>
        <div style={{ padding: 18 }}>{children}</div>
      </div>
    </div>
  );
}

// ── Helpers ──────────────────────────────────────────────────────────────────

function fmtTr(t: any): string {
  if (!t) return "";
  if (typeof t === "string") return t;
  return t.fr ?? t.default ?? JSON.stringify(t);
}

async function api<T>(url: string, init?: RequestInit): Promise<T> {
  const r = await fetch(url, { credentials: "include", ...init });
  const txt = await r.text();
  let data: any;
  try { data = txt ? JSON.parse(txt) : {}; } catch { data = { _raw: txt }; }
  if (!r.ok) throw new Error(data?.message || data?.error || `HTTP ${r.status}`);
  return data as T;
}

function slugify(s: string): string {
  return (s ?? "")
    .toLowerCase()
    .normalize("NFD").replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

const COLOR_PALETTE: { hex: string; name: string }[] = [
  { hex: "#2a9d8f", name: "Teal" },
  { hex: "#58cc02", name: "Vert" },
  { hex: "#1cb0f6", name: "Bleu" },
  { hex: "#a855f7", name: "Violet" },
  { hex: "#ff9600", name: "Orange" },
  { hex: "#ff4b4b", name: "Rouge" },
  { hex: "#e879f9", name: "Rose" },
  { hex: "#facc15", name: "Jaune" },
];

// ── IoModal : Import (paste/upload JSON) + Export (preview/copy/download) ──

type IoMode = 'import' | 'export';
type IoKind = 'section' | 'lessons' | 'vocabulary' | 'exercises';

const IO_KIND_LABEL: Record<IoKind, string> = {
  section: 'Section complète (module + cours + items + exos)',
  lessons: 'Cours (du module sélectionné)',
  vocabulary: 'Items (du cours sélectionné)',
  exercises: 'Exercices (du cours sélectionné)',
};

function IoModal({
  open, mode, kind, slug, onClose, onDone, onError,
}: {
  open: boolean;
  mode: IoMode;
  kind: IoKind;
  slug: string | null; // requis pour export, ignoré pour import (le kind est dans le payload)
  onClose: () => void;
  onDone: (msg: string) => void;
  onError: (msg: string) => void;
}) {
  const [text, setText] = useState('');
  const [busy, setBusy] = useState(false);
  const [report, setReport] = useState<any>(null);

  useEffect(() => {
    if (!open) { setText(''); setReport(null); setBusy(false); return; }
    if (mode !== 'export' || !slug) return;
    setBusy(true);
    api<any>(`/api/admin/io/export/${kind}/${encodeURIComponent(slug)}`)
      .then(json => setText(JSON.stringify(json, null, 2)))
      .catch(e => onError(`Export: ${e.message}`))
      .finally(() => setBusy(false));
  }, [open, mode, kind, slug]); // eslint-disable-line react-hooks/exhaustive-deps

  const onFile = async (f: File | null | undefined) => {
    if (!f) return;
    const t = await f.text();
    setText(t);
  };

  const doImport = async () => {
    let parsed: any;
    try { parsed = JSON.parse(text); }
    catch (e: any) { onError(`JSON invalide: ${e.message}`); return; }
    if (!parsed || typeof parsed !== 'object') { onError('Payload doit être un objet JSON'); return; }
    if (!parsed.kind) parsed.kind = kind;
    if (parsed.kind !== kind) {
      onError(`Le payload est de kind "${parsed.kind}" mais l'import a été lancé pour "${kind}"`);
      return;
    }
    setBusy(true);
    try {
      const r = await api<any>(`/api/admin/io/import`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(parsed),
      });
      setReport(r);
      onDone(`Import réussi : ${kind}`);
    } catch (e: any) {
      onError(`Import: ${e.message}`);
    } finally {
      setBusy(false);
    }
  };

  const copy = async () => {
    try { await navigator.clipboard.writeText(text); onDone('Copié dans le presse-papier'); }
    catch (e: any) { onError(`Copie: ${e.message}`); }
  };

  const download = () => {
    const blob = new Blob([text], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${kind}-${slug ?? 'export'}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const title = mode === 'import' ? `Importer : ${IO_KIND_LABEL[kind]}` : `Exporter : ${IO_KIND_LABEL[kind]}`;

  return (
    <Modal open={open} title={title} onClose={onClose} width={760}>
      {mode === 'import' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          <div style={{ fontSize: 12, color: 'var(--c-sub)' }}>
            Colle un JSON ou charge un fichier <code>.json</code>. Append-mode pour les exercices.
          </div>
          <input type="file" accept="application/json" onChange={e => onFile(e.target.files?.[0])} style={{ fontSize: 12 }} />
          <textarea
            value={text}
            onChange={e => setText(e.target.value)}
            placeholder={`{\n  "kind": "${kind}",\n  "version": 1,\n  "data": { ... }\n}`}
            rows={16}
            style={{ ...inp, fontFamily: 'monospace', fontSize: 12, lineHeight: 1.4, minHeight: 280 }}
          />
          {report && (
            <pre style={{ background: 'var(--c-card2)', padding: 10, borderRadius: 8, fontSize: 11, overflow: 'auto', maxHeight: 200 }}>
              {JSON.stringify(report, null, 2)}
            </pre>
          )}
          <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
            <button onClick={onClose} style={btnGhost}>Fermer</button>
            <button onClick={doImport} disabled={busy || !text.trim()} style={btnPrimary}>
              {busy ? 'Import…' : 'Importer'}
            </button>
          </div>
        </div>
      )}

      {mode === 'export' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {busy && <div style={{ fontSize: 12, color: 'var(--c-sub)' }}>Chargement…</div>}
          <textarea
            value={text}
            readOnly
            rows={20}
            style={{ ...inp, fontFamily: 'monospace', fontSize: 11, lineHeight: 1.4, minHeight: 380 }}
          />
          <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
            <button onClick={onClose} style={btnGhost}>Fermer</button>
            <button onClick={copy} disabled={!text} style={btnGhost}>Copier</button>
            <button onClick={download} disabled={!text} style={btnPrimary}>Télécharger .json</button>
          </div>
        </div>
      )}
    </Modal>
  );
}

const btnPrimary: React.CSSProperties = {
  padding: '8px 16px', borderRadius: 8, border: 'none',
  background: '#58cc02', color: 'white', fontWeight: 800, fontSize: 13, cursor: 'pointer',
};
const btnGhost: React.CSSProperties = {
  padding: '8px 16px', borderRadius: 8, border: '1.5px solid var(--c-border)',
  background: 'var(--c-bg)', color: 'var(--c-text)', fontWeight: 700, fontSize: 13, cursor: 'pointer',
};

// ── Page principale ─────────────────────────────────────────────────────────

export default function AdminContenuPage() {
  const [modules, setModules] = useState<ModuleRow[]>([]);
  const [lessons, setLessons] = useState<LessonRow[]>([]);
  const [vocab, setVocab] = useState<VocabRow[]>([]);
  const [languages, setLanguages] = useState<Language[]>([]);
  const [trackFilter, setTrackFilter] = useState<Track | "ALL">("ALL");
  const [selectedModuleId, setSelectedModuleId] = useState<string | null>(null);
  const [selectedLessonId, setSelectedLessonId] = useState<string | null>(null);
  const [msg, setMsg] = useState<{ ok: boolean; text: string } | null>(null);
  const [io, setIo] = useState<{ mode: IoMode; kind: IoKind; slug: string | null } | null>(null);

  const flash = useCallback((ok: boolean, text: string) => {
    setMsg({ ok, text });
    setTimeout(() => setMsg(null), 3500);
  }, []);

  const reloadModules = useCallback(async () => {
    try {
      const ms = await api<ModuleRow[]>("/api/admin/modules");
      setModules(Array.isArray(ms) ? ms : []);
    } catch (e: any) { flash(false, `Modules: ${e.message}`); }
  }, [flash]);

  const reloadLessons = useCallback(async () => {
    try {
      const ls = await api<LessonRow[]>("/api/admin/lessons");
      setLessons(Array.isArray(ls) ? ls : []);
    } catch (e: any) { flash(false, `Leçons: ${e.message}`); }
  }, [flash]);

  const reloadVocab = useCallback(async (lessonId: string | null) => {
    if (!lessonId) { setVocab([]); return; }
    try {
      const vs = await api<VocabRow[]>(`/api/admin/vocabulary?lessonId=${encodeURIComponent(lessonId)}`);
      setVocab(Array.isArray(vs) ? vs : []);
    } catch (e: any) { flash(false, `Vocabulaire: ${e.message}`); }
  }, [flash]);

  // Initial load
  useEffect(() => {
    reloadModules();
    reloadLessons();
    api<{ languages: Language[] }>("/api/admin/lessons/meta")
      .then(m => setLanguages(m.languages ?? []))
      .catch(() => {});
  }, [reloadModules, reloadLessons]);

  // When lesson changes → reload vocab
  useEffect(() => { reloadVocab(selectedLessonId); }, [selectedLessonId, reloadVocab]);

  // Derived lists
  const filteredModules = useMemo(() => {
    return modules
      .filter(m => trackFilter === "ALL" || m.track === trackFilter)
      .sort((a, b) => a.track.localeCompare(b.track) || a.canonicalOrder - b.canonicalOrder || a.level - b.level);
  }, [modules, trackFilter]);

  const moduleLessons = useMemo(() => {
    if (!selectedModuleId) return [];
    return lessons
      .filter(l => l.moduleId === selectedModuleId && !l.isDeleted)
      .sort((a, b) => a.order - b.order || a.title.localeCompare(b.title));
  }, [lessons, selectedModuleId]);

  const selectedLesson = useMemo(
    () => lessons.find(l => l.id === selectedLessonId) ?? null,
    [lessons, selectedLessonId],
  );

  // ── Réordonnancement : sections (modules) ────────────────────────────────
  // On réindexe toute la liste affichée (canonicalOrder = position) puis on
  // PATCH les 2 modules dont l'ordre a changé. Robuste même si plusieurs
  // modules avaient le même canonicalOrder initial.
  const reorderModule = useCallback(async (idx: number, dir: -1 | 1) => {
    const j = idx + dir;
    if (j < 0 || j >= filteredModules.length) return;
    const a = filteredModules[idx];
    const b = filteredModules[j];
    // Réassigner les positions séquentielles (0..n-1) à partir de la liste
    // affichée puis swap a/b.
    const reindexed = filteredModules.map((m, i) => ({ id: m.id, order: i }));
    [reindexed[idx].order, reindexed[j].order] = [reindexed[j].order, reindexed[idx].order];
    try {
      await Promise.all(
        reindexed.map(({ id, order }) =>
          api(`/api/admin/modules/${id}`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ canonicalOrder: order }),
          }),
        ),
      );
      reloadModules();
      flash(true, `Section ${dir < 0 ? "remontée" : "descendue"} ✓`);
    } catch (e: any) { flash(false, `Réordonner: ${e.message}`); }
  }, [filteredModules, reloadModules, flash]);

  // ── Réordonnancement : cours (lessons) ───────────────────────────────────
  const reorderLesson = useCallback(async (idx: number, dir: -1 | 1) => {
    const j = idx + dir;
    if (j < 0 || j >= moduleLessons.length) return;
    const reindexed = moduleLessons.map((l, i) => ({ id: l.id, order: i }));
    [reindexed[idx].order, reindexed[j].order] = [reindexed[j].order, reindexed[idx].order];
    try {
      await Promise.all(
        reindexed.map(({ id, order }) =>
          api(`/api/admin/lessons/${id}`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ order }),
          }),
        ),
      );
      reloadLessons();
      flash(true, `Cours ${dir < 0 ? "remonté" : "descendu"} ✓`);
    } catch (e: any) { flash(false, `Réordonner: ${e.message}`); }
  }, [moduleLessons, reloadLessons, flash]);

  // ── Réordonnancement : items (vocab) via Lesson.content.vocabOrder ──────
  const reorderItem = useCallback(async (idx: number, dir: -1 | 1) => {
    if (!selectedLessonId) return;
    const j = idx + dir;
    if (j < 0 || j >= vocab.length) return;
    const next = vocab.map(v => v.id);
    [next[idx], next[j]] = [next[j], next[idx]];
    try {
      await api(`/api/admin/lessons/${selectedLessonId}/vocab-order`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orderedIds: next }),
      });
      reloadVocab(selectedLessonId);
      flash(true, `Item ${dir < 0 ? "remonté" : "descendu"} ✓`);
    } catch (e: any) { flash(false, `Réordonner: ${e.message}`); }
  }, [selectedLessonId, vocab, reloadVocab, flash]);

  return (
    <div className="admin-contenu-fullscreen">
      {/* Escape la contrainte 540px de ClientLayout :
          on prend toute la largeur à droite du Sidebar (260px sur md+),
          pleine page sur mobile. */}
      <style jsx>{`
        .admin-contenu-fullscreen {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          padding: 20px 16px;
          overflow: auto;
          background: var(--c-bg);
          z-index: 50;
        }
        @media (min-width: 768px) {
          .admin-contenu-fullscreen { left: 260px; }
        }
      `}</style>
      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
        <div>
          <h1 style={{ fontSize: 22, fontWeight: 900, margin: 0 }}>📁 Contenu pédagogique</h1>
          <p style={{ fontSize: 12, color: "var(--c-sub)", marginTop: 2 }}>Sections → Cours → Items + Séquence d'exercices</p>
        </div>
        <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
          {msg && <span style={{ fontSize: 12, fontWeight: 700, color: msg.ok ? "#46a302" : "#ff4b4b" }}>{msg.text}</span>}
          <Link href="/admin" style={{ fontSize: 12, color: "var(--c-sub)", textDecoration: "none" }}>← Retour admin</Link>
        </div>
      </div>

      {/* Track filter */}
      <div style={{ display: "flex", gap: 6, marginBottom: 12, flexWrap: "wrap" }}>
        {(["ALL", "DARIJA", "MSA", "RELIGION"] as const).map(t => (
          <button key={t} onClick={() => setTrackFilter(t)} style={{
            padding: "5px 12px", borderRadius: 8, cursor: "pointer", fontSize: 11, fontWeight: 700,
            border: "1.5px solid", borderColor: trackFilter === t ? "#58cc02" : "var(--c-border)",
            background: trackFilter === t ? "rgba(88,204,2,0.1)" : "var(--c-bg)",
            color: trackFilter === t ? "#46a302" : "var(--c-sub)",
          }}>
            {t === "ALL" ? "Tous" : TRACK_BADGE[t].label}
          </button>
        ))}
      </div>

      {/* 3 colonnes : Sections · Cours · Items+Exercices.
          Les colonnes apparaissent au fur et à mesure des sélections. */}
      <div style={{
        display: "grid",
        gridTemplateColumns: filteredModules.length === 0
          ? "1fr"
          : selectedLessonId
            ? "300px 320px minmax(0, 1fr)"
            : selectedModuleId
              ? "300px 320px"
              : "300px",
        justifyContent: "start",
        gap: 12,
        alignItems: "start",
      }}>
        <SectionsColumn
          modules={filteredModules}
          languages={languages}
          selectedId={selectedModuleId}
          onSelect={(id) => { setSelectedModuleId(id); setSelectedLessonId(null); }}
          onChanged={() => { reloadModules(); flash(true, "Section sauvegardée ✓"); }}
          onError={(t) => flash(false, t)}
          onReorder={reorderModule}
          onImport={() => setIo({ mode: 'import', kind: 'section', slug: null })}
          onExport={(slug) => setIo({ mode: 'export', kind: 'section', slug })}
        />
        {selectedModuleId && (
          <LessonsColumn
            lessons={moduleLessons}
            languages={languages}
            modules={filteredModules}
            moduleId={selectedModuleId}
            moduleSlug={modules.find(m => m.id === selectedModuleId)?.slug ?? null}
            selectedId={selectedLessonId}
            trackFilter={trackFilter}
            onSelect={(id) => setSelectedLessonId(id)}
            onChanged={() => { reloadLessons(); flash(true, "Leçon sauvegardée ✓"); }}
            onModulesChanged={() => reloadModules()}
            onError={(t) => flash(false, t)}
            onReorder={reorderLesson}
            onImport={() => setIo({ mode: 'import', kind: 'lessons', slug: null })}
            onExport={(slug) => setIo({ mode: 'export', kind: 'lessons', slug })}
          />
        )}
        {selectedLessonId && (
          <ItemsAndSequenceColumn
            lesson={selectedLesson}
            vocab={vocab}
            languages={languages}
            modules={filteredModules}
            allLessons={lessons}
            onVocabChanged={() => reloadVocab(selectedLessonId)}
            onLessonChanged={() => reloadLessons()}
            onReorderItem={reorderItem}
            onChanged={(t) => flash(true, t)}
            onError={(t) => flash(false, t)}
            onImportVocab={() => setIo({ mode: 'import', kind: 'vocabulary', slug: null })}
            onExportVocab={(slug) => setIo({ mode: 'export', kind: 'vocabulary', slug })}
            onImportExos={() => setIo({ mode: 'import', kind: 'exercises', slug: null })}
            onExportExos={(slug) => setIo({ mode: 'export', kind: 'exercises', slug })}
          />
        )}
      </div>

      {io && (
        <IoModal
          open={!!io}
          mode={io.mode}
          kind={io.kind}
          slug={io.slug}
          onClose={() => setIo(null)}
          onDone={(t) => { setIo(null); flash(true, t); reloadModules(); reloadLessons(); reloadVocab(selectedLessonId); }}
          onError={(t) => flash(false, t)}
        />
      )}
    </div>
  );
}

// ════════════════════════════════════════════════════════════════════════════
//  Colonne 1 — Sections (Modules)
// ════════════════════════════════════════════════════════════════════════════

function SectionsColumn({
  modules, languages, selectedId, onSelect, onChanged, onError, onReorder, onImport, onExport,
}: {
  modules: ModuleRow[];
  languages: Language[];
  selectedId: string | null;
  onSelect: (id: string) => void;
  onChanged: () => void;
  onError: (t: string) => void;
  onReorder: (idx: number, dir: -1 | 1) => void;
  onImport: () => void;
  onExport: (slug: string) => void;
}) {
  const selectedSlug = modules.find(m => m.id === selectedId)?.slug ?? null;
  const [editing, setEditing] = useState<Partial<ModuleRow> | null>(null);

  const openCreate = () => setEditing({ title: "", slug: "", track: "DARIJA", level: 1, isPublished: true });

  async function save() {
    if (!editing) return;
    try {
      const payload: any = {
        title: editing.title?.trim(),
        titleAr: editing.titleAr?.trim() || null,
        slug: editing.slug?.trim(),
        track: editing.track ?? "DARIJA",
        subtitle: editing.subtitle ?? null,
        level: editing.level ?? 1,
        canonicalOrder: editing.canonicalOrder ?? 0,
        colorA: editing.colorA ?? null,
        cityName: editing.cityName?.trim() || null,
        cityNameAr: editing.cityNameAr?.trim() || null,
        emoji: editing.emoji?.trim() || null,
        photoCaption: editing.photoCaption?.trim() || null,
        isPublished: editing.isPublished ?? true,
        cityInfo: editing.cityInfo && Object.values(editing.cityInfo).some(v =>
          typeof v === 'string' ? v.trim() : v && Object.values(v).some(x => typeof x === 'string' && x.trim())
        ) ? editing.cityInfo : null,
      };
      if (editing.id) {
        await api(`/api/admin/modules/${editing.id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
      } else {
        await api(`/api/admin/modules`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
      }
      setEditing(null);
      onChanged();
    } catch (e: any) { onError(`Section: ${e.message}`); }
  }

  async function remove(id: string) {
    if (!confirm("Supprimer cette section ?\n\n(Les leçons rattachées sont détachées, pas supprimées.)")) return;
    try {
      await api(`/api/admin/modules/${id}?hard=true`, { method: "DELETE" });
      onChanged();
    } catch (e: any) { onError(`Suppression: ${e.message}`); }
  }

  const isEmpty = modules.length === 0;

  return (
    <div style={isEmpty
      ? { background: "var(--c-card)", border: "1px dashed var(--c-border)", borderRadius: 16, padding: "60px 24px", textAlign: "center" }
      : { background: "var(--c-card)", border: "1px solid var(--c-border)", borderRadius: 12, display: "flex", flexDirection: "column", overflow: "hidden" }}>
      {!isEmpty && (
        <div style={colHeader}>
          <span style={colTitle}>Sections <span style={{ color: "var(--c-sub)", fontWeight: 600 }}>· {modules.length}</span></span>
          <div style={{ display: 'flex', gap: 6 }}>
            <button style={colBtnGhost} title="Importer une section JSON" onClick={onImport}>📥</button>
            <button
              style={{ ...colBtnGhost, opacity: selectedSlug ? 1 : 0.4, cursor: selectedSlug ? 'pointer' : 'not-allowed' }}
              title={selectedSlug ? "Exporter la section sélectionnée" : "Sélectionne une section pour l'exporter"}
              disabled={!selectedSlug}
              onClick={() => selectedSlug && onExport(selectedSlug)}
            >📤</button>
            <button style={colBtn} title="Nouvelle section" onClick={openCreate}>+</button>
          </div>
        </div>
      )}

      {isEmpty && (
        <>
          <div style={{ fontSize: 56, marginBottom: 14 }}>📚</div>
          <h2 style={{ fontSize: 20, fontWeight: 900, margin: 0, color: "var(--c-text)" }}>
            Aucune section pour l'instant
          </h2>
          <p style={{ fontSize: 13, color: "var(--c-sub)", margin: "8px auto 20px", maxWidth: 460 }}>
            Une section (ex. <em>Tanger — Salutations</em>) regroupe plusieurs cours. Chaque cours contient des items (mots) et une séquence d'exercices.
          </p>
          <button onClick={openCreate} style={{
            padding: "12px 28px", borderRadius: 12, border: "none",
            background: "#58cc02", color: "white", fontWeight: 900, fontSize: 14,
            cursor: "pointer", boxShadow: "0 4px 12px rgba(88,204,2,0.3)",
          }}>
            ➕ Ajouter section
          </button>
        </>
      )}

      <Modal open={!!editing} title={editing?.id ? "Modifier la section" : "Nouvelle section"} onClose={() => setEditing(null)} width={620}>
        {editing && (
          <>
            <div style={{ marginBottom: 14 }}>
              <label style={lbl}>Titre *</label>
              <input
                style={inp} autoFocus
                value={editing.title ?? ""}
                onChange={e => {
                  const title = e.target.value;
                  setEditing(s => {
                    if (!s) return s;
                    // auto-slug tant que l'utilisateur n'a pas édité manuellement le slug
                    const prevAutoSlug = slugify(s.title ?? "");
                    const slugUntouched = !s.slug || s.slug === prevAutoSlug;
                    return { ...s, title, slug: slugUntouched ? slugify(title) : s.slug };
                  });
                }}
                placeholder="Tanger — Salutations"
              />
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "3fr 1fr", gap: 12, marginBottom: 14 }}>
              <div>
                <label style={lbl}>Titre arabe</label>
                <input
                  style={{ ...inp, direction: "rtl", fontFamily: "var(--font-amiri), serif", fontSize: 16 }}
                  value={editing.titleAr ?? ""}
                  onChange={e => setEditing(s => ({ ...s, titleAr: e.target.value }))}
                  placeholder="طنجة — التحيات"
                />
              </div>
              <div>
                <label style={lbl}>Emoji section</label>
                <input
                  style={{ ...inp, fontSize: 18, textAlign: "center" }}
                  maxLength={4}
                  value={editing.emoji ?? ""}
                  onChange={e => setEditing(s => ({ ...s, emoji: e.target.value }))}
                  placeholder="🌊"
                />
              </div>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 14 }}>
              <div>
                <label style={lbl}>Nom ville (FR)</label>
                <input
                  style={inp}
                  value={editing.cityName ?? ""}
                  onChange={e => setEditing(s => ({ ...s, cityName: e.target.value }))}
                  placeholder="Tanger"
                />
              </div>
              <div>
                <label style={lbl}>Nom ville (AR)</label>
                <input
                  style={{ ...inp, direction: "rtl", fontFamily: "var(--font-amiri), serif", fontSize: 16 }}
                  value={editing.cityNameAr ?? ""}
                  onChange={e => setEditing(s => ({ ...s, cityNameAr: e.target.value }))}
                  placeholder="طنجة"
                />
              </div>
            </div>
            <div style={{ marginBottom: 14 }}>
              <label style={lbl}>Légende carte ville</label>
              <input
                style={inp}
                value={editing.photoCaption ?? ""}
                onChange={e => setEditing(s => ({ ...s, photoCaption: e.target.value }))}
                placeholder="Porte du détroit, entre Atlantique et Méditerranée"
              />
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 14 }}>
              <div>
                <label style={lbl}>Parcours</label>
                <select style={inp} value={editing.track ?? "DARIJA"} onChange={e => setEditing(s => ({ ...s, track: e.target.value as Track }))}>
                  <option value="DARIJA">🇲🇦 Darija</option>
                  <option value="MSA">📖 MSA</option>
                  <option value="RELIGION">☪︎ Religion</option>
                </select>
              </div>
              <div>
                <label style={lbl}>Ordre section</label>
                <input style={inp} type="number" value={editing.canonicalOrder ?? 0} onChange={e => setEditing(s => ({ ...s, canonicalOrder: Number(e.target.value) }))} />
                <div style={{ fontSize: 10, color: "var(--c-sub)", marginTop: 3 }}>Position dans le parcours (0 = début)</div>
              </div>
            </div>
            <div style={{ marginBottom: 14 }}>
              <label style={lbl}>Couleur</label>
              <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                {COLOR_PALETTE.map(c => {
                  const active = editing.colorA === c.hex;
                  return (
                    <button
                      key={c.hex}
                      type="button"
                      onClick={() => setEditing(s => ({ ...s, colorA: c.hex }))}
                      title={c.name}
                      style={{
                        width: 36, height: 36, borderRadius: 10, cursor: "pointer",
                        background: c.hex,
                        border: active ? "3px solid var(--c-text)" : "2px solid transparent",
                        outline: active ? "2px solid " + c.hex : "none",
                        transition: "transform 0.1s",
                        transform: active ? "scale(1.05)" : "scale(1)",
                      }}
                    />
                  );
                })}
                <button
                  type="button"
                  onClick={() => setEditing(s => ({ ...s, colorA: null }))}
                  title="Aucune couleur"
                  style={{
                    width: 36, height: 36, borderRadius: 10, cursor: "pointer",
                    background: "var(--c-bg)",
                    border: !editing.colorA ? "3px solid var(--c-text)" : "2px solid var(--c-border)",
                    color: "var(--c-sub)", fontSize: 18, lineHeight: 1,
                  }}
                >∅</button>
              </div>
            </div>
            <details style={{ marginBottom: 14 }}>
              <summary style={{ fontSize: 11, color: "var(--c-sub)", cursor: "pointer", userSelect: "none" }}>
                🏙️ Infos ville (affichées au clic sur le bandeau du parcours)
              </summary>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginTop: 10 }}>
                <div>
                  <label style={lbl}>Emoji</label>
                  <input
                    style={inp}
                    maxLength={4}
                    value={editing.cityInfo?.emoji ?? ""}
                    onChange={e => setEditing(s => ({ ...s, cityInfo: { ...(s?.cityInfo ?? {}), emoji: e.target.value } }))}
                    placeholder="🏛️"
                  />
                </div>
                <div>
                  <label style={lbl}>Photo (URL)</label>
                  <input
                    style={inp}
                    value={editing.cityInfo?.photoUrl ?? ""}
                    onChange={e => setEditing(s => ({ ...s, cityInfo: { ...(s?.cityInfo ?? {}), photoUrl: e.target.value } }))}
                    placeholder="https://…"
                  />
                </div>
              </div>
              <div style={{ marginTop: 10 }}>
                <label style={lbl}>Histoire</label>
                <textarea
                  style={{ ...inp, minHeight: 70, resize: "vertical", fontFamily: "inherit" }}
                  value={editing.cityInfo?.history ?? ""}
                  onChange={e => setEditing(s => ({ ...s, cityInfo: { ...(s?.cityInfo ?? {}), history: e.target.value } }))}
                  placeholder="Tanger, porte de l'Afrique, à la croisée de la Méditerranée et de l'Atlantique…"
                />
              </div>
              <div style={{ marginTop: 10, padding: 10, border: "1px dashed var(--c-border)", borderRadius: 8 }}>
                <div style={{ fontSize: 10, color: "var(--c-sub)", fontWeight: 700, marginBottom: 6 }}>MOT TYPIQUE (avec chakle)</div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8 }}>
                  <input
                    style={{ ...inp, direction: "rtl", fontSize: 16 }}
                    value={editing.cityInfo?.typicalWord?.ar ?? ""}
                    onChange={e => setEditing(s => ({ ...s, cityInfo: { ...(s?.cityInfo ?? {}), typicalWord: { ...(s?.cityInfo?.typicalWord ?? {}), ar: e.target.value } } }))}
                    placeholder="بْحَر"
                  />
                  <input
                    style={inp}
                    value={editing.cityInfo?.typicalWord?.latin ?? ""}
                    onChange={e => setEditing(s => ({ ...s, cityInfo: { ...(s?.cityInfo ?? {}), typicalWord: { ...(s?.cityInfo?.typicalWord ?? {}), latin: e.target.value } } }))}
                    placeholder="b7er"
                  />
                  <input
                    style={inp}
                    value={editing.cityInfo?.typicalWord?.fr ?? ""}
                    onChange={e => setEditing(s => ({ ...s, cityInfo: { ...(s?.cityInfo ?? {}), typicalWord: { ...(s?.cityInfo?.typicalWord ?? {}), fr: e.target.value } } }))}
                    placeholder="mer"
                  />
                </div>
              </div>
              <div style={{ marginTop: 10 }}>
                <label style={lbl}>Spécialité culinaire</label>
                <input
                  style={inp}
                  value={editing.cityInfo?.food ?? ""}
                  onChange={e => setEditing(s => ({ ...s, cityInfo: { ...(s?.cityInfo ?? {}), food: e.target.value } }))}
                  placeholder="Poisson grillé du port, harira tangéroise…"
                />
              </div>
              <div style={{ marginTop: 10 }}>
                <label style={lbl}>Fait culturel</label>
                <input
                  style={inp}
                  value={editing.cityInfo?.culturalFact ?? ""}
                  onChange={e => setEditing(s => ({ ...s, cityInfo: { ...(s?.cityInfo ?? {}), culturalFact: e.target.value } }))}
                  placeholder="Ville refuge de Matisse, Bowles, Burroughs…"
                />
              </div>
              <div style={{ marginTop: 10 }}>
                <label style={lbl}>À voir</label>
                <input
                  style={inp}
                  value={editing.cityInfo?.toSee ?? ""}
                  onChange={e => setEditing(s => ({ ...s, cityInfo: { ...(s?.cityInfo ?? {}), toSee: e.target.value } }))}
                  placeholder="Kasbah, Cap Spartel, Grottes d'Hercule"
                />
              </div>
              <div style={{ marginTop: 10 }}>
                <label style={lbl}>Musique</label>
                <input
                  style={inp}
                  value={editing.cityInfo?.music ?? ""}
                  onChange={e => setEditing(s => ({ ...s, cityInfo: { ...(s?.cityInfo ?? {}), music: e.target.value } }))}
                  placeholder="Jajouka, aïta jabalia"
                />
              </div>
            </details>

            <details style={{ marginBottom: 14 }}>
              <summary style={{ fontSize: 11, color: "var(--c-sub)", cursor: "pointer", userSelect: "none" }}>
                ⚙️ Options avancées (identifiant URL, niveau)
              </summary>
              <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: 12, marginTop: 10 }}>
                <div>
                  <label style={lbl}>Identifiant URL</label>
                  <input style={{ ...inp, fontFamily: "monospace", fontSize: 12 }} value={editing.slug ?? ""} onChange={e => setEditing(s => ({ ...s, slug: slugify(e.target.value) }))} placeholder="tanger-salutations" />
                  <div style={{ fontSize: 10, color: "var(--c-sub)", marginTop: 3 }}>Auto-généré depuis le titre</div>
                </div>
                <div>
                  <label style={lbl}>Niveau</label>
                  <input style={inp} type="number" value={editing.level ?? 1} onChange={e => setEditing(s => ({ ...s, level: Number(e.target.value) }))} />
                </div>
              </div>
            </details>
            <label style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 13, marginBottom: 16 }}>
              <input type="checkbox" checked={editing.isPublished ?? true} onChange={e => setEditing(s => ({ ...s, isPublished: e.target.checked }))} />
              Publié (visible dans le parcours)
            </label>
            <div style={{ display: "flex", gap: 8, justifyContent: "flex-end", paddingTop: 8, borderTop: "1px solid var(--c-border)" }}>
              <button onClick={() => setEditing(null)} style={{ padding: "8px 16px", borderRadius: 8, border: "1px solid var(--c-border)", background: "var(--c-bg)", color: "var(--c-sub)", fontSize: 13, cursor: "pointer" }}>Annuler</button>
              <button onClick={save} disabled={!editing.title || !editing.slug} style={{ padding: "8px 18px", borderRadius: 8, border: "none", background: "#58cc02", color: "white", fontWeight: 800, fontSize: 13, cursor: "pointer", opacity: !editing.title || !editing.slug ? 0.5 : 1 }}>
                {editing.id ? "💾 Enregistrer" : "➕ Créer la section"}
              </button>
            </div>
          </>
        )}
      </Modal>

      {!isEmpty && <div style={{ flex: 1, overflow: "auto" }}>
        {modules.map((m, idx) => (
          <div
            key={m.id}
            onClick={() => onSelect(m.id)}
            style={{
              ...rowBase,
              background: selectedId === m.id ? "rgba(88,204,2,0.08)" : "transparent",
              borderLeft: selectedId === m.id ? "3px solid #58cc02" : "3px solid transparent",
            }}
          >
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 2 }}>
                <span style={{ fontSize: 10, fontWeight: 800, color: TRACK_BADGE[m.track].color }}>{TRACK_BADGE[m.track].label}</span>
                <span style={{ fontSize: 10, color: "var(--c-sub)" }}>· N{m.level}</span>
                {!m.isPublished && <span style={{ fontSize: 10, color: "#ff8800" }}>· brouillon</span>}
              </div>
              <div style={{ fontWeight: 700, fontSize: 13, color: "var(--c-text)" }}>{m.title}</div>
              <div style={{ fontSize: 10, color: "var(--c-sub)", fontFamily: "monospace" }}>{m.slug} · {m._count?.lessons ?? 0} leçon(s)</div>
            </div>
            <div style={{ display: "flex", gap: 2, flexShrink: 0, alignItems: "center" }}>
              <button
                onClick={(e) => { e.stopPropagation(); onReorder(idx, -1); }}
                disabled={idx === 0}
                style={{ background: "transparent", border: "none", cursor: idx === 0 ? "default" : "pointer", fontSize: 14, color: "var(--c-sub)", padding: 3, opacity: idx === 0 ? 0.25 : 1 }}
                title="Monter"
              >↑</button>
              <button
                onClick={(e) => { e.stopPropagation(); onReorder(idx, 1); }}
                disabled={idx === modules.length - 1}
                style={{ background: "transparent", border: "none", cursor: idx === modules.length - 1 ? "default" : "pointer", fontSize: 14, color: "var(--c-sub)", padding: 3, opacity: idx === modules.length - 1 ? 0.25 : 1 }}
                title="Descendre"
              >↓</button>
              <button onClick={(e) => { e.stopPropagation(); setEditing(m); }} style={{ background: "transparent", border: "none", cursor: "pointer", fontSize: 13, color: "var(--c-sub)", padding: 4 }} title="Éditer">✏️</button>
              <button onClick={(e) => { e.stopPropagation(); remove(m.id); }} style={{ background: "transparent", border: "none", cursor: "pointer", fontSize: 13, color: "#ff4b4b", padding: 4 }} title="Supprimer">🗑️</button>
            </div>
          </div>
        ))}
      </div>}
    </div>
  );
}

// ════════════════════════════════════════════════════════════════════════════
//  Colonne 2 — Cours (Lessons)
// ════════════════════════════════════════════════════════════════════════════

function LessonsColumn({
  lessons, languages, modules, moduleId, moduleSlug, selectedId, trackFilter, onSelect, onChanged, onError, onModulesChanged, onReorder, onImport, onExport,
}: {
  lessons: LessonRow[];
  languages: Language[];
  modules: ModuleRow[];
  moduleId: string | null;
  moduleSlug: string | null;
  selectedId: string | null;
  trackFilter: Track | "ALL";
  onSelect: (id: string) => void;
  onChanged: () => void;
  onError: (t: string) => void;
  onModulesChanged: () => void;
  onReorder: (idx: number, dir: -1 | 1) => void;
  onImport: () => void;
  onExport: (moduleSlug: string) => void;
}) {
  const [editing, setEditing] = useState<Partial<LessonRow> | null>(null);
  const [newSection, setNewSection] = useState<{ title: string; track: Track } | null>(null);

  async function createNewSection() {
    if (!newSection?.title.trim()) return;
    try {
      const slug = slugify(newSection.title);
      const created = await api<ModuleRow>(`/api/admin/modules`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: newSection.title.trim(),
          slug,
          track: newSection.track,
          level: 1,
          canonicalOrder: 0,
          isPublished: true,
        }),
      });
      setEditing(s => ({ ...s, moduleId: created.id }));
      setNewSection(null);
      onModulesChanged();
    } catch (e: any) { onError(`Section: ${e.message}`); }
  }

  async function save() {
    if (!editing) return;
    const targetModuleId = editing.moduleId ?? moduleId;
    if (!targetModuleId) return;
    try {
      const payload: any = {
        title: editing.title?.trim(),
        slug: editing.slug?.trim() || null,
        subtitle: editing.subtitle ?? null,
        order: editing.order ?? 0,
        level: editing.level ?? 1,
        moduleId: targetModuleId,
        languageId: editing.languageId,
        isPublished: editing.isPublished ?? true,
      };
      if (editing.id) {
        await api(`/api/admin/lessons/${editing.id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
      } else {
        await api(`/api/admin/lessons`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
      }
      setEditing(null);
      onChanged();
    } catch (e: any) { onError(`Cours: ${e.message}`); }
  }

  async function remove(id: string) {
    if (!confirm("Supprimer cette leçon ?\n\n(Items vocabulaire détachés, progression utilisateurs perdue.)")) return;
    try {
      await api(`/api/admin/lessons/${id}?hard=true`, { method: "DELETE" });
      onChanged();
    } catch (e: any) { onError(`Suppression: ${e.message}`); }
  }

  if (!moduleId) {
    return (
      <div style={{ background: "var(--c-card)", border: "1px solid var(--c-border)", borderRadius: 12, display: "flex", alignItems: "center", justifyContent: "center", color: "var(--c-sub)", fontSize: 12, padding: 30 }}>
        ← Sélectionne une section
      </div>
    );
  }

  // Default langue: première trouvée (typiquement ar-MA)
  const defaultLangId = languages[0]?.id ?? "";

  return (
    <div style={{ background: "var(--c-card)", border: "1px solid var(--c-border)", borderRadius: 12, display: "flex", flexDirection: "column", overflow: "hidden" }}>
      <div style={colHeader}>
        <span style={colTitle}>Cours <span style={{ color: "var(--c-sub)", fontWeight: 600 }}>· {lessons.length}</span></span>
        <div style={{ display: 'flex', gap: 6 }}>
          <button style={colBtnGhost} title="Importer des cours dans cette section" onClick={onImport}>📥</button>
          <button
            style={{ ...colBtnGhost, opacity: moduleSlug ? 1 : 0.4, cursor: moduleSlug ? 'pointer' : 'not-allowed' }}
            title={moduleSlug ? "Exporter tous les cours de cette section" : "Section sans slug"}
            disabled={!moduleSlug}
            onClick={() => moduleSlug && onExport(moduleSlug)}
          >📤</button>
          <button style={colBtn} title="Nouveau cours" onClick={() => setEditing({ title: "", slug: "", order: lessons.length, level: 1, languageId: defaultLangId, moduleId, isPublished: true })}>+</button>
        </div>
      </div>

      <Modal open={!!newSection} title="Nouvelle section" onClose={() => setNewSection(null)} width={460}>
        {newSection && (
          <>
            <div style={{ marginBottom: 12 }}>
              <label style={lbl}>Titre *</label>
              <input
                style={inp}
                autoFocus
                value={newSection.title}
                onChange={e => setNewSection(s => s ? { ...s, title: e.target.value } : s)}
                onKeyDown={e => { if (e.key === "Enter" && newSection.title.trim()) createNewSection(); }}
                placeholder="Ex. Casablanca — Transports"
              />
            </div>
            <div style={{ marginBottom: 16 }}>
              <label style={lbl}>Parcours</label>
              <select
                style={inp}
                value={newSection.track}
                onChange={e => setNewSection(s => s ? { ...s, track: e.target.value as Track } : s)}
              >
                <option value="DARIJA">🇲🇦 Darija</option>
                <option value="MSA">📖 MSA</option>
                <option value="RELIGION">☪︎ Religion</option>
              </select>
            </div>
            <div style={{ fontSize: 11, color: "var(--c-sub)", marginBottom: 12 }}>
              Créé avec les valeurs par défaut (ordre 0, publié). Tu pourras affiner la couleur, l'ordre et la description depuis la colonne Sections.
            </div>
            <div style={{ display: "flex", gap: 8, justifyContent: "flex-end", paddingTop: 8, borderTop: "1px solid var(--c-border)" }}>
              <button onClick={() => setNewSection(null)} style={{ padding: "8px 16px", borderRadius: 8, border: "1px solid var(--c-border)", background: "var(--c-bg)", color: "var(--c-sub)", fontSize: 13, cursor: "pointer" }}>Annuler</button>
              <button
                onClick={createNewSection}
                disabled={!newSection.title.trim()}
                style={{ padding: "8px 18px", borderRadius: 8, border: "none", background: "#58cc02", color: "white", fontWeight: 800, fontSize: 13, cursor: newSection.title.trim() ? "pointer" : "not-allowed", opacity: newSection.title.trim() ? 1 : 0.5 }}
              >
                ➕ Créer la section
              </button>
            </div>
          </>
        )}
      </Modal>

      <Modal open={!!editing} title={editing?.id ? "Modifier le cours" : "Nouveau cours"} onClose={() => setEditing(null)} width={620}>
        {editing && (
          <>
            <div style={{ marginBottom: 12 }}>
              <label style={lbl}>Titre *</label>
              <input style={inp} autoFocus value={editing.title ?? ""} onChange={e => setEditing(s => ({ ...s, title: e.target.value }))} placeholder="Salutations de base" />
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 12 }}>
              <div>
                <label style={lbl}>Slug</label>
                <input style={inp} value={editing.slug ?? ""} onChange={e => setEditing(s => ({ ...s, slug: e.target.value }))} placeholder="salutations-base (optionnel)" />
              </div>
              <div>
                <label style={lbl}>Langue *</label>
                <select style={inp} value={editing.languageId ?? defaultLangId} onChange={e => setEditing(s => ({ ...s, languageId: e.target.value }))}>
                  <option value="">—</option>
                  {languages.map(l => <option key={l.id} value={l.id}>{l.code} — {l.name}</option>)}
                </select>
              </div>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 12 }}>
              <div>
                <label style={lbl}>Ordre</label>
                <input style={inp} type="number" value={editing.order ?? 0} onChange={e => setEditing(s => ({ ...s, order: Number(e.target.value) }))} />
              </div>
              <div>
                <label style={lbl}>Niveau</label>
                <input style={inp} type="number" value={editing.level ?? 1} onChange={e => setEditing(s => ({ ...s, level: Number(e.target.value) }))} />
              </div>
            </div>
            <div style={{ marginBottom: 12 }}>
              <label style={lbl}>Sous-titre</label>
              <input style={inp} value={editing.subtitle ?? ""} onChange={e => setEditing(s => ({ ...s, subtitle: e.target.value }))} placeholder="السلام عليكم" />
            </div>
            <div style={{ marginBottom: 12 }}>
              <label style={lbl}>Section *</label>
              <select
                style={inp}
                value={editing.moduleId ?? moduleId ?? ""}
                onChange={e => {
                  const v = e.target.value;
                  if (v === "__new__") {
                    const track: Track = trackFilter === "ALL" ? "DARIJA" : trackFilter;
                    setNewSection({ title: "", track });
                  } else {
                    setEditing(s => ({ ...s, moduleId: v || null }));
                  }
                }}
              >
                <option value="">— Sélectionner —</option>
                <option value="__new__">➕ Créer une nouvelle section…</option>
                {modules.map(m => (
                  <option key={m.id} value={m.id}>
                    {TRACK_BADGE[m.track].label} · {m.title}
                  </option>
                ))}
              </select>
              {editing.id && editing.moduleId && editing.moduleId !== moduleId && (
                <div style={{ fontSize: 11, color: "#ff8800", marginTop: 4 }}>
                  ⚠ Ce cours sera déplacé vers une autre section
                </div>
              )}
            </div>
            <label style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 13, marginBottom: 16 }}>
              <input type="checkbox" checked={editing.isPublished ?? true} onChange={e => setEditing(s => ({ ...s, isPublished: e.target.checked }))} />
              Publié
            </label>
            <div style={{ display: "flex", gap: 8, justifyContent: "flex-end", paddingTop: 8, borderTop: "1px solid var(--c-border)" }}>
              <button onClick={() => setEditing(null)} style={{ padding: "8px 16px", borderRadius: 8, border: "1px solid var(--c-border)", background: "var(--c-bg)", color: "var(--c-sub)", fontSize: 13, cursor: "pointer" }}>Annuler</button>
              <button onClick={save} disabled={!editing.title || !editing.languageId} style={{ padding: "8px 18px", borderRadius: 8, border: "none", background: "#58cc02", color: "white", fontWeight: 800, fontSize: 13, cursor: "pointer", opacity: !editing.title || !editing.languageId ? 0.5 : 1 }}>
                {editing.id ? "💾 Enregistrer" : "➕ Créer le cours"}
              </button>
            </div>
          </>
        )}
      </Modal>

      <div style={{ flex: 1, overflow: "auto" }}>
        {lessons.length === 0 ? (
          <div style={{ padding: 30, textAlign: "center", color: "var(--c-sub)", fontSize: 12 }}>Aucun cours dans cette section</div>
        ) : lessons.map((l, idx) => {
          const seq = (l.content as any)?.sequence as string[] | undefined;
          return (
            <div
              key={l.id}
              onClick={() => onSelect(l.id)}
              style={{
                ...rowBase,
                background: selectedId === l.id ? "rgba(88,204,2,0.08)" : "transparent",
                borderLeft: selectedId === l.id ? "3px solid #58cc02" : "3px solid transparent",
              }}
            >
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 2 }}>
                  <span style={{ fontSize: 10, color: "var(--c-sub)" }}>#{l.order}</span>
                  <span style={{ fontSize: 10, fontWeight: 800, color: "#1cb0f6" }}>N{l.level}</span>
                  {!l.isPublished && <span style={{ fontSize: 10, color: "#ff8800" }}>brouillon</span>}
                  {seq && seq.length > 0 && (
                    <span style={{ fontSize: 10, color: "#58cc02", fontWeight: 800 }}>● {seq.length} étape(s)</span>
                  )}
                </div>
                <div style={{ fontWeight: 700, fontSize: 13, color: "var(--c-text)" }}>{l.title}</div>
                {l.slug && <div style={{ fontSize: 10, color: "var(--c-sub)", fontFamily: "monospace" }}>{l.slug}</div>}
              </div>
              <div style={{ display: "flex", gap: 2, flexShrink: 0, alignItems: "center" }}>
                <button
                  onClick={(e) => { e.stopPropagation(); onReorder(idx, -1); }}
                  disabled={idx === 0}
                  style={{ background: "transparent", border: "none", cursor: idx === 0 ? "default" : "pointer", fontSize: 14, color: "var(--c-sub)", padding: 3, opacity: idx === 0 ? 0.25 : 1 }}
                  title="Monter"
                >↑</button>
                <button
                  onClick={(e) => { e.stopPropagation(); onReorder(idx, 1); }}
                  disabled={idx === lessons.length - 1}
                  style={{ background: "transparent", border: "none", cursor: idx === lessons.length - 1 ? "default" : "pointer", fontSize: 14, color: "var(--c-sub)", padding: 3, opacity: idx === lessons.length - 1 ? 0.25 : 1 }}
                  title="Descendre"
                >↓</button>
                <button onClick={(e) => { e.stopPropagation(); setEditing(l); }} style={{ background: "transparent", border: "none", cursor: "pointer", fontSize: 13, color: "var(--c-sub)", padding: 4 }} title="Éditer">✏️</button>
                <button onClick={(e) => { e.stopPropagation(); remove(l.id); }} style={{ background: "transparent", border: "none", cursor: "pointer", fontSize: 13, color: "#ff4b4b", padding: 4 }} title="Supprimer">🗑️</button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ════════════════════════════════════════════════════════════════════════════
//  Colonne 3 — Items + Séquence
// ════════════════════════════════════════════════════════════════════════════

function ItemsAndSequenceColumn({
  lesson, vocab, languages, modules, allLessons, onVocabChanged, onLessonChanged, onReorderItem, onChanged, onError,
  onImportVocab, onExportVocab, onImportExos, onExportExos,
}: {
  lesson: LessonRow | null;
  vocab: VocabRow[];
  languages: Language[];
  modules: ModuleRow[];
  allLessons: LessonRow[];
  onVocabChanged: () => void;
  onLessonChanged: () => void;
  onReorderItem: (idx: number, dir: -1 | 1) => void;
  onChanged: (text: string) => void;
  onError: (text: string) => void;
  onImportVocab: () => void;
  onExportVocab: (lessonSlug: string) => void;
  onImportExos: () => void;
  onExportExos: (lessonSlug: string) => void;
}) {
  const [editing, setEditing] = useState<Partial<VocabRow> | null>(null);
  const [tab, setTab] = useState<"items" | "exercises">("items");
  const [exercises, setExercises] = useState<AuthoredExercise[]>([]);

  const lessonId = lesson?.id ?? null;

  const reloadExercises = useCallback(async () => {
    if (!lessonId) { setExercises([]); return; }
    try {
      const list = await api<AuthoredExercise[]>(`/api/admin/lessons/${lessonId}/authored-exercises`);
      setExercises(Array.isArray(list) ? list : []);
    } catch (e: any) { onError(`Exercices: ${e.message}`); }
  }, [lessonId, onError]);

  useEffect(() => { reloadExercises(); }, [reloadExercises]);

  if (!lesson) {
    return (
      <div style={{
        background: "var(--c-card)", border: "1px dashed var(--c-border)",
        borderRadius: 12, display: "flex", flexDirection: "column",
        alignItems: "center", justifyContent: "center",
        color: "var(--c-sub)", fontSize: 13, padding: 40, minHeight: 320, gap: 10,
      }}>
        <div style={{ fontSize: 36, opacity: 0.5 }}>📝</div>
        <div style={{ fontWeight: 700 }}>Sélectionne un cours dans la colonne 2</div>
        <div style={{ fontSize: 11, opacity: 0.7 }}>Tu pourras alors gérer les items (mots) et les exercices.</div>
      </div>
    );
  }

  const langId = lesson.languageId;

  async function saveVocab() {
    if (!editing) return;
    try {
      const payload: any = {
        word: editing.word?.trim(),
        transliteration: editing.transliteration ?? null,
        translation: editing.translation && (editing.translation as any).fr
          ? editing.translation
          : { fr: typeof editing.translation === "string" ? editing.translation : "" },
        languageId: langId,
      };
      let id: string;
      if (editing.id) {
        await api(`/api/admin/vocabulary/${editing.id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        id = editing.id;
      } else {
        const created = await api<VocabRow>(`/api/admin/vocabulary`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        id = created.id;
        await api(`/api/admin/vocabulary/${id}/attach/${lesson!.id}`, { method: "POST" });
      }
      setEditing(null);
      onVocabChanged();
      onChanged("Item sauvegardé ✓");
    } catch (e: any) { onError(`Item: ${e.message}`); }
  }

  async function removeVocab(id: string) {
    if (!confirm("Supprimer cet item ?")) return;
    try {
      await api(`/api/admin/vocabulary/${id}`, { method: "DELETE" });
      onVocabChanged();
    } catch (e: any) { onError(`Suppression: ${e.message}`); }
  }

  const [moving, setMoving] = useState<VocabRow | null>(null);
  async function moveVocab(vocabId: string, targetLessonId: string) {
    if (!lesson || targetLessonId === lesson.id) { setMoving(null); return; }
    try {
      await api(`/api/admin/vocabulary/${vocabId}/attach/${lesson.id}`, { method: "DELETE" });
      await api(`/api/admin/vocabulary/${vocabId}/attach/${targetLessonId}`, { method: "POST" });
      setMoving(null);
      onVocabChanged();
      onChanged("Item déplacé ✓");
    } catch (e: any) { onError(`Déplacement: ${e.message}`); }
  }

  async function uploadAudio(id: string, file: File) {
    try {
      const fd = new FormData();
      fd.append("file", file);
      const r = await fetch(`/api/admin/vocabulary/${id}/audio`, {
        method: "POST", credentials: "include", body: fd,
      });
      const data = await r.json().catch(() => ({}));
      if (!r.ok) throw new Error(data?.message || `HTTP ${r.status}`);
      onVocabChanged();
      onChanged("Audio uploadé ✓");
    } catch (e: any) { onError(`Audio: ${e.message}`); }
  }

  async function createExercise(typology: string) {
    try {
      const config = defaultConfigFor(typology, vocab);
      await api(`/api/admin/lessons/${lessonId}/authored-exercises`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ typology, config }),
      });
      reloadExercises();
      onChanged(`Exercice ${typology} ajouté ✓`);
    } catch (e: any) { onError(`Exercice: ${e.message}`); }
  }

  async function updateExercise(exId: string, patch: Partial<AuthoredExercise>) {
    try {
      await api(`/api/admin/lessons/${lessonId}/authored-exercises/${exId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(patch),
      });
      reloadExercises();
      onChanged("Exercice sauvegardé ✓");
    } catch (e: any) { onError(`Exercice: ${e.message}`); }
  }

  async function deleteExercise(exId: string) {
    if (!confirm("Supprimer cet exercice ?")) return;
    try {
      await api(`/api/admin/lessons/${lessonId}/authored-exercises/${exId}`, { method: "DELETE" });
      reloadExercises();
    } catch (e: any) { onError(`Suppression: ${e.message}`); }
  }

  async function reorderExercise(idx: number, dir: -1 | 1) {
    const j = idx + dir;
    if (j < 0 || j >= exercises.length) return;
    const next = exercises.map(e => e.id);
    [next[idx], next[j]] = [next[j], next[idx]];
    try {
      await api(`/api/admin/lessons/${lessonId}/authored-exercises/reorder`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orderedIds: next }),
      });
      reloadExercises();
    } catch (e: any) { onError(`Réordonner: ${e.message}`); }
  }

  const lessonSlug = lesson.slug ?? null;
  const isItemsTab = tab === "items";
  const importHandler = isItemsTab ? onImportVocab : onImportExos;
  const exportHandler = isItemsTab ? onExportVocab : onExportExos;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
      <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
        <button onClick={() => setTab("items")} style={{
          flex: 1, padding: "10px 14px", borderRadius: 8, border: "none", fontSize: 13, fontWeight: 800, cursor: "pointer",
          background: tab === "items" ? "#58cc02" : "var(--c-card2)",
          color: tab === "items" ? "white" : "var(--c-sub)",
        }}>📝 Items ({vocab.length})</button>
        <button onClick={() => setTab("exercises")} style={{
          flex: 1, padding: "10px 14px", borderRadius: 8, border: "none", fontSize: 13, fontWeight: 800, cursor: "pointer",
          background: tab === "exercises" ? "#58cc02" : "var(--c-card2)",
          color: tab === "exercises" ? "white" : "var(--c-sub)",
        }}>🎯 Exercices ({exercises.length})</button>
        <button
          onClick={importHandler}
          style={colBtnGhost}
          title={isItemsTab ? "Importer des items dans ce cours" : "Importer des exercices (append)"}
        >📥</button>
        <button
          onClick={() => lessonSlug && exportHandler(lessonSlug)}
          disabled={!lessonSlug}
          style={{ ...colBtnGhost, opacity: lessonSlug ? 1 : 0.4, cursor: lessonSlug ? 'pointer' : 'not-allowed' }}
          title={lessonSlug ? (isItemsTab ? "Exporter les items" : "Exporter les exercices") : "Cours sans slug"}
        >📤</button>
      </div>

      <MoveItemModal
        open={!!moving}
        item={moving}
        currentLessonId={lesson.id}
        modules={modules}
        lessons={allLessons}
        onClose={() => setMoving(null)}
        onConfirm={(lessonId) => moving && moveVocab(moving.id, lessonId)}
      />

      <div style={{ border: "1px solid var(--c-border)", borderRadius: 10, overflow: "hidden", background: "var(--c-bg)" }}>
        {tab === "items" ? (
          <ItemsTab
            vocab={vocab}
            editing={editing}
            setEditing={setEditing}
            onSave={saveVocab}
            onRemove={removeVocab}
            onUploadAudio={uploadAudio}
            onReorder={onReorderItem}
            onMove={(v) => setMoving(v)}
          />
        ) : (
          <ExercisesTab
            exercises={exercises}
            vocab={vocab}
            onCreate={createExercise}
            onUpdate={updateExercise}
            onDelete={deleteExercise}
            onReorder={reorderExercise}
          />
        )}
      </div>
    </div>
  );
}

// ── Helper : config par défaut pour une typologie donnée ────────────────────

function defaultConfigFor(typology: string, vocab: VocabRow[]): any {
  const ids = vocab.map(v => v.id);
  switch (typology) {
    case "FlashCard":
      return { vocabIds: ids.slice(0, Math.min(ids.length, 6)) };
    case "ChoixLettre":
      return {
        targetVocabId: ids[0] ?? null,
        distractorVocabIds: ids.slice(1, 3),
      };
    case "AssocierLettres":
      return { vocabIds: ids.slice(0, Math.min(ids.length, 4)) };
    case "TrouverLesPaires":
      return { vocabIds: ids.slice(0, Math.min(ids.length, 6)) };
    case "EntendreEtChoisir":
      return {
        targetVocabId: ids[0] ?? null,
        distractorVocabIds: ids.slice(1, 4),
      };
    case "VraiFaux":
      return {
        targetVocabId: ids[0] ?? null,
        proposedRomanisation: vocab[0]?.transliteration ?? "",
        isTrue: true,
      };
    case "DicterRomanisation":
      return {
        targetVocabId: ids[0] ?? null,
        distractorVocabIds: ids.slice(1, 4),
      };
    default:
      return {};
  }
}

// ── Sous-onglet : Items ──────────────────────────────────────────────────────

function ItemsTab({
  vocab, editing, setEditing, onSave, onRemove, onUploadAudio, onReorder, onMove,
}: {
  vocab: VocabRow[];
  editing: Partial<VocabRow> | null;
  setEditing: (e: Partial<VocabRow> | null) => void;
  onSave: () => void;
  onRemove: (id: string) => void;
  onUploadAudio: (id: string, file: File) => void;
  onReorder: (idx: number, dir: -1 | 1) => void;
  onMove: (v: VocabRow) => void;
}) {
  return (
    <>
      <div style={{ padding: 10, borderBottom: "1px solid var(--c-border)", display: "flex", justifyContent: "flex-end" }}>
        <button style={colBtn} title="Nouvel item" onClick={() => setEditing({ word: "", transliteration: "", translation: { fr: "" } })}>+</button>
      </div>

      <Modal open={!!editing} title={editing?.id ? "Modifier l'item" : "Nouvel item"} onClose={() => setEditing(null)} width={640}>
        {editing && (
          <>
            <div style={{ marginBottom: 14 }}>
              <label style={lbl}>Arabe (avec diacritiques) *</label>
              <input style={{ ...inp, fontFamily: 'var(--font-amiri), serif', fontSize: 18, direction: "rtl", padding: "10px 14px" }}
                autoFocus
                value={editing.word ?? ""}
                onChange={e => setEditing({ ...editing, word: e.target.value })}
                placeholder="السَّلَامُ عَلَيْكُمْ" />
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 16 }}>
              <div>
                <label style={lbl}>Romanisation</label>
                <input style={inp}
                  value={editing.transliteration ?? ""}
                  onChange={e => setEditing({ ...editing, transliteration: e.target.value })}
                  placeholder="salam 3likom" />
              </div>
              <div>
                <label style={lbl}>Français *</label>
                <input style={inp}
                  value={(editing.translation as any)?.fr ?? ""}
                  onChange={e => setEditing({ ...editing, translation: { fr: e.target.value } })}
                  placeholder="bonjour / paix sur vous" />
              </div>
            </div>
            <div style={{ display: "flex", gap: 8, justifyContent: "flex-end", paddingTop: 8, borderTop: "1px solid var(--c-border)" }}>
              <button onClick={() => setEditing(null)} style={{ padding: "8px 16px", borderRadius: 8, border: "1px solid var(--c-border)", background: "var(--c-bg)", color: "var(--c-sub)", fontSize: 13, cursor: "pointer" }}>Annuler</button>
              <button onClick={onSave} disabled={!editing.word} style={{ padding: "8px 18px", borderRadius: 8, border: "none", background: "#58cc02", color: "white", fontWeight: 800, fontSize: 13, cursor: "pointer", opacity: !editing.word ? 0.5 : 1 }}>
                {editing.id ? "💾 Enregistrer" : "➕ Créer + lier au cours"}
              </button>
            </div>
          </>
        )}
      </Modal>

      <div style={{ flex: 1, overflow: "auto" }}>
        {vocab.length === 0 ? (
          <div style={{ padding: 30, textAlign: "center", color: "var(--c-sub)", fontSize: 12 }}>Aucun item — clique ➕</div>
        ) : vocab.map((v, idx) => (
          <ItemRow
            key={v.id}
            v={v}
            isFirst={idx === 0}
            isLast={idx === vocab.length - 1}
            onEdit={() => setEditing(v)}
            onRemove={() => onRemove(v.id)}
            onUploadAudio={(f) => onUploadAudio(v.id, f)}
            onUp={() => onReorder(idx, -1)}
            onDown={() => onReorder(idx, 1)}
            onMove={() => onMove(v)}
          />
        ))}
      </div>
    </>
  );
}

function ItemRow({
  v, isFirst, isLast, onEdit, onRemove, onUploadAudio, onUp, onDown, onMove,
}: {
  v: VocabRow;
  isFirst: boolean;
  isLast: boolean;
  onEdit: () => void;
  onRemove: () => void;
  onUploadAudio: (f: File) => void;
  onUp: () => void;
  onDown: () => void;
  onMove: () => void;
}) {
  const fileRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);

  return (
    <div style={{ ...rowBase, cursor: "default" }}>
      <div style={{ flex: 1, minWidth: 0, display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8, alignItems: "center" }}>
        <div style={{ fontSize: 18, fontFamily: "var(--font-amiri), serif", direction: "rtl", color: "var(--c-text)" }}>{v.word}</div>
        <div style={{ fontSize: 12, fontWeight: 700, color: "#58cc02", fontFamily: "monospace" }}>{v.transliteration ?? "—"}</div>
        <div style={{ fontSize: 12, color: "var(--c-sub)" }}>{fmtTr(v.translation)}</div>
      </div>
      <div style={{ display: "flex", gap: 2, alignItems: "center", flexShrink: 0 }}>
        <input ref={fileRef} type="file" accept="audio/mpeg,audio/wav,audio/mp3" style={{ display: "none" }}
          onChange={async e => {
            const f = e.target.files?.[0]; if (!f) return;
            setUploading(true);
            await onUploadAudio(f);
            setUploading(false);
            if (fileRef.current) fileRef.current.value = "";
          }} />
        {v.audioUrl ? (
          <button onClick={() => new Audio(v.audioUrl!).play().catch(() => {})}
            style={{ background: "rgba(88,204,2,0.15)", border: "1px solid #58cc02", color: "#58cc02", borderRadius: 6, fontSize: 13, padding: "3px 8px", cursor: "pointer" }} title="Écouter">▶</button>
        ) : (
          <span style={{ fontSize: 10, color: "#ff8800", fontWeight: 700 }}>⚠ pas d'audio</span>
        )}
        <button onClick={() => fileRef.current?.click()} disabled={uploading}
          style={{ background: "transparent", border: "1px solid var(--c-border)", color: "var(--c-sub)", borderRadius: 6, fontSize: 11, padding: "3px 8px", cursor: "pointer", marginRight: 4 }}
          title="Uploader audio (mp3/wav)">
          {uploading ? "⏳" : v.audioUrl ? "↻" : "🎵"}
        </button>
        <button
          onClick={onUp}
          disabled={isFirst}
          style={{ background: "transparent", border: "none", cursor: isFirst ? "default" : "pointer", fontSize: 14, color: "var(--c-sub)", padding: 3, opacity: isFirst ? 0.25 : 1 }}
          title="Monter"
        >↑</button>
        <button
          onClick={onDown}
          disabled={isLast}
          style={{ background: "transparent", border: "none", cursor: isLast ? "default" : "pointer", fontSize: 14, color: "var(--c-sub)", padding: 3, opacity: isLast ? 0.25 : 1 }}
          title="Descendre"
        >↓</button>
        <button onClick={onMove} style={{ background: "transparent", border: "none", cursor: "pointer", fontSize: 13, color: "var(--c-sub)", padding: 4 }} title="Déplacer vers un autre cours">📦</button>
        <button onClick={onEdit} style={{ background: "transparent", border: "none", cursor: "pointer", fontSize: 13, color: "var(--c-sub)", padding: 4 }} title="Éditer">✏️</button>
        <button onClick={onRemove} style={{ background: "transparent", border: "none", cursor: "pointer", fontSize: 13, color: "#ff4b4b", padding: 4 }} title="Supprimer">🗑️</button>
      </div>
    </div>
  );
}

// ── MoveItemModal : déplacer un item vers un cours d'une autre section ──────

function MoveItemModal({
  open, item, currentLessonId, modules, lessons, onClose, onConfirm,
}: {
  open: boolean;
  item: VocabRow | null;
  currentLessonId: string;
  modules: ModuleRow[];
  lessons: LessonRow[];
  onClose: () => void;
  onConfirm: (lessonId: string) => void;
}) {
  const current = lessons.find(l => l.id === currentLessonId);
  const [targetModuleId, setTargetModuleId] = useState<string>("");
  const [targetLessonId, setTargetLessonId] = useState<string>("");

  useEffect(() => {
    if (open) {
      setTargetModuleId(current?.moduleId ?? "");
      setTargetLessonId("");
    }
  }, [open, current?.moduleId]);

  const availableLessons = useMemo(
    () => lessons
      .filter(l => l.moduleId === targetModuleId && !l.isDeleted && l.id !== currentLessonId)
      .sort((a, b) => a.order - b.order || a.title.localeCompare(b.title)),
    [lessons, targetModuleId, currentLessonId],
  );

  return (
    <Modal open={open} title="Déplacer l'item" onClose={onClose} width={520}>
      {item && (
        <>
          <div style={{ marginBottom: 14, padding: 10, background: "var(--c-bg)", borderRadius: 8, border: "1px solid var(--c-border)" }}>
            <div style={{ fontSize: 11, color: "var(--c-sub)", fontWeight: 800, marginBottom: 4 }}>ITEM</div>
            <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
              <span style={{ fontSize: 18, fontFamily: "var(--font-amiri), serif", direction: "rtl" }}>{item.word}</span>
              <span style={{ fontSize: 13, fontWeight: 700, color: "#58cc02", fontFamily: "monospace" }}>{item.transliteration ?? "—"}</span>
              <span style={{ fontSize: 12, color: "var(--c-sub)" }}>{fmtTr(item.translation)}</span>
            </div>
          </div>

          <div style={{ marginBottom: 12 }}>
            <label style={lbl}>Section cible *</label>
            <select style={inp} value={targetModuleId} onChange={e => { setTargetModuleId(e.target.value); setTargetLessonId(""); }}>
              <option value="">— Sélectionner —</option>
              {modules.map(m => (
                <option key={m.id} value={m.id}>
                  {TRACK_BADGE[m.track].label} · {m.title}
                </option>
              ))}
            </select>
          </div>

          <div style={{ marginBottom: 16 }}>
            <label style={lbl}>Cours cible *</label>
            <select style={inp} value={targetLessonId} onChange={e => setTargetLessonId(e.target.value)} disabled={!targetModuleId}>
              <option value="">— Sélectionner —</option>
              {availableLessons.map(l => (
                <option key={l.id} value={l.id}>
                  #{l.order} · {l.title}{!l.isPublished ? " (brouillon)" : ""}
                </option>
              ))}
            </select>
            {targetModuleId && availableLessons.length === 0 && (
              <div style={{ fontSize: 11, color: "var(--c-sub)", marginTop: 4 }}>Aucun autre cours dans cette section.</div>
            )}
          </div>

          <div style={{ display: "flex", gap: 8, justifyContent: "flex-end", paddingTop: 8, borderTop: "1px solid var(--c-border)" }}>
            <button onClick={onClose} style={{ padding: "8px 16px", borderRadius: 8, border: "1px solid var(--c-border)", background: "var(--c-bg)", color: "var(--c-sub)", fontSize: 13, cursor: "pointer" }}>Annuler</button>
            <button
              onClick={() => targetLessonId && onConfirm(targetLessonId)}
              disabled={!targetLessonId}
              style={{ padding: "8px 18px", borderRadius: 8, border: "none", background: "#58cc02", color: "white", fontWeight: 800, fontSize: 13, cursor: targetLessonId ? "pointer" : "not-allowed", opacity: targetLessonId ? 1 : 0.5 }}
            >
              📦 Déplacer
            </button>
          </div>
        </>
      )}
    </Modal>
  );
}

// ════════════════════════════════════════════════════════════════════════════
//  Sous-onglet : Exercices (LessonExercise authored)
// ════════════════════════════════════════════════════════════════════════════

function ExercisesTab({
  exercises, vocab, onCreate, onUpdate, onDelete, onReorder,
}: {
  exercises: AuthoredExercise[];
  vocab: VocabRow[];
  onCreate: (typology: string) => void;
  onUpdate: (exId: string, patch: Partial<AuthoredExercise>) => void;
  onDelete: (exId: string) => void;
  onReorder: (idx: number, dir: -1 | 1) => void;
}) {
  const [editing, setEditing] = useState<AuthoredExercise | null>(null);
  const [showAdd, setShowAdd] = useState(false);

  return (
    <>
      <div style={{ padding: 10, borderBottom: "1px solid var(--c-border)", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div style={{ fontSize: 11, color: "var(--c-sub)" }}>
          {vocab.length === 0
            ? "⚠ Ajoute d'abord des items dans l'onglet Items"
            : `${vocab.length} item(s) disponible(s) pour les exercices`}
        </div>
        <button
          style={{ ...colBtn, opacity: vocab.length === 0 ? 0.4 : 1 }}
          disabled={vocab.length === 0}
          onClick={() => setShowAdd(true)}
          title="Ajouter un exercice"
        >+</button>
      </div>

      <Modal open={showAdd} title="Ajouter une étape" onClose={() => setShowAdd(false)} width={620}>
        <div style={{ fontSize: 12, color: "var(--c-sub)", marginBottom: 16 }}>
          Choisis une étape. Tu pourras ensuite éditer son contenu (mots à afficher, distracteurs, etc.).
        </div>

        {/* Présentation (introduction sans test) */}
        <div style={{ fontSize: 10, fontWeight: 800, color: "var(--c-sub)", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 6 }}>
          📚 Présentation (introduit un mot, pas de test)
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 8, marginBottom: 18 }}>
          {EXERCISE_TYPES.filter(t => t.key === "FlashCard").map(t => (
            <TypologyCard key={t.key} t={t} onPick={() => { onCreate(t.key); setShowAdd(false); }} />
          ))}
        </div>

        {/* Exercices de test */}
        <div style={{ fontSize: 10, fontWeight: 800, color: "var(--c-sub)", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 6 }}>
          🎯 Exercices de test
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 8 }}>
          {EXERCISE_TYPES.filter(t => t.key !== "FlashCard").map(t => (
            <TypologyCard key={t.key} t={t} onPick={() => { onCreate(t.key); setShowAdd(false); }} />
          ))}
        </div>
      </Modal>

      {editing && (
        <ExerciseConfigModal
          exercise={editing}
          vocab={vocab}
          onClose={() => setEditing(null)}
          onSave={(patch) => { onUpdate(editing.id, patch); setEditing(null); }}
        />
      )}

      <div style={{ flex: 1, overflow: "auto", padding: 8 }}>
        {exercises.length === 0 ? (
          <div style={{ padding: 30, textAlign: "center", color: "var(--c-sub)", fontSize: 12 }}>
            Aucun exercice — clique ➕ pour en ajouter
          </div>
        ) : exercises.map((ex, idx) => {
          const t = EXERCISE_REGISTRY[ex.typology];
          const summary = summarizeConfig(ex.typology, ex.config, vocab);
          return (
            <div key={ex.id} style={{
              display: "flex", alignItems: "center", gap: 8,
              padding: "10px 12px", marginBottom: 6,
              background: t ? "var(--c-card)" : "rgba(255,75,75,0.08)",
              border: `1px solid ${t ? "var(--c-border)" : "#ff4b4b"}`,
              borderRadius: 8,
            }}>
              <span style={{ fontSize: 11, fontWeight: 800, color: "var(--c-sub)", minWidth: 18 }}>{idx + 1}.</span>
              <span style={{ fontSize: 18 }}>{t?.icon ?? "❓"}</span>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontWeight: 800, fontSize: 13, color: "var(--c-text)" }}>
                  {t?.label ?? ex.typology}
                  {!t && <span style={{ color: "#ff4b4b", fontSize: 10, marginLeft: 6 }}>(typologie inconnue)</span>}
                </div>
                <div style={{ fontSize: 11, color: "var(--c-sub)", marginTop: 2, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                  {summary || "— config vide"}
                </div>
              </div>
              <div style={{ display: "flex", gap: 2, alignItems: "center", flexShrink: 0 }}>
                <button
                  onClick={() => onReorder(idx, -1)}
                  disabled={idx === 0}
                  style={{ background: "transparent", border: "none", cursor: idx === 0 ? "default" : "pointer", color: "var(--c-sub)", fontSize: 14, opacity: idx === 0 ? 0.3 : 1 }}
                  title="Monter"
                >↑</button>
                <button
                  onClick={() => onReorder(idx, 1)}
                  disabled={idx === exercises.length - 1}
                  style={{ background: "transparent", border: "none", cursor: idx === exercises.length - 1 ? "default" : "pointer", color: "var(--c-sub)", fontSize: 14, opacity: idx === exercises.length - 1 ? 0.3 : 1 }}
                  title="Descendre"
                >↓</button>
                <button onClick={() => setEditing(ex)} style={{ background: "transparent", border: "none", cursor: "pointer", color: "var(--c-sub)", fontSize: 13, padding: 4 }} title="Éditer le contenu">✏️</button>
                <button onClick={() => onDelete(ex.id)} style={{ background: "transparent", border: "none", cursor: "pointer", color: "#ff4b4b", fontSize: 13, padding: 4 }} title="Supprimer">🗑️</button>
              </div>
            </div>
          );
        })}
      </div>
    </>
  );
}

// Carte cliquable d'une typologie dans le picker "Ajouter une étape"
function TypologyCard({
  t, onPick,
}: {
  t: { key: string; icon: string; label: string; description: string; minItems: number };
  onPick: () => void;
}) {
  return (
    <button
      onClick={onPick}
      style={{
        padding: "10px 12px", borderRadius: 8, border: "1px solid var(--c-border)",
        background: "var(--c-bg)", color: "var(--c-text)", textAlign: "left",
        cursor: "pointer", fontSize: 12, display: "flex", flexDirection: "column", gap: 4,
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
        <span style={{ fontSize: 18 }}>{t.icon}</span>
        <span style={{ fontWeight: 800, fontSize: 13 }}>{t.label}</span>
      </div>
      <div style={{ fontSize: 10, color: "var(--c-sub)", lineHeight: 1.3 }}>{t.description}</div>
      <div style={{ fontSize: 9, color: "var(--c-sub)", fontWeight: 700, textTransform: "uppercase" }}>min. {t.minItems} item(s)</div>
    </button>
  );
}

// Résumé compact d'une config pour l'affichage en liste
function summarizeConfig(typology: string, config: any, vocab: VocabRow[]): string {
  const labelOf = (id: string) => {
    const v = vocab.find(x => x.id === id);
    return v?.transliteration || v?.word || id.slice(0, 6);
  };
  const cfg = config ?? {};
  switch (typology) {
    case "FlashCard":
    case "AssocierLettres":
    case "TrouverLesPaires": {
      const ids: string[] = Array.isArray(cfg.vocabIds) ? cfg.vocabIds : [];
      return `${ids.length} mot(s) : ${ids.slice(0, 4).map(labelOf).join(", ")}${ids.length > 4 ? "…" : ""}`;
    }
    case "ChoixLettre":
    case "EntendreEtChoisir":
    case "DicterRomanisation": {
      const target = cfg.targetVocabId ? labelOf(cfg.targetVocabId) : "—";
      const dist: string[] = Array.isArray(cfg.distractorVocabIds) ? cfg.distractorVocabIds : [];
      return `cible: ${target} · ${dist.length} distracteur(s)`;
    }
    case "VraiFaux": {
      const target = cfg.targetVocabId ? labelOf(cfg.targetVocabId) : "—";
      return `${target} ↔ "${cfg.proposedRomanisation ?? ""}" · ${cfg.isTrue ? "VRAI" : "FAUX"}`;
    }
    default:
      return "";
  }
}

// ════════════════════════════════════════════════════════════════════════════
//  Modal d'édition d'une config d'exercice (dispatché par typologie)
// ════════════════════════════════════════════════════════════════════════════

function ExerciseConfigModal({
  exercise, vocab, onClose, onSave,
}: {
  exercise: AuthoredExercise;
  vocab: VocabRow[];
  onClose: () => void;
  onSave: (patch: Partial<AuthoredExercise>) => void;
}) {
  const [local, setLocal] = useState<any>(exercise.config ?? {});
  const t = EXERCISE_REGISTRY[exercise.typology];

  const dirty = JSON.stringify(local) !== JSON.stringify(exercise.config ?? {});

  return (
    <Modal
      open
      title={`${t?.icon ?? ""} ${t?.label ?? exercise.typology} — éditer le contenu`}
      onClose={onClose}
      width={720}
    >
      {vocab.length === 0 ? (
        <div style={{ padding: 30, textAlign: "center", color: "var(--c-sub)", fontSize: 13 }}>
          Aucun item disponible. Ajoute d'abord des mots dans l'onglet Items.
        </div>
      ) : (
        <>
          <ExerciseConfigEditor typology={exercise.typology} config={local} vocab={vocab} onChange={setLocal} />
          <div style={{ marginTop: 18, paddingTop: 14, borderTop: "1px dashed var(--c-border)" }}>
            <label style={lbl}>Titre de l'exercice (optionnel)</label>
            <input
              style={inp}
              value={local?.prompt ?? ""}
              onChange={(e) => setLocal({ ...local, prompt: e.target.value })}
              placeholder="ex. Que signifie ce mot en arabe ?"
            />
            <div style={{ fontSize: 11, color: "var(--c-sub)", marginTop: 4 }}>
              Affiché en haut de l'exercice. Si vide, un texte générique est utilisé.
            </div>
          </div>
        </>
      )}
      <div style={{ display: "flex", gap: 8, justifyContent: "flex-end", paddingTop: 12, marginTop: 14, borderTop: "1px solid var(--c-border)" }}>
        <button onClick={onClose} style={{ padding: "8px 16px", borderRadius: 8, border: "1px solid var(--c-border)", background: "var(--c-bg)", color: "var(--c-sub)", fontSize: 13, cursor: "pointer" }}>Annuler</button>
        <button
          onClick={() => onSave({ config: local })}
          disabled={!dirty}
          style={{ padding: "8px 18px", borderRadius: 8, border: "none", background: "#58cc02", color: "white", fontWeight: 800, fontSize: 13, cursor: dirty ? "pointer" : "default", opacity: dirty ? 1 : 0.4 }}
        >💾 Enregistrer</button>
      </div>
    </Modal>
  );
}

// ── Dispatcher : éditeur par typologie ─────────────────────────────────────

function ExerciseConfigEditor({
  typology, config, vocab, onChange,
}: {
  typology: string;
  config: any;
  vocab: VocabRow[];
  onChange: (cfg: any) => void;
}) {
  const cfg = config ?? {};

  switch (typology) {
    case "FlashCard":
    case "AssocierLettres":
    case "TrouverLesPaires": {
      const ids: string[] = Array.isArray(cfg.vocabIds) ? cfg.vocabIds : [];
      const min = EXERCISE_REGISTRY[typology]?.minItems ?? 1;
      return (
        <>
          <div style={{ fontSize: 12, color: "var(--c-sub)", marginBottom: 10 }}>
            Choisis les mots à afficher dans cet exercice. <strong>Minimum : {min}</strong>
          </div>
          <VocabMultiPicker vocab={vocab} selected={ids} onChange={(next) => onChange({ ...cfg, vocabIds: next })} />
          <div style={{ fontSize: 11, color: ids.length < min ? "#ff4b4b" : "var(--c-sub)", marginTop: 8, fontWeight: 700 }}>
            {ids.length} sélectionné(s) {ids.length < min && `· ${min - ids.length} manquant(s)`}
          </div>
        </>
      );
    }
    case "ChoixLettre":
    case "EntendreEtChoisir":
    case "DicterRomanisation": {
      const target: string | null = cfg.targetVocabId ?? null;
      const distractors: string[] = Array.isArray(cfg.distractorVocabIds) ? cfg.distractorVocabIds : [];
      const distractorPool = vocab.filter(v => v.id !== target);
      const minDist = typology === "ChoixLettre" ? 2 : 3;
      return (
        <>
          <div style={{ marginBottom: 14 }}>
            <label style={lbl}>Mot cible (bonne réponse) *</label>
            <VocabSinglePicker vocab={vocab} selected={target} onChange={(id) => onChange({ ...cfg, targetVocabId: id, distractorVocabIds: distractors.filter(d => d !== id) })} />
          </div>
          <div>
            <label style={lbl}>Distracteurs (mauvaises réponses) — min {minDist}</label>
            <VocabMultiPicker vocab={distractorPool} selected={distractors} onChange={(next) => onChange({ ...cfg, distractorVocabIds: next })} />
            <div style={{ fontSize: 11, color: distractors.length < minDist ? "#ff4b4b" : "var(--c-sub)", marginTop: 6, fontWeight: 700 }}>
              {distractors.length} distracteur(s) {distractors.length < minDist && `· ${minDist - distractors.length} manquant(s)`}
            </div>
          </div>
        </>
      );
    }
    case "VraiFaux": {
      const target:   string | null = cfg.targetVocabId ?? null;
      const proposed: string | null = cfg.proposedVocabId ?? null;
      const targetVocab   = vocab.find(v => v.id === target);
      const proposedVocab = vocab.find(v => v.id === proposed);
      const bothSelected  = !!target && !!proposed;
      const willBeTrue    = bothSelected && target === proposed;
      return (
        <>
          <div style={{ marginBottom: 14 }}>
            <label style={lbl}>Mot affiché (le mot arabe que l'utilisateur voit) *</label>
            <VocabSinglePicker vocab={vocab} selected={target} onChange={(id) => onChange({ ...cfg, targetVocabId: id })} />
            {targetVocab && (
              <div style={{ marginTop: 6, fontSize: 11, color: "var(--c-sub)" }}>
                Romanisation correcte : <code style={{ color: "#58cc02", fontWeight: 700 }}>{targetVocab.transliteration ?? "—"}</code>
              </div>
            )}
          </div>
          <div style={{ marginBottom: 14 }}>
            <label style={lbl}>Mot proposé (la romanisation que l'utilisateur doit valider) *</label>
            <VocabSinglePicker vocab={vocab} selected={proposed} onChange={(id) => onChange({ ...cfg, proposedVocabId: id })} />
            {proposedVocab && (
              <div style={{ marginTop: 6, fontSize: 11, color: "var(--c-sub)" }}>
                Romanisation affichée : <code style={{ color: willBeTrue ? "#58cc02" : "#ff4b4b", fontWeight: 700 }}>{proposedVocab.transliteration ?? "—"}</code>
              </div>
            )}
          </div>
          {bothSelected && (
            <div style={{
              padding: "10px 12px", borderRadius: 8,
              border: `2px solid ${willBeTrue ? "#58cc02" : "#ff4b4b"}`,
              background: willBeTrue ? "rgba(88,204,2,0.10)" : "rgba(255,75,75,0.08)",
              fontSize: 12, color: willBeTrue ? "#46a302" : "#ff4b4b",
              fontWeight: 800, textAlign: "center",
            }}>
              {willBeTrue
                ? "✓ Association VRAIE (les 2 mots sont identiques) — bonne réponse attendue : VRAI"
                : "✗ Association FAUSSE (les 2 mots diffèrent) — bonne réponse attendue : FAUX"}
            </div>
          )}
          {!bothSelected && (
            <div style={{ fontSize: 11, color: "var(--c-sub)", textAlign: "center", padding: 8 }}>
              Sélectionne les 2 mots pour voir si l'association sera VRAIE ou FAUSSE.
            </div>
          )}
        </>
      );
    }
    default:
      return (
        <div style={{ padding: 20, textAlign: "center", color: "var(--c-sub)", fontSize: 12 }}>
          Typologie <code>{typology}</code> non gérée par l'éditeur.
        </div>
      );
  }
}

// ── Picker vocab : sélecteur unique ────────────────────────────────────────

function VocabSinglePicker({
  vocab, selected, onChange,
}: {
  vocab: VocabRow[];
  selected: string | null;
  onChange: (id: string) => void;
}) {
  return (
    <select
      style={inp}
      value={selected ?? ""}
      onChange={(e) => onChange(e.target.value)}
    >
      <option value="">— choisir un mot —</option>
      {vocab.map(v => (
        <option key={v.id} value={v.id}>
          {v.word} {v.transliteration ? `· ${v.transliteration}` : ""} {fmtTr(v.translation) ? `· ${fmtTr(v.translation)}` : ""}
        </option>
      ))}
    </select>
  );
}

// ── Picker vocab : sélecteur multiple (grille de cartes cliquables) ───────

function VocabMultiPicker({
  vocab, selected, onChange,
}: {
  vocab: VocabRow[];
  selected: string[];
  onChange: (next: string[]) => void;
}) {
  const sel = new Set(selected);
  function toggle(id: string) {
    const next = new Set(sel);
    if (next.has(id)) next.delete(id); else next.add(id);
    onChange([...next]);
  }
  return (
    <div style={{
      display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
      gap: 6, maxHeight: 320, overflow: "auto", padding: 4,
      border: "1px solid var(--c-border)", borderRadius: 8, background: "var(--c-bg)",
    }}>
      {vocab.map(v => {
        const active = sel.has(v.id);
        return (
          <button
            key={v.id}
            type="button"
            onClick={() => toggle(v.id)}
            style={{
              padding: "8px 10px", borderRadius: 8, cursor: "pointer", textAlign: "left",
              border: "2px solid", borderColor: active ? "#58cc02" : "var(--c-border)",
              background: active ? "rgba(88,204,2,0.12)" : "var(--c-card)",
              display: "flex", flexDirection: "column", gap: 2,
            }}
          >
            <div style={{ fontFamily: "var(--font-amiri), serif", fontSize: 16, direction: "rtl", color: "var(--c-text)" }}>{v.word}</div>
            <div style={{ fontSize: 11, color: active ? "#46a302" : "var(--c-sub)", fontFamily: "monospace", fontWeight: 700 }}>
              {v.transliteration ?? "—"}
            </div>
            <div style={{ fontSize: 10, color: "var(--c-sub)" }}>{fmtTr(v.translation)}</div>
          </button>
        );
      })}
    </div>
  );
}
