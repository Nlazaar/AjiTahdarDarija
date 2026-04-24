"use client";

import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { EXERCISE_TYPES, EXERCISE_REGISTRY } from "@/lib/exerciseRegistry";
import ExercisePreview from "@/components/exercises/ExercisePreview";
import { MOROCCO_CITIES } from "@/data/morocco-cities";
import { ConfirmProvider, useConfirm } from "@/components/ConfirmDialog";
import { SortableList, DragHandle } from "@/components/admin/SortableList";
import ArabicKeyboard from "@/components/admin/ArabicKeyboard";

// ── Types ────────────────────────────────────────────────────────────────────

type Track = "DARIJA" | "MSA" | "RELIGION";

interface CityInfo {
  cityKey?: string;
  emoji?: string;
  /** Bandeau de section (CityCard). Toujours visible. */
  photoUrl?: string;
  /** Carte postale (CartePostalePanel), révélée à 100%. Fallback → photoUrl. */
  postcardUrl?: string;
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
  isPublished?: boolean;
}

interface Language { id: string; code: string; name: string }

interface AuthoredExercise {
  id: string;
  lessonId: string;
  order: number;
  typology: string;
  config: any;
  isPublished?: boolean;
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
  RELIGION: { label: "☪︎ Religion", color: "#a855f7" },
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
      style={{
        position: "fixed", inset: 0, zIndex: 1000,
        background: "rgba(0,0,0,0.55)", backdropFilter: "blur(3px)",
        display: "flex", alignItems: "center", justifyContent: "center",
        padding: 20,
      }}
    >
      <div
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

// ── Photo uploader ──────────────────────────────────────────────────────────

function PhotoUploader({
  moduleId,
  photoUrl,
  kind = "section",
  onUploaded,
  onError,
}: {
  moduleId?: string;
  photoUrl: string;
  kind?: "section" | "postcard";
  onUploaded: (url: string) => void;
  onError: (msg: string) => void;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(false);
  const disabled = !moduleId;
  const label = kind === "postcard" ? "Carte postale" : "Photo";

  async function handleFile(file: File) {
    if (!moduleId) return;
    if (file.size > 5 * 1024 * 1024) {
      onError(`${label}: fichier > 5 Mo`);
      return;
    }
    setBusy(true);
    try {
      const fd = new FormData();
      fd.append("file", file);
      const r = await fetch(`/api/admin/modules/${moduleId}/photo?kind=${kind}`, {
        method: "POST",
        credentials: "include",
        body: fd,
      });
      const data = await r.json().catch(() => ({}));
      if (!r.ok) throw new Error(data?.message || data?.error || `HTTP ${r.status}`);
      onUploaded(data.url);
    } catch (e: any) {
      onError(`${label}: ${e.message}`);
    } finally {
      setBusy(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  }

  return (
    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
      {photoUrl ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={photoUrl}
          alt="Photo ville"
          style={{
            width: 64, height: 48, objectFit: "cover",
            borderRadius: 8, border: "1px solid var(--c-border)",
            flexShrink: 0,
          }}
        />
      ) : (
        <div style={{
          width: 64, height: 48, borderRadius: 8,
          border: "1px dashed var(--c-border)",
          display: "flex", alignItems: "center", justifyContent: "center",
          color: "var(--c-sub)", fontSize: 10, flexShrink: 0,
        }}>—</div>
      )}
      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp,image/avif"
        style={{ display: "none" }}
        onChange={e => {
          const f = e.target.files?.[0];
          if (f) handleFile(f);
        }}
      />
      <button
        type="button"
        disabled={disabled || busy}
        onClick={() => inputRef.current?.click()}
        style={{
          padding: "8px 12px", borderRadius: 8,
          border: "1px solid var(--c-border)", background: "var(--c-card)",
          color: disabled ? "var(--c-sub)" : "var(--c-text)",
          fontSize: 12, fontWeight: 700,
          cursor: disabled ? "not-allowed" : "pointer",
          opacity: busy ? 0.6 : 1,
        }}
      >
        {busy ? "Upload…" : photoUrl ? "Remplacer" : "Choisir une image"}
      </button>
      {disabled && (
        <span style={{ fontSize: 10, color: "var(--c-sub)" }}>
          Enregistre la section d'abord
        </span>
      )}
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
  return (
    <ConfirmProvider>
      <AdminContenuInner />
    </ConfirmProvider>
  );
}

function AdminContenuInner() {
  const [modules, setModules] = useState<ModuleRow[]>([]);
  const [lessons, setLessons] = useState<LessonRow[]>([]);
  const [vocab, setVocab] = useState<VocabRow[]>([]);
  const [languages, setLanguages] = useState<Language[]>([]);
  const [trackFilter, setTrackFilter] = useState<Track | "ALL">("ALL");
  const [search, setSearch] = useState("");
  const [selectedModuleId, setSelectedModuleId] = useState<string | null>(null);
  const [selectedLessonId, setSelectedLessonId] = useState<string | null>(null);
  const [msg, setMsg] = useState<{ ok: boolean; text: string } | null>(null);
  const [io, setIo] = useState<{ mode: IoMode; kind: IoKind; slug: string | null } | null>(null);
  const [revisionModal, setRevisionModal] = useState<{ moduleId: string; moduleTitle: string; initialPosition: "MIDDLE" | "END"; initialAnchor: number | null } | null>(null);
  const [revisionsTick, setRevisionsTick] = useState(0);

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
      const vs = await api<VocabRow[]>(`/api/admin/vocabulary?lessonId=${encodeURIComponent(lessonId)}&includeDrafts=1`);
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

  // Reset sélection si le module actif ne correspond plus au filtre de track
  useEffect(() => {
    if (!selectedModuleId) return;
    const mod = modules.find(m => m.id === selectedModuleId);
    if (!mod) return;
    if (trackFilter !== "ALL" && mod.track !== trackFilter) {
      setSelectedModuleId(null);
      setSelectedLessonId(null);
      setVocab([]);
    }
  }, [trackFilter, selectedModuleId, modules]);

  // Si la leçon sélectionnée n'appartient plus au module actif, la reset
  useEffect(() => {
    if (!selectedLessonId) return;
    const lesson = lessons.find(l => l.id === selectedLessonId);
    if (!lesson) return;
    if (selectedModuleId && lesson.moduleId !== selectedModuleId) {
      setSelectedLessonId(null);
      setVocab([]);
    }
  }, [selectedModuleId, selectedLessonId, lessons]);

  // Derived lists
  const searchNorm = useMemo(() => search.trim().toLowerCase(), [search]);

  const lessonMatches = useCallback((l: LessonRow) => {
    if (!searchNorm) return false;
    return (l.title ?? "").toLowerCase().includes(searchNorm)
      || (l.slug ?? "").toLowerCase().includes(searchNorm);
  }, [searchNorm]);

  const moduleMatches = useCallback((m: ModuleRow) => {
    if (!searchNorm) return true;
    const self =
      (m.title ?? "").toLowerCase().includes(searchNorm)
      || (m.titleAr ?? "").toLowerCase().includes(searchNorm)
      || (m.subtitle ?? "").toLowerCase().includes(searchNorm)
      || (m.slug ?? "").toLowerCase().includes(searchNorm);
    if (self) return true;
    return lessons.some(l => l.moduleId === m.id && !l.isDeleted && lessonMatches(l));
  }, [searchNorm, lessons, lessonMatches]);

  const filteredModules = useMemo(() => {
    return modules
      .filter(m => trackFilter === "ALL" || m.track === trackFilter)
      .filter(moduleMatches)
      .sort((a, b) => a.track.localeCompare(b.track) || a.canonicalOrder - b.canonicalOrder || a.level - b.level);
  }, [modules, trackFilter, moduleMatches]);

  const moduleLessons = useMemo(() => {
    if (!selectedModuleId) return [];
    const all = lessons
      .filter(l => l.moduleId === selectedModuleId && !l.isDeleted)
      .sort((a, b) => a.order - b.order || a.title.localeCompare(b.title));
    if (!searchNorm) return all;
    const mod = modules.find(m => m.id === selectedModuleId);
    const moduleSelfMatches = !!mod && (
      (mod.title ?? "").toLowerCase().includes(searchNorm)
      || (mod.titleAr ?? "").toLowerCase().includes(searchNorm)
      || (mod.subtitle ?? "").toLowerCase().includes(searchNorm)
      || (mod.slug ?? "").toLowerCase().includes(searchNorm)
    );
    if (moduleSelfMatches) return all;
    return all.filter(lessonMatches);
  }, [lessons, selectedModuleId, searchNorm, modules, lessonMatches]);

  const selectedLesson = useMemo(
    () => lessons.find(l => l.id === selectedLessonId) ?? null,
    [lessons, selectedLessonId],
  );

  // ── Réordonnancement : sections (modules) ────────────────────────────────
  // On PATCH chaque module avec son index final dans la liste fournie.
  const reorderModules = useCallback(async (orderedIds: string[]) => {
    try {
      await Promise.all(
        orderedIds.map((id, order) =>
          api(`/api/admin/modules/${id}`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ canonicalOrder: order }),
          }),
        ),
      );
      reloadModules();
      flash(true, "Sections réordonnées ✓");
    } catch (e: any) { flash(false, `Réordonner: ${e.message}`); }
  }, [reloadModules, flash]);

  // ── Réordonnancement : cours (lessons) ───────────────────────────────────
  const reorderLessons = useCallback(async (orderedIds: string[]) => {
    try {
      await Promise.all(
        orderedIds.map((id, order) =>
          api(`/api/admin/lessons/${id}`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ order }),
          }),
        ),
      );
      reloadLessons();
      flash(true, "Cours réordonnés ✓");
    } catch (e: any) { flash(false, `Réordonner: ${e.message}`); }
  }, [reloadLessons, flash]);

  // ── Réordonnancement : items (vocab) via Lesson.content.vocabOrder ──────
  const reorderItems = useCallback(async (orderedIds: string[]) => {
    if (!selectedLessonId) return;
    try {
      await api(`/api/admin/lessons/${selectedLessonId}/vocab-order`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orderedIds }),
      });
      reloadVocab(selectedLessonId);
      flash(true, "Items réordonnés ✓");
    } catch (e: any) { flash(false, `Réordonner: ${e.message}`); }
  }, [selectedLessonId, reloadVocab, flash]);

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
          padding: 0 16px 16px;
          overflow: hidden;
          background: var(--c-bg);
          z-index: 50;
          display: flex;
          flex-direction: column;
        }
        @media (min-width: 768px) {
          .admin-contenu-fullscreen { left: 260px; }
        }
        .admin-contenu-sticky {
          flex-shrink: 0;
          background: var(--c-bg);
          padding: 20px 0 8px;
          margin: 0 -16px;
          padding-left: 16px;
          padding-right: 16px;
          border-bottom: 1px solid var(--c-border);
          margin-bottom: 12px;
        }
        .admin-contenu-grid {
          flex: 1;
          min-height: 0;
          overflow: hidden;
        }
        .admin-contenu-grid > * {
          height: 100%;
          min-height: 0;
          max-height: 100%;
        }
      `}</style>
      <style jsx global>{`
        .col-scroll {
          scrollbar-width: thin;
          scrollbar-color: rgba(127,127,127,0.5) transparent;
        }
        .col-scroll::-webkit-scrollbar {
          width: 10px;
          height: 10px;
        }
        .col-scroll::-webkit-scrollbar-track {
          background: rgba(127,127,127,0.08);
          border-radius: 6px;
        }
        .col-scroll::-webkit-scrollbar-thumb {
          background: rgba(127,127,127,0.45);
          border-radius: 6px;
          border: 2px solid transparent;
          background-clip: padding-box;
        }
        .col-scroll::-webkit-scrollbar-thumb:hover {
          background: rgba(127,127,127,0.75);
          background-clip: padding-box;
        }
      `}</style>
      <div className="admin-contenu-sticky">
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

      {/* Track filter + recherche */}
      <div style={{ display: "flex", gap: 10, marginBottom: 12, flexWrap: "wrap", alignItems: "center" }}>
        <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
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
        <div style={{ position: "relative", flex: 1, minWidth: 240, maxWidth: 360 }}>
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="🔍 Rechercher un cours ou une leçon…"
            style={{
              width: "100%",
              padding: "6px 30px 6px 12px",
              borderRadius: 8,
              border: "1.5px solid var(--c-border)",
              background: "var(--c-bg)",
              color: "var(--c-text)",
              fontSize: 12,
              outline: "none",
            }}
          />
          {search && (
            <button
              onClick={() => setSearch("")}
              title="Effacer"
              style={{
                position: "absolute", right: 6, top: "50%", transform: "translateY(-50%)",
                background: "transparent", border: "none", cursor: "pointer",
                color: "var(--c-sub)", fontSize: 14, padding: "2px 6px",
              }}
            >✕</button>
          )}
        </div>
        {searchNorm && (
          <span style={{ fontSize: 11, color: "var(--c-sub)", fontWeight: 700 }}>
            {filteredModules.length} cours trouvé{filteredModules.length > 1 ? "s" : ""}
          </span>
        )}
      </div>
      </div>

      {/* 3 colonnes : Sections · Cours · Items+Exercices.
          Chaque colonne scrolle indépendamment (v. .admin-contenu-grid). */}
      <div className="admin-contenu-grid" style={{
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
        alignItems: "stretch",
      }}>
        <SectionsColumn
          modules={filteredModules}
          languages={languages}
          selectedId={selectedModuleId}
          onSelect={(id) => { setSelectedModuleId(id); setSelectedLessonId(null); }}
          onChanged={() => { reloadModules(); flash(true, "Section sauvegardée ✓"); }}
          onError={(t) => flash(false, t)}
          onReorder={reorderModules}
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
            moduleTitle={modules.find(m => m.id === selectedModuleId)?.title ?? ""}
            selectedId={selectedLessonId}
            trackFilter={trackFilter}
            onSelect={(id) => setSelectedLessonId(id)}
            onChanged={() => { reloadLessons(); flash(true, "Leçon sauvegardée ✓"); }}
            onModulesChanged={() => reloadModules()}
            onError={(t) => flash(false, t)}
            onReorder={reorderLessons}
            onImport={() => setIo({ mode: 'import', kind: 'lessons', slug: null })}
            onExport={(slug) => setIo({ mode: 'export', kind: 'lessons', slug })}
            onOpenRevision={(mid, mtitle, pos, initialAnchor) => setRevisionModal({ moduleId: mid, moduleTitle: mtitle, initialPosition: pos, initialAnchor: initialAnchor ?? null })}
            revisionsTick={revisionsTick}
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
            onReorderItem={reorderItems}
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

      <RevisionsEditorModal
        moduleId={revisionModal?.moduleId ?? null}
        moduleTitle={revisionModal?.moduleTitle ?? ""}
        initialPosition={revisionModal?.initialPosition ?? "MIDDLE"}
        initialAnchor={revisionModal?.initialAnchor ?? null}
        moduleLessons={revisionModal ? lessons.filter(l => l.moduleId === revisionModal.moduleId && !l.isDeleted).sort((a, b) => a.order - b.order) : []}
        open={!!revisionModal}
        onClose={() => { setRevisionModal(null); setRevisionsTick(t => t + 1); }}
        onError={(t) => flash(false, t)}
      />
    </div>
  );
}

// ════════════════════════════════════════════════════════════════════════════
//  Révisions — éditeur (2 positions: MIDDLE + END) pour une section
// ════════════════════════════════════════════════════════════════════════════

type RevPos = "MIDDLE" | "END";

interface RevisionTurn {
  speaker: "A" | "B";
  darija: string;
  french: string;
  transliteration?: string;
  audioUrl?: string;
}

type RevKind = "conversation" | "exercises";

interface RevisionExerciseDraft {
  typology: string;
  config: any;
  isPublished: boolean;
}

interface RevisionDraft {
  id?: string;
  position: RevPos;
  title: string;
  isPublished: boolean;
  kind: RevKind;
  setting: string;
  theme: string;
  turns: RevisionTurn[];
  exercises: RevisionExerciseDraft[];
  exists: boolean;
  anchorAfterOrder: number | null;
}

function emptyDraft(position: RevPos): RevisionDraft {
  return {
    position,
    title: position === "MIDDLE" ? "Pause — Mini-conversation" : "Révision finale — Conversation complète",
    isPublished: false,
    kind: "conversation",
    setting: "",
    theme: "",
    turns: [
      { speaker: "A", darija: "", french: "", transliteration: "" },
      { speaker: "B", darija: "", french: "", transliteration: "" },
    ],
    exercises: [],
    exists: false,
    anchorAfterOrder: null,
  };
}

function RevisionsEditorModal({
  moduleId, moduleTitle, open, onClose, onError, initialPosition = "MIDDLE", initialAnchor = null, moduleLessons = [],
}: {
  moduleId: string | null;
  moduleTitle: string;
  open: boolean;
  onClose: () => void;
  onError: (text: string) => void;
  initialPosition?: RevPos;
  initialAnchor?: number | null;
  moduleLessons?: LessonRow[];
}) {
  const [drafts, setDrafts] = useState<Record<RevPos, RevisionDraft>>({
    MIDDLE: emptyDraft("MIDDLE"),
    END: emptyDraft("END"),
  });
  const [active, setActive] = useState<RevPos>(initialPosition);
  const [vocabByLesson, setVocabByLesson] = useState<Record<string, VocabRow[]>>({});

  useEffect(() => {
    if (open) setActive(initialPosition);
  }, [open, initialPosition]);

  useEffect(() => {
    if (!open || moduleLessons.length === 0) { setVocabByLesson({}); return; }
    let cancelled = false;
    (async () => {
      try {
        const results = await Promise.all(
          moduleLessons.map(async (l) => {
            try {
              const v = await api<VocabRow[]>(`/api/admin/vocabulary?lessonId=${encodeURIComponent(l.id)}&includeDrafts=1`);
              return [l.id, Array.isArray(v) ? v : []] as const;
            } catch {
              return [l.id, [] as VocabRow[]] as const;
            }
          }),
        );
        if (cancelled) return;
        const map: Record<string, VocabRow[]> = {};
        for (const [id, v] of results) map[id] = v;
        setVocabByLesson(map);
      } catch {
        if (!cancelled) setVocabByLesson({});
      }
    })();
    return () => { cancelled = true; };
  }, [open, moduleId, moduleLessons]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState<RevPos | null>(null);
  const [banner, setBanner] = useState<{ type: "ok" | "error"; text: string } | null>(null);
  const askConfirm = useConfirm();

  useEffect(() => {
    if (!banner) return;
    const t = setTimeout(() => setBanner(null), banner.type === "error" ? 4500 : 2500);
    return () => clearTimeout(t);
  }, [banner]);

  useEffect(() => {
    if (!open || !moduleId) return;
    let cancelled = false;
    (async () => {
      setLoading(true);
      try {
        const list = await api<any[]>(`/api/admin/modules/${moduleId}/revisions`);
        if (cancelled) return;
        const next: Record<RevPos, RevisionDraft> = {
          MIDDLE: emptyDraft("MIDDLE"),
          END: emptyDraft("END"),
        };
        // Pré-remplit l'ancrage de la position ouverte si l'admin a déjà choisi
        // une position localement avant la première sauvegarde.
        if (initialAnchor !== null && initialAnchor !== undefined) {
          next[initialPosition] = { ...next[initialPosition], anchorAfterOrder: initialAnchor };
        }
        for (const r of list ?? []) {
          const pos = r.position as RevPos;
          if (pos !== "MIDDLE" && pos !== "END") continue;
          const c = r.content ?? {};
          const isExercisesKind = c?.kind === "exercises" || Array.isArray(c?.exercises);
          next[pos] = {
            id: r.id,
            position: pos,
            title: r.title ?? next[pos].title,
            isPublished: !!r.isPublished,
            kind: isExercisesKind ? "exercises" : "conversation",
            setting: c.setting ?? "",
            theme: c.theme ?? "",
            turns: Array.isArray(c.turns) && c.turns.length
              ? c.turns.map((t: any) => ({
                  speaker: t.speaker === "B" ? "B" : "A",
                  darija: t.darija ?? "",
                  french: t.french ?? "",
                  transliteration: t.transliteration ?? "",
                  audioUrl: t.audioUrl ?? "",
                }))
              : next[pos].turns,
            exercises: Array.isArray(c.exercises)
              ? c.exercises.map((ex: any) => ({
                  typology: String(ex?.typology ?? ""),
                  config: ex?.config ?? {},
                  isPublished: ex?.isPublished !== false,
                }))
              : [],
            exists: true,
            anchorAfterOrder: r.anchorAfterOrder ?? null,
          };
        }
        setDrafts(next);
      } catch (e: any) {
        onError(`Révisions: ${e.message}`);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, [open, moduleId, onError, initialPosition, initialAnchor]);

  function updateDraft(pos: RevPos, patch: Partial<RevisionDraft>) {
    setDrafts(d => ({ ...d, [pos]: { ...d[pos], ...patch } }));
  }

  function updateTurn(pos: RevPos, idx: number, patch: Partial<RevisionTurn>) {
    setDrafts(d => {
      const turns = d[pos].turns.map((t, i) => i === idx ? { ...t, ...patch } : t);
      return { ...d, [pos]: { ...d[pos], turns } };
    });
  }

  function addTurn(pos: RevPos) {
    setDrafts(d => {
      const last = d[pos].turns[d[pos].turns.length - 1];
      const speaker: "A" | "B" = last?.speaker === "A" ? "B" : "A";
      return { ...d, [pos]: { ...d[pos], turns: [...d[pos].turns, { speaker, darija: "", french: "", transliteration: "" }] } };
    });
  }

  function removeTurn(pos: RevPos, idx: number) {
    setDrafts(d => {
      if (d[pos].turns.length <= 1) return d;
      return { ...d, [pos]: { ...d[pos], turns: d[pos].turns.filter((_, i) => i !== idx) } };
    });
  }

  function moveTurn(pos: RevPos, idx: number, dir: -1 | 1) {
    setDrafts(d => {
      const turns = [...d[pos].turns];
      const j = idx + dir;
      if (j < 0 || j >= turns.length) return d;
      [turns[idx], turns[j]] = [turns[j], turns[idx]];
      return { ...d, [pos]: { ...d[pos], turns } };
    });
  }

  async function save(pos: RevPos) {
    if (!moduleId) {
      setBanner({ type: "error", text: "Section introuvable — rouvre la révision depuis la colonne Cours." });
      return;
    }
    const draft = drafts[pos];

    let contentPayload: any;
    if (draft.kind === "exercises") {
      const pool = aggregatedVocab;
      const byId = new Map(pool.map(v => [v.id, v]));
      const publishedExos = draft.exercises.filter(e => e.isPublished !== false);
      if (publishedExos.length === 0) {
        setBanner({ type: "error", text: "Ajoute au moins un exercice publié avant d'enregistrer." });
        return;
      }
      const resolvedExos: Array<{ typology: string; config: any }> = [];
      for (let i = 0; i < publishedExos.length; i++) {
        const ex = publishedExos[i];
        const t = EXERCISE_REGISTRY[ex.typology];
        if (!t) {
          setBanner({ type: "error", text: `Exo ${i + 1} : typologie inconnue « ${ex.typology} ».` });
          return;
        }
        const resolved = resolveExerciseConfigForSave(ex.typology, ex.config, byId);
        if (!resolved.ok) {
          setBanner({ type: "error", text: `Exo ${i + 1} (${t.label}) : ${resolved.error}` });
          return;
        }
        resolvedExos.push({ typology: ex.typology, config: resolved.config });
      }
      contentPayload = {
        kind: "exercises",
        setting: draft.setting.trim() || undefined,
        theme: draft.theme.trim() || undefined,
        exercises: resolvedExos,
      };
    } else {
      const cleanTurns = draft.turns
        .map(t => ({
          speaker: t.speaker,
          darija: (t.darija ?? "").trim(),
          french: (t.french ?? "").trim(),
          transliteration: (t.transliteration ?? "").trim() || undefined,
          audioUrl: (t.audioUrl ?? "").trim() || undefined,
        }))
        .filter(t => t.darija || t.french);
      if (cleanTurns.length === 0) {
        setBanner({ type: "error", text: "Ajoute au moins un tour avec darija + français avant d'enregistrer." });
        return;
      }
      for (let i = 0; i < cleanTurns.length; i++) {
        if (!cleanTurns[i].darija || !cleanTurns[i].french) {
          setBanner({ type: "error", text: `Tour ${i + 1} incomplet : darija ET français requis.` });
          return;
        }
      }
      contentPayload = {
        kind: "conversation",
        setting: draft.setting.trim() || undefined,
        theme: draft.theme.trim() || undefined,
        turns: cleanTurns,
      };
    }

    setSaving(pos);
    try {
      const payload = {
        title: draft.title.trim() || null,
        isPublished: draft.isPublished,
        anchorAfterOrder: draft.anchorAfterOrder,
        content: contentPayload,
      };
      const updated = await api<any>(`/api/admin/modules/${moduleId}/revisions/${pos}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      updateDraft(pos, { id: updated?.id, exists: true });
      setBanner({ type: "ok", text: `Révision ${pos === "MIDDLE" ? "milieu" : "fin"} enregistrée ✓` });
    } catch (e: any) {
      setBanner({ type: "error", text: `Échec enregistrement : ${e.message}` });
    } finally {
      setSaving(null);
    }
  }

  async function removeRev(pos: RevPos) {
    if (!moduleId) return;
    const draft = drafts[pos];
    if (!draft.exists) return;
    const ok = await askConfirm({
      title: `Supprimer la révision ${pos === "MIDDLE" ? "milieu" : "fin"} ?`,
      message: "Le contenu rédigé sera effacé. La progression des utilisateurs est conservée.",
      confirmLabel: "Supprimer",
      tone: "danger",
    });
    if (!ok) return;
    try {
      await api(`/api/admin/modules/${moduleId}/revisions/${pos}`, { method: "DELETE" });
      setDrafts(d => ({ ...d, [pos]: emptyDraft(pos) }));
      setBanner({ type: "ok", text: `Révision ${pos === "MIDDLE" ? "milieu" : "fin"} supprimée ✓` });
    } catch (e: any) {
      setBanner({ type: "error", text: `Échec suppression : ${e.message}` });
    }
  }

  const draft = drafts[active];

  // Leçons précédant l'ancrage → vocabulaire à insérer directement dans les tours.
  const relevantLessons = useMemo(() => {
    const n = moduleLessons.length;
    const rawAnchor = draft.anchorAfterOrder ?? (active === "MIDDLE" ? Math.floor(n / 2) : n);
    const anchor = Math.max(0, Math.min(n, rawAnchor));
    return moduleLessons.slice(0, anchor);
  }, [moduleLessons, draft.anchorAfterOrder, active]);

  const totalRelevantVocab = useMemo(
    () => relevantLessons.reduce((acc, l) => acc + (vocabByLesson[l.id]?.length ?? 0), 0),
    [relevantLessons, vocabByLesson],
  );

  // Pool agrégé de vocab (déduplique par id) pour l'éditeur d'exercices.
  const aggregatedVocab = useMemo(() => {
    const out: VocabRow[] = [];
    const seen = new Set<string>();
    for (const l of relevantLessons) {
      for (const v of vocabByLesson[l.id] ?? []) {
        if (seen.has(v.id)) continue;
        seen.add(v.id);
        out.push(v);
      }
    }
    return out;
  }, [relevantLessons, vocabByLesson]);

  // Normalise une config d'exercice chargée depuis l'API : si elle contient déjà
  // des `items` pré-résolus (script populate), tente de mapper chaque `item.id`
  // sur un vocab du module (par id réel, puis par translit).
  const normalizeLoadedConfig = useCallback((typology: string, config: any): any => {
    if (!config || typeof config !== "object") return config;
    const needsItems = typology === "VoixVisuel" || typology === "TrouverIntrus";
    if (!needsItems) return config;
    if (Array.isArray(config.vocabIds)) return config;
    const items = Array.isArray(config.items) ? config.items : [];
    if (items.length === 0) return config;
    const byId = new Map(aggregatedVocab.map(v => [v.id, v]));
    const byTranslit = new Map(aggregatedVocab.filter(v => v.transliteration).map(v => [v.transliteration as string, v]));
    const remap = (key: string): string | null => {
      if (byId.has(key)) return key;
      const v = byTranslit.get(key);
      return v ? v.id : null;
    };
    const vocabIds: string[] = [];
    for (const it of items) {
      const mapped = remap(String(it?.id ?? ""));
      if (mapped) vocabIds.push(mapped);
    }
    const out: any = { ...config, vocabIds };
    if (typology === "TrouverIntrus" && Array.isArray(config.playedIds)) {
      out.playedIds = config.playedIds.map((k: any) => remap(String(k))).filter((x: string | null): x is string => !!x);
    }
    return out;
  }, [aggregatedVocab]);

  // Post-chargement : une fois le pool de vocab prêt, rétro-convertit les exos
  // populate-script (items pré-résolus) en format vocabIds pour l'éditeur.
  useEffect(() => {
    if (aggregatedVocab.length === 0) return;
    setDrafts(d => {
      let changed = false;
      const next: Record<RevPos, RevisionDraft> = { ...d };
      for (const p of ["MIDDLE", "END"] as RevPos[]) {
        const cur = d[p];
        if (cur.exercises.length === 0) continue;
        const remapped = cur.exercises.map(ex => {
          const normalized = normalizeLoadedConfig(ex.typology, ex.config);
          if (normalized === ex.config) return ex;
          changed = true;
          return { ...ex, config: normalized };
        });
        if (changed) next[p] = { ...cur, exercises: remapped };
      }
      return changed ? next : d;
    });
  }, [aggregatedVocab, normalizeLoadedConfig]);

  function updateExercise(pos: RevPos, idx: number, patch: Partial<RevisionExerciseDraft>) {
    setDrafts(d => {
      const cur = d[pos];
      const exercises = cur.exercises.map((e, i) => i === idx ? { ...e, ...patch } : e);
      return { ...d, [pos]: { ...cur, exercises } };
    });
  }

  function addExercise(pos: RevPos, typology: string) {
    const config = defaultConfigFor(typology, aggregatedVocab);
    setDrafts(d => ({
      ...d,
      [pos]: { ...d[pos], exercises: [...d[pos].exercises, { typology, config, isPublished: true }] },
    }));
  }

  function removeExercise(pos: RevPos, idx: number) {
    setDrafts(d => ({
      ...d,
      [pos]: { ...d[pos], exercises: d[pos].exercises.filter((_, i) => i !== idx) },
    }));
  }

  function moveExercise(pos: RevPos, idx: number, dir: -1 | 1) {
    setDrafts(d => {
      const exercises = [...d[pos].exercises];
      const j = idx + dir;
      if (j < 0 || j >= exercises.length) return d;
      [exercises[idx], exercises[j]] = [exercises[j], exercises[idx]];
      return { ...d, [pos]: { ...d[pos], exercises } };
    });
  }

  // Insère un mot/phrase dans un tour EN L'AJOUTANT à la suite (pas en remplaçant),
  // pour permettre à une voix d'enchaîner plusieurs items dans un même tour.
  // Les champs restent éditables librement après insertion — source vocab inchangée.
  const insertVocabIntoTurn = useCallback((turnIdx: number, lessonId: string, vocabId: string) => {
    const v = vocabByLesson[lessonId]?.find(x => x.id === vocabId);
    if (!v) return;
    const fr = typeof v.translation === "string" ? v.translation : (v.translation?.fr ?? "");
    const appendWithSpace = (existing: string | undefined, addition: string) => {
      const add = (addition ?? "").trim();
      if (!add) return existing ?? "";
      const cur = (existing ?? "").trimEnd();
      if (!cur) return add;
      // Enchaînement naturel : si la fin est une ponctuation ouverte, juste un espace ;
      // si c'est un mot, on ajoute un espace.
      return `${cur} ${add}`;
    };
    setDrafts(d => {
      const cur = d[active];
      const turns = cur.turns.map((t, i) => i === turnIdx ? {
        ...t,
        darija: appendWithSpace(t.darija, v.word ?? ""),
        french: appendWithSpace(t.french, fr),
        transliteration: appendWithSpace(t.transliteration, v.transliteration ?? ""),
      } : t);
      return { ...d, [active]: { ...cur, turns } };
    });
  }, [vocabByLesson, active]);

  return (
    <Modal open={open} title={`Révisions — ${moduleTitle}`} onClose={onClose} width={780}>
      {loading ? (
        <div style={{ padding: 30, textAlign: "center", color: "var(--c-sub)", fontSize: 13 }}>Chargement…</div>
      ) : (
        <>
          <div style={{ fontSize: 11, color: "var(--c-sub)", marginBottom: 14, lineHeight: 1.5 }}>
            Deux noeuds de révision par section : un au <strong>milieu</strong> (pause checkpoint 💬) et un à la <strong>fin</strong> (synthèse avant trophée 🎓). Contenu rédigé à la main, pas d'IA. Dialogue à 2 voix (A / B) réutilisant le vocabulaire du parcours.
          </div>

          {banner && (
            <div style={{
              marginBottom: 12,
              padding: "8px 12px",
              borderRadius: 8,
              background: banner.type === "ok" ? "rgba(88,204,2,0.12)" : "rgba(255,75,75,0.12)",
              border: `1px solid ${banner.type === "ok" ? "rgba(88,204,2,0.4)" : "rgba(255,75,75,0.4)"}`,
              color: banner.type === "ok" ? "#58cc02" : "#ff4b4b",
              fontSize: 12,
              fontWeight: 700,
            }}>
              {banner.text}
            </div>
          )}

          <div style={{ display: "flex", gap: 6, marginBottom: 14, borderBottom: "1px solid var(--c-border)" }}>
            {(["MIDDLE", "END"] as RevPos[]).map(p => {
              const d = drafts[p];
              const isActive = active === p;
              return (
                <button
                  key={p}
                  onClick={() => setActive(p)}
                  style={{
                    padding: "8px 14px",
                    border: "none",
                    background: "transparent",
                    color: isActive ? "var(--c-text)" : "var(--c-sub)",
                    fontWeight: 800,
                    fontSize: 13,
                    cursor: "pointer",
                    borderBottom: isActive ? "2px solid #58cc02" : "2px solid transparent",
                    marginBottom: -1,
                    display: "flex",
                    alignItems: "center",
                    gap: 6,
                  }}
                >
                  {p === "MIDDLE" ? "💬 Milieu" : "🎓 Fin"}
                  {d.exists && (
                    <span style={{ fontSize: 9, padding: "2px 6px", borderRadius: 99, background: d.isPublished ? "rgba(88,204,2,0.18)" : "rgba(255,136,0,0.18)", color: d.isPublished ? "#58cc02" : "#ff8800" }}>
                      {d.isPublished ? "publié" : "brouillon"}
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          <div style={{ marginBottom: 12 }}>
            <label style={lbl}>Format de révision</label>
            <div style={{ display: "flex", gap: 6 }}>
              {([
                { k: "conversation", icon: "💬", label: "Conversation", hint: "Dialogue 2 voix" },
                { k: "exercises", icon: "🎯", label: "Exercices", hint: "Voix↔Visuel, Intrus…" },
              ] as Array<{ k: RevKind; icon: string; label: string; hint: string }>).map(opt => {
                const isOn = draft.kind === opt.k;
                return (
                  <button
                    key={opt.k}
                    type="button"
                    onClick={() => updateDraft(active, { kind: opt.k })}
                    style={{
                      flex: 1,
                      padding: "8px 12px",
                      borderRadius: 8,
                      border: `1.5px solid ${isOn ? "#58cc02" : "var(--c-border)"}`,
                      background: isOn ? "rgba(88,204,2,0.12)" : "transparent",
                      color: isOn ? "#58cc02" : "var(--c-sub)",
                      fontSize: 12,
                      fontWeight: 800,
                      cursor: "pointer",
                      textAlign: "left",
                      display: "flex",
                      flexDirection: "column",
                      gap: 2,
                    }}
                  >
                    <span>{opt.icon} {opt.label}</span>
                    <span style={{ fontSize: 10, color: "var(--c-sub)", fontWeight: 600 }}>{opt.hint}</span>
                  </button>
                );
              })}
            </div>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 12 }}>
            <div>
              <label style={lbl}>Titre</label>
              <input
                style={inp}
                value={draft.title}
                onChange={e => updateDraft(active, { title: e.target.value })}
                placeholder="Ex. Au café de Tanger"
              />
            </div>
            <div>
              <label style={lbl}>Thème</label>
              <input
                style={inp}
                value={draft.theme}
                onChange={e => updateDraft(active, { theme: e.target.value })}
                placeholder="salutations, commande, politesse…"
              />
            </div>
          </div>

          <div style={{ marginBottom: 12 }}>
            <label style={lbl}>Décor / contexte (optionnel)</label>
            <input
              style={inp}
              value={draft.setting}
              onChange={e => updateDraft(active, { setting: e.target.value })}
              placeholder="Deux amis se retrouvent au café…"
            />
          </div>

          <label style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 13, marginBottom: 14 }}>
            <input
              type="checkbox"
              checked={draft.isPublished}
              onChange={e => updateDraft(active, { isPublished: e.target.checked })}
            />
            Publié (visible dans le parcours)
          </label>

          {draft.kind === "conversation" && (
          <div style={{ marginBottom: 8 }}>
            <span style={{ ...lbl, marginBottom: 0 }}>
              Tours de parole · {draft.turns.length}
              {relevantLessons.length > 0 && (
                <span style={{ marginLeft: 8, color: "var(--c-sub)", fontWeight: 600, fontSize: 10 }}>
                  · {totalRelevantVocab} mot(s)/phrase(s) disponible(s) dans les cours précédents
                </span>
              )}
            </span>
          </div>
          )}

          {draft.kind === "conversation" && (
          <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 16 }}>
            {draft.turns.map((t, i) => (
              <div key={i} style={{ border: "1px solid var(--c-border)", borderRadius: 10, padding: 10, background: "var(--c-bg)" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
                  <span style={{ fontSize: 10, fontWeight: 900, color: "var(--c-sub)" }}>#{i + 1}</span>
                  <div style={{ display: "flex", gap: 4 }}>
                    {(["A", "B"] as const).map(s => (
                      <button
                        key={s}
                        onClick={() => updateTurn(active, i, { speaker: s })}
                        style={{
                          padding: "4px 10px",
                          borderRadius: 6,
                          border: "1.5px solid " + (t.speaker === s ? (s === "A" ? "#1cb0f6" : "#ff9600") : "var(--c-border)"),
                          background: t.speaker === s ? (s === "A" ? "rgba(28,176,246,0.12)" : "rgba(255,150,0,0.12)") : "transparent",
                          color: t.speaker === s ? (s === "A" ? "#1cb0f6" : "#ff9600") : "var(--c-sub)",
                          fontSize: 11,
                          fontWeight: 900,
                          cursor: "pointer",
                        }}
                      >
                        Voix {s}
                      </button>
                    ))}
                  </div>
                  <div style={{ marginLeft: "auto", display: "flex", gap: 2 }}>
                    <button
                      onClick={() => moveTurn(active, i, -1)}
                      disabled={i === 0}
                      style={{ background: "transparent", border: "none", cursor: i === 0 ? "default" : "pointer", fontSize: 14, color: "var(--c-sub)", padding: 3, opacity: i === 0 ? 0.25 : 1 }}
                      title="Monter"
                    >↑</button>
                    <button
                      onClick={() => moveTurn(active, i, 1)}
                      disabled={i === draft.turns.length - 1}
                      style={{ background: "transparent", border: "none", cursor: i === draft.turns.length - 1 ? "default" : "pointer", fontSize: 14, color: "var(--c-sub)", padding: 3, opacity: i === draft.turns.length - 1 ? 0.25 : 1 }}
                      title="Descendre"
                    >↓</button>
                    <button
                      onClick={() => removeTurn(active, i)}
                      disabled={draft.turns.length <= 1}
                      style={{ background: "transparent", border: "none", cursor: draft.turns.length <= 1 ? "default" : "pointer", fontSize: 13, color: "#ff4b4b", padding: 3, opacity: draft.turns.length <= 1 ? 0.25 : 1 }}
                      title="Supprimer"
                    >🗑️</button>
                  </div>
                </div>
                {relevantLessons.length > 0 && (
                  <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 8, fontSize: 11 }}>
                    <span style={{ color: "var(--c-sub)", fontWeight: 700, whiteSpace: "nowrap" }}>📖 Enchaîner :</span>
                    <select
                      value=""
                      onChange={e => {
                        const raw = e.target.value;
                        if (!raw) return;
                        const sep = raw.indexOf("::");
                        if (sep === -1) return;
                        const lid = raw.slice(0, sep);
                        const vid = raw.slice(sep + 2);
                        insertVocabIntoTurn(i, lid, vid);
                        e.currentTarget.value = "";
                      }}
                      style={{ ...inp, padding: "4px 8px", fontSize: 11, flex: 1, minHeight: 28 }}
                      title="Chaque sélection est ajoutée à la suite du tour — tu peux enchaîner plusieurs mots/phrases dans une même voix. Les champs restent éditables."
                    >
                      <option value="">— Ajouter un mot/phrase au tour (enchaînement possible) —</option>
                      {relevantLessons.map(l => {
                        const items = vocabByLesson[l.id] ?? [];
                        if (items.length === 0) return null;
                        return (
                          <optgroup key={l.id} label={`#${l.order} — ${l.title}`}>
                            {items.map(v => {
                              const fr = typeof v.translation === "string" ? v.translation : (v.translation?.fr ?? "");
                              return (
                                <option key={v.id} value={`${l.id}::${v.id}`}>
                                  {v.word}{fr ? ` — ${fr}` : ""}
                                </option>
                              );
                            })}
                          </optgroup>
                        );
                      })}
                    </select>
                  </div>
                )}
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginBottom: 8 }}>
                  <div>
                    <label style={lbl}>Darija (latin)</label>
                    <input
                      style={inp}
                      value={t.darija}
                      onChange={e => updateTurn(active, i, { darija: e.target.value })}
                      placeholder="Salam, kidayr ?"
                    />
                  </div>
                  <div>
                    <label style={lbl}>Français</label>
                    <input
                      style={inp}
                      value={t.french}
                      onChange={e => updateTurn(active, i, { french: e.target.value })}
                      placeholder="Salut, comment vas-tu ?"
                    />
                  </div>
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
                  <div>
                    <label style={lbl}>Translittération arabe (optionnel)</label>
                    <input
                      style={{ ...inp, direction: "rtl", fontFamily: "var(--font-amiri), serif", fontSize: 15 }}
                      value={t.transliteration ?? ""}
                      onChange={e => updateTurn(active, i, { transliteration: e.target.value })}
                      placeholder="سلام، كي داير؟"
                    />
                  </div>
                  <div>
                    <label style={lbl}>URL audio (optionnel)</label>
                    <input
                      style={{ ...inp, fontFamily: "monospace", fontSize: 11 }}
                      value={t.audioUrl ?? ""}
                      onChange={e => updateTurn(active, i, { audioUrl: e.target.value })}
                      placeholder="/audio/revisions/..."
                    />
                  </div>
                </div>
              </div>
            ))}
            <button
              onClick={() => addTurn(active)}
              style={{
                padding: "10px 14px",
                borderRadius: 10,
                border: "1.5px dashed var(--c-border)",
                background: "transparent",
                color: "var(--c-sub)",
                fontSize: 13,
                fontWeight: 800,
                cursor: "pointer",
                width: "100%",
              }}
              title="Ajouter un nouveau tour à la fin de la conversation"
            >
              ➕ Ajouter un tour
            </button>
          </div>
          )}

          {draft.kind === "exercises" && (
            <RevisionExercisesSection
              exercises={draft.exercises}
              vocab={aggregatedVocab}
              relevantLessonsCount={relevantLessons.length}
              totalRelevantVocab={totalRelevantVocab}
              onAdd={(typology) => addExercise(active, typology)}
              onUpdate={(idx, patch) => updateExercise(active, idx, patch)}
              onRemove={(idx) => removeExercise(active, idx)}
              onMove={(idx, dir) => moveExercise(active, idx, dir)}
            />
          )}

          <div style={{ display: "flex", gap: 8, justifyContent: "space-between", alignItems: "center", paddingTop: 12, borderTop: "1px solid var(--c-border)" }}>
            <button
              onClick={() => removeRev(active)}
              disabled={!draft.exists || saving !== null}
              style={{ padding: "8px 14px", borderRadius: 8, border: "1px solid var(--c-border)", background: "transparent", color: draft.exists ? "#ff4b4b" : "var(--c-sub)", fontSize: 12, fontWeight: 700, cursor: draft.exists && saving === null ? "pointer" : "not-allowed", opacity: draft.exists ? 1 : 0.4 }}
            >
              🗑️ Supprimer
            </button>
            <div style={{ display: "flex", gap: 8 }}>
              <button
                onClick={onClose}
                style={{ padding: "8px 16px", borderRadius: 8, border: "1px solid var(--c-border)", background: "var(--c-bg)", color: "var(--c-sub)", fontSize: 13, cursor: "pointer" }}
              >
                Fermer
              </button>
              <button
                onClick={() => save(active)}
                disabled={saving !== null}
                style={{ padding: "8px 18px", borderRadius: 8, border: "none", background: "#58cc02", color: "white", fontWeight: 800, fontSize: 13, cursor: saving !== null ? "wait" : "pointer", opacity: saving !== null ? 0.6 : 1 }}
              >
                {saving === active ? "Enregistrement…" : (draft.exists ? "💾 Enregistrer" : "➕ Créer la révision")}
              </button>
            </div>
          </div>
        </>
      )}
    </Modal>
  );
}

// ────────────────────────────────────────────────────────────────────────────
//  Révisions — section "exercices" (quand kind === 'exercises')
// ────────────────────────────────────────────────────────────────────────────

function RevisionExercisesSection({
  exercises, vocab, relevantLessonsCount, totalRelevantVocab,
  onAdd, onUpdate, onRemove, onMove,
}: {
  exercises: RevisionExerciseDraft[];
  vocab: VocabRow[];
  relevantLessonsCount: number;
  totalRelevantVocab: number;
  onAdd: (typology: string) => void;
  onUpdate: (idx: number, patch: Partial<RevisionExerciseDraft>) => void;
  onRemove: (idx: number) => void;
  onMove: (idx: number, dir: -1 | 1) => void;
}) {
  const [editingIdx, setEditingIdx] = useState<number | null>(null);
  const [showPicker, setShowPicker] = useState(false);

  // Typologies adaptées aux révisions (pool vocab seulement, sans saisie libre)
  const allowedTypologies = ["VoixVisuel", "TrouverIntrus"] as const;
  const pickableTypes = EXERCISE_TYPES.filter(t => (allowedTypologies as readonly string[]).includes(t.key));

  const editing = editingIdx !== null ? exercises[editingIdx] : null;

  return (
    <div style={{ marginBottom: 16 }}>
      <div style={{ marginBottom: 8 }}>
        <span style={{ ...lbl, marginBottom: 0 }}>
          Exercices · {exercises.length}
          {relevantLessonsCount > 0 && (
            <span style={{ marginLeft: 8, color: "var(--c-sub)", fontWeight: 600, fontSize: 10 }}>
              · {totalRelevantVocab} mot(s) disponible(s) dans les cours précédents
            </span>
          )}
        </span>
      </div>

      {vocab.length === 0 && (
        <div style={{ padding: 14, marginBottom: 10, borderRadius: 10, border: "1px dashed var(--c-border)", background: "rgba(255,136,0,0.08)", color: "#ff8800", fontSize: 12, textAlign: "center" }}>
          ⚠️ Aucun vocabulaire disponible dans les leçons précédentes — ajoute d'abord des mots dans les leçons ou ajuste l'ancrage.
        </div>
      )}

      <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: 10 }}>
        {exercises.map((ex, i) => {
          const t = EXERCISE_REGISTRY[ex.typology];
          const summary = summarizeConfig(ex.typology, ex.config, vocab);
          const published = ex.isPublished !== false;
          return (
            <div key={i} style={{
              display: "flex", alignItems: "center", gap: 8,
              padding: "10px 12px",
              background: t ? "var(--c-card)" : "rgba(255,75,75,0.08)",
              border: `1px solid ${t ? "var(--c-border)" : "#ff4b4b"}`,
              borderRadius: 10,
              opacity: published ? 1 : 0.55,
            }}>
              <span style={{ fontSize: 11, fontWeight: 800, color: "var(--c-sub)", minWidth: 18 }}>{i + 1}.</span>
              <span style={{ fontSize: 18 }}>{t?.icon ?? "❓"}</span>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontWeight: 800, fontSize: 13, color: "var(--c-text)", display: "flex", alignItems: "center", gap: 6 }}>
                  {t?.label ?? ex.typology}
                  {!t && <span style={{ color: "#ff4b4b", fontSize: 10 }}>(inconnue)</span>}
                  {!published && (
                    <span style={{ fontSize: 9, fontWeight: 800, color: "#ff8800", background: "rgba(255,136,0,0.15)", border: "1px solid #ff8800", padding: "1px 6px", borderRadius: 4, textTransform: "uppercase", letterSpacing: "0.04em" }}>
                      Brouillon
                    </span>
                  )}
                </div>
                <div style={{ fontSize: 11, color: "var(--c-sub)", marginTop: 2, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                  {summary || "— config vide"}
                </div>
              </div>
              <div style={{ display: "flex", gap: 2, alignItems: "center", flexShrink: 0 }}>
                <button
                  onClick={() => onUpdate(i, { isPublished: !published })}
                  style={{ background: "transparent", border: "none", cursor: "pointer", color: published ? "#58cc02" : "#ff8800", fontSize: 14, padding: 4 }}
                  title={published ? "Publié (cliquer pour mettre en brouillon)" : "Brouillon (cliquer pour publier)"}
                >{published ? "👁️" : "🙈"}</button>
                <button
                  onClick={() => onMove(i, -1)}
                  disabled={i === 0}
                  style={{ background: "transparent", border: "none", cursor: i === 0 ? "default" : "pointer", color: "var(--c-sub)", fontSize: 14, opacity: i === 0 ? 0.3 : 1 }}
                  title="Monter"
                >↑</button>
                <button
                  onClick={() => onMove(i, 1)}
                  disabled={i === exercises.length - 1}
                  style={{ background: "transparent", border: "none", cursor: i === exercises.length - 1 ? "default" : "pointer", color: "var(--c-sub)", fontSize: 14, opacity: i === exercises.length - 1 ? 0.3 : 1 }}
                  title="Descendre"
                >↓</button>
                <button onClick={() => setEditingIdx(i)} style={{ background: "transparent", border: "none", cursor: "pointer", color: "var(--c-sub)", fontSize: 13, padding: 4 }} title="Éditer">✏️</button>
                <button onClick={() => onRemove(i)} style={{ background: "transparent", border: "none", cursor: "pointer", color: "#ff4b4b", fontSize: 13, padding: 4 }} title="Supprimer">🗑️</button>
              </div>
            </div>
          );
        })}
      </div>

      <button
        type="button"
        onClick={() => setShowPicker(true)}
        disabled={vocab.length === 0}
        style={{
          padding: "10px 14px",
          borderRadius: 10,
          border: "1.5px dashed var(--c-border)",
          background: "transparent",
          color: vocab.length === 0 ? "var(--c-sub)" : "#58cc02",
          fontSize: 13,
          fontWeight: 800,
          cursor: vocab.length === 0 ? "not-allowed" : "pointer",
          width: "100%",
          opacity: vocab.length === 0 ? 0.5 : 1,
        }}
        title="Ajouter un exercice à cette révision"
      >
        ➕ Ajouter un exercice
      </button>

      <Modal open={showPicker} title="Choisir un exercice" onClose={() => setShowPicker(false)} width={560}>
        <div style={{ fontSize: 12, color: "var(--c-sub)", marginBottom: 14 }}>
          Les révisions supportent les exercices jouables avec le vocabulaire déjà vu.
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 8 }}>
          {pickableTypes.map(t => (
            <TypologyCard key={t.key} t={t} onPick={() => { onAdd(t.key); setShowPicker(false); }} />
          ))}
        </div>
      </Modal>

      {editing !== null && editingIdx !== null && (
        <RevisionExerciseEditor
          key={editingIdx}
          exercise={editing}
          vocab={vocab}
          onClose={() => setEditingIdx(null)}
          onSave={(patch) => { onUpdate(editingIdx, patch); setEditingIdx(null); }}
        />
      )}
    </div>
  );
}

function RevisionExerciseEditor({
  exercise, vocab, onClose, onSave,
}: {
  exercise: RevisionExerciseDraft;
  vocab: VocabRow[];
  onClose: () => void;
  onSave: (patch: Partial<RevisionExerciseDraft>) => void;
}) {
  const [local, setLocal] = useState<any>(exercise.config ?? {});
  const [localPublished, setLocalPublished] = useState<boolean>(exercise.isPublished !== false);
  const [showPreview, setShowPreview] = useState(true);
  const t = EXERCISE_REGISTRY[exercise.typology];

  const dirty =
    JSON.stringify(local) !== JSON.stringify(exercise.config ?? {}) ||
    localPublished !== (exercise.isPublished !== false);

  return (
    <Modal
      open
      title={`${t?.icon ?? ""} ${t?.label ?? exercise.typology} — éditer`}
      onClose={onClose}
      width={720}
    >
      {vocab.length === 0 ? (
        <div style={{ padding: 30, textAlign: "center", color: "var(--c-sub)", fontSize: 13 }}>
          Aucun item disponible dans les leçons précédentes.
        </div>
      ) : (
        <>
          <ExerciseConfigEditor typology={exercise.typology} config={local} vocab={vocab} onChange={setLocal} />
          <div style={{ marginTop: 18, paddingTop: 14, borderTop: "1px dashed var(--c-border)" }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 10 }}>
              <div style={{ fontSize: 13, fontWeight: 800, color: "var(--c-text)" }}>👁️ Aperçu live</div>
              <button type="button" onClick={() => setShowPreview(v => !v)} style={{ padding: "4px 10px", borderRadius: 6, border: "1px solid var(--c-border)", background: "var(--c-bg)", color: "var(--c-sub)", fontSize: 11, cursor: "pointer", fontWeight: 700 }}>
                {showPreview ? "Masquer" : "Afficher"}
              </button>
            </div>
            {showPreview && (
              <div style={{ padding: 10, background: "#1a1f26", borderRadius: 12, border: "1px solid var(--c-border)", overflow: "hidden" }}>
                <div style={{ zoom: 0.7 }}>
                  <ExercisePreview typology={exercise.typology} config={local} vocab={vocab} />
                </div>
              </div>
            )}
          </div>
          <div style={{ marginTop: 18, paddingTop: 14, borderTop: "1px dashed var(--c-border)" }}>
            <label style={lbl}>Consigne affichée (optionnel)</label>
            <input
              style={inp}
              value={local?.prompt ?? ""}
              onChange={(e) => setLocal({ ...local, prompt: e.target.value })}
              placeholder="Ex. Relie chaque voix à sa couleur."
            />
          </div>
        </>
      )}
      <div style={{ display: "flex", alignItems: "center", gap: 6, marginTop: 14, paddingTop: 12, borderTop: "1px dashed var(--c-border)", fontSize: 13, color: "var(--c-text)" }}>
        <input type="checkbox" id="rev-ex-pub" checked={localPublished} onChange={e => setLocalPublished(e.target.checked)} />
        <label htmlFor="rev-ex-pub" style={{ cursor: "pointer", fontWeight: 700 }}>Publié</label>
      </div>
      <div style={{ display: "flex", gap: 8, justifyContent: "flex-end", paddingTop: 12, marginTop: 14, borderTop: "1px solid var(--c-border)" }}>
        <button onClick={onClose} style={{ padding: "8px 16px", borderRadius: 8, border: "1px solid var(--c-border)", background: "var(--c-bg)", color: "var(--c-sub)", fontSize: 13, cursor: "pointer" }}>Annuler</button>
        <button
          onClick={() => onSave({ config: local, isPublished: localPublished })}
          disabled={!dirty}
          style={{ padding: "8px 18px", borderRadius: 8, border: "none", background: "#58cc02", color: "white", fontWeight: 800, fontSize: 13, cursor: dirty ? "pointer" : "default", opacity: dirty ? 1 : 0.4 }}
        >💾 Enregistrer</button>
      </div>
    </Modal>
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
  onReorder: (orderedIds: string[]) => void;
  onImport: () => void;
  onExport: (slug: string) => void;
}) {
  const selectedSlug = modules.find(m => m.id === selectedId)?.slug ?? null;
  const [editing, setEditing] = useState<Partial<ModuleRow> | null>(null);
  const askConfirm = useConfirm();

  function moveBy(idx: number, dir: -1 | 1) {
    const j = idx + dir;
    if (j < 0 || j >= modules.length) return;
    const next = modules.map(m => m.id);
    [next[idx], next[j]] = [next[j], next[idx]];
    onReorder(next);
  }

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
    const ok = await askConfirm({
      title: "Supprimer cette section ?",
      message: "Les leçons rattachées sont détachées, pas supprimées.",
      confirmLabel: "Supprimer",
      tone: "danger",
    });
    if (!ok) return;
    try {
      await api(`/api/admin/modules/${id}?hard=true`, { method: "DELETE" });
      onChanged();
    } catch (e: any) { onError(`Suppression: ${e.message}`); }
  }

  async function togglePublished(id: string, next: boolean) {
    try {
      await api(`/api/admin/modules/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isPublished: next }),
      });
      onChanged();
    } catch (e: any) { onError(`Publication: ${e.message}`); }
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
              <div style={{ marginTop: 10 }}>
                <label style={lbl}>Ville du Maroc (synchronise la carte)</label>
                <select
                  style={inp}
                  value={editing.cityInfo?.cityKey ?? ""}
                  onChange={e => {
                    const key = e.target.value;
                    setEditing(s => ({
                      ...s,
                      cityInfo: { ...(s?.cityInfo ?? {}), cityKey: key || undefined },
                    }));
                  }}
                >
                  <option value="">— Aucune ville (module non affiché sur la carte) —</option>
                  {MOROCCO_CITIES.map(c => (
                    <option key={c.key} value={c.key}>
                      #{c.order} · {c.nameFr} ({c.region})
                    </option>
                  ))}
                </select>
                <div style={{ fontSize: 10, color: "var(--c-sub)", marginTop: 3 }}>
                  Sélectionne la ville qui représente ce module sur la carte du parcours. L'ordre suit ton canonicalOrder.
                </div>
              </div>
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
                  <label style={lbl}>Photo bandeau section</label>
                  <PhotoUploader
                    moduleId={editing.id}
                    photoUrl={editing.cityInfo?.photoUrl ?? ""}
                    kind="section"
                    onUploaded={(url) => setEditing(s => ({ ...s, cityInfo: { ...(s?.cityInfo ?? {}), photoUrl: url } }))}
                    onError={onError}
                  />
                </div>
              </div>
              <div style={{ marginTop: 10 }}>
                <label style={lbl}>
                  Photo carte postale <span style={{ fontWeight: 500, color: "var(--c-sub)" }}>— optionnel, fallback sur la photo section</span>
                </label>
                <PhotoUploader
                  moduleId={editing.id}
                  photoUrl={editing.cityInfo?.postcardUrl ?? ""}
                  kind="postcard"
                  onUploaded={(url) => setEditing(s => ({ ...s, cityInfo: { ...(s?.cityInfo ?? {}), postcardUrl: url } }))}
                  onError={onError}
                />
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

      {!isEmpty && <div className="col-scroll" style={{ flex: 1, overflow: "auto" }}>
        <SortableList
          items={modules}
          onReorder={onReorder}
          renderItem={(m, { handleProps, isDragging }) => {
            const idx = modules.findIndex(x => x.id === m.id);
            return (
              <div
                onClick={() => onSelect(m.id)}
                style={{
                  ...rowBase,
                  background: selectedId === m.id ? "rgba(88,204,2,0.08)" : "transparent",
                  borderLeft: selectedId === m.id ? "3px solid #58cc02" : "3px solid transparent",
                  borderColor: isDragging ? "#58cc02" : undefined,
                  boxShadow: isDragging ? "0 4px 12px rgba(0,0,0,0.15)" : undefined,
                }}
              >
                <DragHandle handleProps={handleProps} />
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
                    onClick={(e) => { e.stopPropagation(); togglePublished(m.id, !m.isPublished); }}
                    style={{ background: "transparent", border: "none", cursor: "pointer", fontSize: 14, color: m.isPublished ? "#58cc02" : "#ff8800", padding: 3 }}
                    title={m.isPublished ? "Publié (cliquer pour mettre en brouillon)" : "Brouillon (cliquer pour publier)"}
                  >{m.isPublished ? "👁️" : "🙈"}</button>
                  <button
                    onClick={(e) => { e.stopPropagation(); moveBy(idx, -1); }}
                    disabled={idx === 0}
                    style={{ background: "transparent", border: "none", cursor: idx === 0 ? "default" : "pointer", fontSize: 14, color: "var(--c-sub)", padding: 3, opacity: idx === 0 ? 0.25 : 1 }}
                    title="Monter"
                  >↑</button>
                  <button
                    onClick={(e) => { e.stopPropagation(); moveBy(idx, 1); }}
                    disabled={idx === modules.length - 1}
                    style={{ background: "transparent", border: "none", cursor: idx === modules.length - 1 ? "default" : "pointer", fontSize: 14, color: "var(--c-sub)", padding: 3, opacity: idx === modules.length - 1 ? 0.25 : 1 }}
                    title="Descendre"
                  >↓</button>
                  <button onClick={(e) => { e.stopPropagation(); setEditing(m); }} style={{ background: "transparent", border: "none", cursor: "pointer", fontSize: 13, color: "var(--c-sub)", padding: 4 }} title="Éditer">✏️</button>
                  <button onClick={(e) => { e.stopPropagation(); remove(m.id); }} style={{ background: "transparent", border: "none", cursor: "pointer", fontSize: 13, color: "#ff4b4b", padding: 4 }} title="Supprimer">🗑️</button>
                </div>
              </div>
            );
          }}
        />
      </div>}
    </div>
  );
}

// ════════════════════════════════════════════════════════════════════════════
//  Colonne 2 — Cours (Lessons)
// ════════════════════════════════════════════════════════════════════════════

function LessonsColumn({
  lessons, languages, modules, moduleId, moduleSlug, moduleTitle, selectedId, trackFilter, onSelect, onChanged, onError, onModulesChanged, onReorder, onImport, onExport, onOpenRevision, revisionsTick,
}: {
  lessons: LessonRow[];
  languages: Language[];
  modules: ModuleRow[];
  moduleId: string | null;
  moduleSlug: string | null;
  moduleTitle: string;
  selectedId: string | null;
  trackFilter: Track | "ALL";
  onSelect: (id: string) => void;
  onChanged: () => void;
  onError: (t: string) => void;
  onModulesChanged: () => void;
  onReorder: (orderedIds: string[]) => void;
  onImport: () => void;
  onExport: (moduleSlug: string) => void;
  onOpenRevision: (moduleId: string, moduleTitle: string, position: "MIDDLE" | "END", initialAnchor?: number | null) => void;
  revisionsTick: number;
}) {
  const [editing, setEditing] = useState<Partial<LessonRow> | null>(null);
  const [newSection, setNewSection] = useState<{ title: string; track: Track } | null>(null);
  type RevRow = { id: string; title: string | null; isPublished: boolean; anchorAfterOrder: number | null };
  const [revisionsByPos, setRevisionsByPos] = useState<Record<"MIDDLE" | "END", RevRow | null>>({ MIDDLE: null, END: null });
  // Ancrages locaux : permettent de déplacer la révision milieu avant même qu'elle
  // n'existe en base. Pour une révision déjà créée, ils reflètent la valeur serveur
  // après chaque PATCH.
  const [localAnchors, setLocalAnchors] = useState<Record<"MIDDLE" | "END", number | null>>({ MIDDLE: null, END: null });
  const [localTick, setLocalTick] = useState(0);
  const askConfirm = useConfirm();

  const reloadRevisions = useCallback(async () => {
    if (!moduleId) { setRevisionsByPos({ MIDDLE: null, END: null }); return; }
    try {
      const list = await api<any[]>(`/api/admin/modules/${moduleId}/revisions`);
      const next: Record<"MIDDLE" | "END", RevRow | null> = { MIDDLE: null, END: null };
      for (const r of list ?? []) {
        const pos = r.position as "MIDDLE" | "END";
        if (pos === "MIDDLE" || pos === "END") {
          next[pos] = { id: r.id, title: r.title ?? null, isPublished: !!r.isPublished, anchorAfterOrder: r.anchorAfterOrder ?? null };
        }
      }
      setRevisionsByPos(next);
    } catch {
      setRevisionsByPos({ MIDDLE: null, END: null });
    }
  }, [moduleId]);

  useEffect(() => { reloadRevisions(); }, [reloadRevisions, revisionsTick, localTick]);

  // Reset des ancrages locaux à chaque changement de section
  useEffect(() => { setLocalAnchors({ MIDDLE: null, END: null }); }, [moduleId]);

  // Hydrate les ancrages locaux depuis le serveur dès que les révisions sont chargées
  // (si l'admin n'a encore rien modifié localement pour cette position).
  useEffect(() => {
    setLocalAnchors(prev => ({
      MIDDLE: prev.MIDDLE ?? revisionsByPos.MIDDLE?.anchorAfterOrder ?? null,
      END: prev.END ?? revisionsByPos.END?.anchorAfterOrder ?? null,
    }));
  }, [revisionsByPos]);

  const n = lessons.length;
  const resolveAnchor = (pos: "MIDDLE" | "END"): number => {
    const local = localAnchors[pos];
    if (local !== null && local !== undefined) return Math.max(0, Math.min(n, local));
    const fromDb = revisionsByPos[pos]?.anchorAfterOrder ?? null;
    if (fromDb !== null) return Math.max(0, Math.min(n, fromDb));
    return pos === "MIDDLE" ? Math.floor(n / 2) : n;
  };

  async function persistAnchor(pos: "MIDDLE" | "END", anchor: number) {
    if (!moduleId) return;
    const rev = revisionsByPos[pos];
    if (!rev) return; // pas de révision en base → on ne persiste rien, l'ancrage local suffit
    try {
      await api(`/api/admin/modules/${moduleId}/revisions/${pos}/anchor`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ anchorAfterOrder: anchor }),
      });
      setLocalTick(t => t + 1);
    } catch (e: any) { onError(`Révision: ${e.message}`); }
  }

  async function moveRevisionAnchor(pos: "MIDDLE" | "END", dir: -1 | 1) {
    if (!moduleId) return;
    const current = resolveAnchor(pos);
    const next = Math.max(0, Math.min(n, current + dir));
    if (next === current) return;
    setLocalAnchors(a => ({ ...a, [pos]: next }));
    await persistAnchor(pos, next);
  }

  function setAnchorFromDrag(pos: "MIDDLE" | "END", anchor: number) {
    const clamped = Math.max(0, Math.min(n, anchor));
    const current = resolveAnchor(pos);
    if (clamped === current) return;
    setLocalAnchors(a => ({ ...a, [pos]: clamped }));
    void persistAnchor(pos, clamped);
  }

  async function removeRevision(pos: "MIDDLE" | "END") {
    if (!moduleId) return;
    const rev = revisionsByPos[pos];
    if (!rev) return;
    const ok = await askConfirm({
      title: `Supprimer la révision ${pos === "MIDDLE" ? "milieu" : "fin"} ?`,
      message: "Le contenu rédigé sera effacé. La progression des utilisateurs sur cette révision est conservée.",
      confirmLabel: "Supprimer",
      tone: "danger",
    });
    if (!ok) return;
    try {
      await api(`/api/admin/modules/${moduleId}/revisions/${pos}`, { method: "DELETE" });
      setLocalTick(t => t + 1);
    } catch (e: any) { onError(`Révision: ${e.message}`); }
  }

  function moveBy(idx: number, dir: -1 | 1) {
    const j = idx + dir;
    if (j < 0 || j >= lessons.length) return;
    const next = lessons.map(l => l.id);
    [next[idx], next[j]] = [next[j], next[idx]];
    onReorder(next);
  }

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
    const ok = await askConfirm({
      title: "Supprimer cette leçon ?",
      message: "Les items vocabulaire seront détachés et la progression des utilisateurs sera perdue.",
      confirmLabel: "Supprimer",
      tone: "danger",
    });
    if (!ok) return;
    try {
      await api(`/api/admin/lessons/${id}?hard=true`, { method: "DELETE" });
      onChanged();
    } catch (e: any) { onError(`Suppression: ${e.message}`); }
  }

  async function togglePublishedLesson(id: string, next: boolean) {
    try {
      await api(`/api/admin/lessons/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isPublished: next }),
      });
      onChanged();
    } catch (e: any) { onError(`Publication: ${e.message}`); }
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

      <div className="col-scroll" style={{ flex: 1, overflow: "auto" }}>
        {(() => {
          const mid = revisionsByPos.MIDDLE;
          const end = revisionsByPos.END;
          const midAnchor = resolveAnchor("MIDDLE");
          const endNode = (
            <RevisionPseudoRow
              position="END"
              rev={end}
              onClick={() => moduleId && onOpenRevision(moduleId, moduleTitle, "END", resolveAnchor("END"))}
              onDelete={() => removeRevision("END")}
            />
          );
          if (n === 0) {
            const midNodeZero = (
              <RevisionPseudoRow
                position="MIDDLE"
                rev={mid}
                canMoveUp={false}
                canMoveDown={false}
                onClick={() => moduleId && onOpenRevision(moduleId, moduleTitle, "MIDDLE", midAnchor)}
                onMoveUp={() => moveRevisionAnchor("MIDDLE", -1)}
                onMoveDown={() => moveRevisionAnchor("MIDDLE", 1)}
                onDelete={() => removeRevision("MIDDLE")}
              />
            );
            return (
              <>
                <div style={{ padding: 20, textAlign: "center", color: "var(--c-sub)", fontSize: 12 }}>Aucun cours dans cette section</div>
                {midNodeZero}
                {endNode}
              </>
            );
          }

          // Construit la liste combinée : leçons + pseudo-ligne MIDDLE à l'ancrage.
          const MID_ID = "__rev_MIDDLE__";
          type CombinedItem =
            | { id: string; kind: "lesson"; data: LessonRow }
            | { id: typeof MID_ID; kind: "rev" };
          const combined: CombinedItem[] = [];
          lessons.forEach((l, i) => {
            if (midAnchor === i) combined.push({ id: MID_ID, kind: "rev" });
            combined.push({ id: l.id, kind: "lesson", data: l });
          });
          if (midAnchor >= lessons.length) combined.push({ id: MID_ID, kind: "rev" });

          const handleCombinedReorder = (orderedIds: string[]) => {
            const newMidIdx = orderedIds.indexOf(MID_ID);
            const lessonIds = orderedIds.filter(id => id !== MID_ID);
            const prevLessonIds = lessons.map(l => l.id);
            const lessonsChanged =
              lessonIds.length !== prevLessonIds.length ||
              lessonIds.some((id, i) => prevLessonIds[i] !== id);
            if (lessonsChanged) onReorder(lessonIds);
            if (newMidIdx !== -1 && newMidIdx !== midAnchor) {
              setAnchorFromDrag("MIDDLE", newMidIdx);
            }
          };

          return (
            <>
              <SortableList
                items={combined}
                onReorder={handleCombinedReorder}
                renderItem={(item, { handleProps, isDragging }) => {
                  if (item.kind === "rev") {
                    return (
                      <RevisionPseudoRow
                        position="MIDDLE"
                        rev={mid}
                        canMoveUp={midAnchor > 0}
                        canMoveDown={midAnchor < n}
                        onClick={() => moduleId && onOpenRevision(moduleId, moduleTitle, "MIDDLE", midAnchor)}
                        onMoveUp={() => moveRevisionAnchor("MIDDLE", -1)}
                        onMoveDown={() => moveRevisionAnchor("MIDDLE", 1)}
                        onDelete={() => removeRevision("MIDDLE")}
                        handleProps={handleProps}
                        isDragging={isDragging}
                      />
                    );
                  }
                  const l = item.data;
                  const idx = lessons.findIndex(x => x.id === l.id);
                  const seq = (l.content as any)?.sequence as string[] | undefined;
                  return (
                    <div
                      onClick={() => onSelect(l.id)}
                      style={{
                        ...rowBase,
                        background: selectedId === l.id ? "rgba(88,204,2,0.08)" : "transparent",
                        borderLeft: selectedId === l.id ? "3px solid #58cc02" : "3px solid transparent",
                        borderColor: isDragging ? "#58cc02" : undefined,
                        boxShadow: isDragging ? "0 4px 12px rgba(0,0,0,0.15)" : undefined,
                      }}
                    >
                      <DragHandle handleProps={handleProps} />
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
                          onClick={(e) => { e.stopPropagation(); togglePublishedLesson(l.id, !l.isPublished); }}
                          style={{ background: "transparent", border: "none", cursor: "pointer", fontSize: 14, color: l.isPublished ? "#58cc02" : "#ff8800", padding: 3 }}
                          title={l.isPublished ? "Publié (cliquer pour mettre en brouillon)" : "Brouillon (cliquer pour publier)"}
                        >{l.isPublished ? "👁️" : "🙈"}</button>
                        <button
                          onClick={(e) => { e.stopPropagation(); moveBy(idx, -1); }}
                          disabled={idx === 0}
                          style={{ background: "transparent", border: "none", cursor: idx === 0 ? "default" : "pointer", fontSize: 14, color: "var(--c-sub)", padding: 3, opacity: idx === 0 ? 0.25 : 1 }}
                          title="Monter"
                        >↑</button>
                        <button
                          onClick={(e) => { e.stopPropagation(); moveBy(idx, 1); }}
                          disabled={idx === lessons.length - 1}
                          style={{ background: "transparent", border: "none", cursor: idx === lessons.length - 1 ? "default" : "pointer", fontSize: 14, color: "var(--c-sub)", padding: 3, opacity: idx === lessons.length - 1 ? 0.25 : 1 }}
                          title="Descendre"
                        >↓</button>
                        <button
                          onClick={(e) => { e.stopPropagation(); window.open(`/lesson/${l.id}`, '_blank', 'noopener,noreferrer'); }}
                          style={{ background: "transparent", border: "none", cursor: "pointer", fontSize: 13, color: "#1cb0f6", padding: 4 }}
                          title="Tester comme un élève (nouvel onglet)"
                        >🧪</button>
                        <button onClick={(e) => { e.stopPropagation(); setEditing(l); }} style={{ background: "transparent", border: "none", cursor: "pointer", fontSize: 13, color: "var(--c-sub)", padding: 4 }} title="Éditer">✏️</button>
                        <button onClick={(e) => { e.stopPropagation(); remove(l.id); }} style={{ background: "transparent", border: "none", cursor: "pointer", fontSize: 13, color: "#ff4b4b", padding: 4 }} title="Supprimer">🗑️</button>
                      </div>
                    </div>
                  );
                }}
              />
              {endNode}
            </>
          );
        })()}
      </div>
    </div>
  );
}

function RevisionPseudoRow({
  position, rev, onClick, onMoveUp, onMoveDown, onDelete, canMoveUp, canMoveDown, handleProps, isDragging,
}: {
  position: "MIDDLE" | "END";
  rev: { id: string; title: string | null; isPublished: boolean; anchorAfterOrder: number | null } | null;
  onClick: () => void;
  onMoveUp?: () => void;
  onMoveDown?: () => void;
  onDelete?: () => void;
  canMoveUp?: boolean;
  canMoveDown?: boolean;
  handleProps?: React.HTMLAttributes<HTMLElement> & { style?: React.CSSProperties };
  isDragging?: boolean;
}) {
  const icon = position === "MIDDLE" ? "💬" : "🎓";
  const label = position === "MIDDLE" ? "Révision — Milieu" : "Révision — Fin";
  const exists = !!rev;
  const gold = "#d4a84b";
  return (
    <div
      onClick={onClick}
      style={{
        padding: "10px 14px",
        borderBottom: "1px solid var(--c-border)",
        borderLeft: `3px solid ${gold}`,
        background: exists ? "rgba(212,168,75,0.06)" : "rgba(212,168,75,0.03)",
        borderColor: isDragging ? gold : undefined,
        boxShadow: isDragging ? `0 4px 12px ${gold}55` : undefined,
        cursor: "pointer",
        display: "flex",
        alignItems: "center",
        gap: 10,
        fontSize: 13,
      }}
      title={exists ? "Éditer cette révision" : "Créer cette révision"}
    >
      {handleProps && <DragHandle handleProps={handleProps} />}
      <span style={{ fontSize: 18, width: 22, textAlign: "center" }}>{icon}</span>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 2 }}>
          <span style={{ fontSize: 9, fontWeight: 900, color: gold, textTransform: "uppercase", letterSpacing: "0.05em" }}>{label}</span>
          {exists ? (
            <span style={{
              fontSize: 9, padding: "1px 6px", borderRadius: 99, fontWeight: 800,
              background: rev!.isPublished ? "rgba(88,204,2,0.18)" : "rgba(255,136,0,0.18)",
              color: rev!.isPublished ? "#58cc02" : "#ff8800",
            }}>
              {rev!.isPublished ? "publié" : "brouillon"}
            </span>
          ) : (
            <span style={{ fontSize: 9, padding: "1px 6px", borderRadius: 99, background: "rgba(212,168,75,0.18)", color: gold, fontWeight: 800 }}>
              à rédiger
            </span>
          )}
        </div>
        <div style={{ fontWeight: 700, fontSize: 13, color: exists ? "var(--c-text)" : "var(--c-sub)", fontStyle: exists ? "normal" : "italic" }}>
          {exists ? (rev!.title || (position === "MIDDLE" ? "Mini-conversation" : "Conversation complète")) : "Cliquer pour rédiger le dialogue"}
        </div>
      </div>
      <div style={{ display: "flex", gap: 2, flexShrink: 0, alignItems: "center" }}>
        {position === "MIDDLE" && onMoveUp && (
          <button
            onClick={(e) => { e.stopPropagation(); onMoveUp(); }}
            disabled={!canMoveUp}
            style={{ background: "transparent", border: "none", cursor: canMoveUp ? "pointer" : "default", fontSize: 14, color: "var(--c-sub)", padding: 3, opacity: canMoveUp ? 1 : 0.25 }}
            title="Remonter la révision"
          >↑</button>
        )}
        {position === "MIDDLE" && onMoveDown && (
          <button
            onClick={(e) => { e.stopPropagation(); onMoveDown(); }}
            disabled={!canMoveDown}
            style={{ background: "transparent", border: "none", cursor: canMoveDown ? "pointer" : "default", fontSize: 14, color: "var(--c-sub)", padding: 3, opacity: canMoveDown ? 1 : 0.25 }}
            title="Descendre la révision"
          >↓</button>
        )}
        {exists && onDelete && (
          <button
            onClick={(e) => { e.stopPropagation(); onDelete(); }}
            style={{ background: "transparent", border: "none", cursor: "pointer", fontSize: 13, color: "#ff4b4b", padding: 4 }}
            title="Supprimer cette révision"
          >🗑️</button>
        )}
        <span style={{ fontSize: 14, color: gold, fontWeight: 900, padding: 4 }}>{exists ? "✏️" : "➕"}</span>
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
  onReorderItem: (orderedIds: string[]) => void;
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
  const askConfirm = useConfirm();

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

  async function saveVocab(targetLessonId?: string) {
    if (!editing) return;
    const moveTo = targetLessonId && targetLessonId !== lesson!.id ? targetLessonId : null;
    try {
      const payload: any = {
        word: editing.word?.trim(),
        transliteration: editing.transliteration ?? null,
        translation: editing.translation && (editing.translation as any).fr
          ? editing.translation
          : { fr: typeof editing.translation === "string" ? editing.translation : "" },
        languageId: langId,
        isPublished: editing.isPublished ?? true,
      };
      let id: string;
      if (editing.id) {
        await api(`/api/admin/vocabulary/${editing.id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        id = editing.id;
        if (moveTo) {
          // Déplacement : on détache du cours courant, on attache au cours cible.
          await api(`/api/admin/vocabulary/${id}/attach/${lesson!.id}`, { method: "DELETE" });
          await api(`/api/admin/vocabulary/${id}/attach/${moveTo}`, { method: "POST" });
        }
      } else {
        const created = await api<VocabRow>(`/api/admin/vocabulary`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        id = created.id;
        // Attache directement au cours choisi (défaut = cours courant).
        const attachTo = targetLessonId || lesson!.id;
        await api(`/api/admin/vocabulary/${id}/attach/${attachTo}`, { method: "POST" });
      }
      setEditing(null);
      onVocabChanged();
      onChanged(moveTo ? "Item déplacé + sauvegardé ✓" : "Item sauvegardé ✓");
    } catch (e: any) { onError(`Item: ${e.message}`); }
  }

  async function removeVocab(id: string) {
    const ok = await askConfirm({
      title: "Supprimer cet item de vocabulaire ?",
      confirmLabel: "Supprimer",
      tone: "danger",
    });
    if (!ok) return;
    try {
      await api(`/api/admin/vocabulary/${id}`, { method: "DELETE" });
      onVocabChanged();
    } catch (e: any) { onError(`Suppression: ${e.message}`); }
  }

  async function togglePublishedVocab(id: string, next: boolean) {
    try {
      await api(`/api/admin/vocabulary/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isPublished: next }),
      });
      onVocabChanged();
    } catch (e: any) { onError(`Publication: ${e.message}`); }
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
    const ok = await askConfirm({
      title: "Supprimer cet exercice ?",
      confirmLabel: "Supprimer",
      tone: "danger",
    });
    if (!ok) return;
    try {
      await api(`/api/admin/lessons/${lessonId}/authored-exercises/${exId}`, { method: "DELETE" });
      reloadExercises();
    } catch (e: any) { onError(`Suppression: ${e.message}`); }
  }

  async function reorderExercises(orderedIds: string[]) {
    try {
      await api(`/api/admin/lessons/${lessonId}/authored-exercises/reorder`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orderedIds }),
      });
      reloadExercises();
    } catch (e: any) { onError(`Réordonner: ${e.message}`); }
  }

  const lessonSlug = lesson.slug ?? null;
  const isItemsTab = tab === "items";
  const importHandler = isItemsTab ? onImportVocab : onImportExos;
  const exportHandler = isItemsTab ? onExportVocab : onExportExos;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 12, height: "100%", minHeight: 0 }}>
      <div style={{ display: "flex", gap: 6, alignItems: "center", flexShrink: 0 }}>
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

      <div style={{ border: "1px solid var(--c-border)", borderRadius: 10, overflow: "hidden", background: "var(--c-bg)", flex: 1, minHeight: 0, display: "flex", flexDirection: "column" }}>
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
            onTogglePublished={togglePublishedVocab}
            modules={modules}
            allLessons={allLessons}
            currentLessonId={lesson.id}
            track={modules.find(m => m.id === lesson!.moduleId)?.track ?? "DARIJA"}
          />
        ) : (
          <ExercisesTab
            exercises={exercises}
            vocab={vocab}
            onCreate={createExercise}
            onUpdate={updateExercise}
            onDelete={deleteExercise}
            onReorder={reorderExercises}
          />
        )}
      </div>
    </div>
  );
}

// ── Helper : résout une config d'exercice vers sa forme sauvegardée ─────────
//
// Pour VoixVisuel / TrouverIntrus stockés dans une révision, le runtime
// (RevisionPlayer) attend des `items` pré-résolus (audio, visual, label).
// L'éditeur admin manipule en interne un format vocabIds plus pratique ;
// cette fonction convertit au moment du save.

function resolveExerciseConfigForSave(
  typology: string,
  config: any,
  byId: Map<string, VocabRow>,
): { ok: true; config: any } | { ok: false; error: string } {
  const cfg = config ?? {};
  const prompt = typeof cfg.prompt === "string" ? cfg.prompt.trim() : "";

  if (typology === "VoixVisuel" || typology === "TrouverIntrus") {
    const ids: string[] = Array.isArray(cfg.vocabIds) ? cfg.vocabIds : [];
    const min = EXERCISE_REGISTRY[typology]?.minItems ?? 3;
    if (ids.length < min) return { ok: false, error: `min ${min} item(s) requis.` };
    const items: any[] = [];
    for (const id of ids) {
      const v = byId.get(id);
      if (!v) return { ok: false, error: `item introuvable dans le pool (id=${id}).` };
      const fr = typeof v.translation === "object" && v.translation?.fr
        ? v.translation.fr
        : v.transliteration ?? v.word;
      items.push({
        id: v.id,
        audio: { url: v.audioUrl ?? undefined, fallbackText: v.word },
        visual: { kind: "text", value: v.word, lang: "ar" as const },
        label: fr,
      });
    }
    if (typology === "VoixVisuel") {
      const mode = cfg.mode === "drag" ? "drag" : "ligne";
      return { ok: true, config: { mode, prompt: prompt || undefined, items } };
    }
    const played: string[] = Array.isArray(cfg.playedIds) ? cfg.playedIds : [];
    const validPlayed = played.filter(p => ids.includes(p));
    if (validPlayed.length === 0 || validPlayed.length >= ids.length) {
      return { ok: false, error: "playedIds doit contenir 1 à N-1 item(s)." };
    }
    return { ok: true, config: { prompt: prompt || undefined, items, playedIds: validPlayed } };
  }

  // Typologies moins adaptées aux révisions — on passe la config telle quelle.
  return { ok: true, config: cfg };
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
    case "TexteReligieux":
      return { arabe: "", fr: "", source: "" };
    case "SelectionImages":
      return {
        question: "",
        questionFr: "",
        items: [
          { emoji: "🙂", label: "", isCorrect: true },
          { emoji: "😐", label: "", isCorrect: false },
        ],
      };
    case "TriDeuxCategories":
      return {
        question: "",
        questionFr: "",
        categorieA: { label: "Catégorie A", color: "#58cc02" },
        categorieB: { label: "Catégorie B", color: "#ff4b4b" },
        items: [
          { emoji: "✅", label: "", correct: "A" },
          { emoji: "❌", label: "", correct: "B" },
        ],
      };
    case "RelierParTrait":
      return {
        question: "",
        questionFr: "",
        pairesGauche: [
          { id: "g1", emoji: "🕌", label: "" },
          { id: "g2", emoji: "📖", label: "" },
        ],
        pairesDroite: [
          { id: "d1", emoji: "", label: "" },
          { id: "d2", emoji: "", label: "" },
        ],
        correct: { g1: "d1", g2: "d2" },
      };
    case "VoixVisuel":
      return {
        mode: "ligne",
        prompt: "",
        vocabIds: ids.slice(0, Math.min(ids.length, 4)),
      };
    case "TrouverIntrus": {
      const base = ids.slice(0, Math.min(ids.length, 4));
      return {
        prompt: "",
        vocabIds: base,
        playedIds: base.slice(0, Math.max(0, base.length - 1)),
      };
    }
    default:
      return {};
  }
}

// ── Sous-onglet : Items ──────────────────────────────────────────────────────

function ItemsTab({
  vocab, editing, setEditing, onSave, onRemove, onUploadAudio, onReorder, onMove, onTogglePublished, track,
  modules, allLessons, currentLessonId,
}: {
  vocab: VocabRow[];
  editing: Partial<VocabRow> | null;
  setEditing: (e: Partial<VocabRow> | null) => void;
  onSave: (targetLessonId?: string) => void;
  onRemove: (id: string) => void;
  onUploadAudio: (id: string, file: File) => void;
  onReorder: (orderedIds: string[]) => void;
  onMove: (v: VocabRow) => void;
  onTogglePublished: (id: string, next: boolean) => void;
  track: Track;
  modules: ModuleRow[];
  allLessons: LessonRow[];
  currentLessonId: string;
}) {
  const isReligion = track === "RELIGION";
  const arabicInputRef = useRef<HTMLInputElement | HTMLTextAreaElement | null>(null);
  const [kbOpen, setKbOpen] = useState(false);

  function moveBy(idx: number, dir: -1 | 1) {
    const j = idx + dir;
    if (j < 0 || j >= vocab.length) return;
    const next = vocab.map(v => v.id);
    [next[idx], next[j]] = [next[j], next[idx]];
    onReorder(next);
  }

  // État local des sélecteurs Section/Cours dans la modale d'édition.
  // Initialisé à la section/cours courant à chaque ouverture de modale,
  // pour que "Enregistrer" sans changement ne déclenche aucun move.
  const currentLesson    = allLessons.find(l => l.id === currentLessonId);
  const currentModuleId  = currentLesson?.moduleId ?? "";
  const [targetModuleId, setTargetModuleId] = useState<string>(currentModuleId);
  const [targetLessonId, setTargetLessonId] = useState<string>(currentLessonId);

  useEffect(() => {
    if (editing) {
      setTargetModuleId(currentModuleId);
      setTargetLessonId(currentLessonId);
    }
  }, [editing?.id, currentLessonId, currentModuleId]); // eslint-disable-line react-hooks/exhaustive-deps

  const lessonsInTargetModule = useMemo(
    () => allLessons
      .filter(l => l.moduleId === targetModuleId && !l.isDeleted)
      .sort((a, b) => a.order - b.order || a.title.localeCompare(b.title)),
    [allLessons, targetModuleId],
  );

  const willMove = targetLessonId && targetLessonId !== currentLessonId;

  return (
    <>
      <div style={{ padding: 10, borderBottom: "1px solid var(--c-border)", display: "flex", justifyContent: "flex-end" }}>
        <button style={colBtn} title="Nouvel item" onClick={() => setEditing({ word: "", transliteration: "", translation: { fr: "" } })}>+</button>
      </div>

      <Modal open={!!editing} title={editing?.id ? "Modifier l'item" : "Nouvel item"} onClose={() => setEditing(null)} width={640}>
        {editing && (
          <>
            <div style={{ marginBottom: 14 }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 4 }}>
                <label style={{ ...lbl, margin: 0 }}>Arabe (avec diacritiques) *</label>
                <label style={{ display: "inline-flex", alignItems: "center", gap: 6, fontSize: 11, color: "var(--c-sub)", cursor: "pointer", userSelect: "none" }}>
                  <input type="checkbox" checked={kbOpen} onChange={(e) => setKbOpen(e.target.checked)} />
                  Afficher le clavier arabe
                </label>
              </div>
              {isReligion ? (
                <textarea
                  ref={arabicInputRef as React.RefObject<HTMLTextAreaElement>}
                  style={{ ...inp, fontFamily: 'var(--font-amiri), serif', fontSize: 20, direction: "rtl", padding: "12px 14px", minHeight: 140, lineHeight: 1.9, resize: "vertical" }}
                  autoFocus
                  value={editing.word ?? ""}
                  onChange={e => setEditing({ ...editing, word: e.target.value })}
                  placeholder="بُنِيَ الْإِسْلَامُ عَلَى خَمْسٍ …"
                />
              ) : (
                <input
                  ref={arabicInputRef as React.RefObject<HTMLInputElement>}
                  style={{ ...inp, fontFamily: 'var(--font-amiri), serif', fontSize: 18, direction: "rtl", padding: "10px 14px" }}
                  autoFocus
                  value={editing.word ?? ""}
                  onChange={e => setEditing({ ...editing, word: e.target.value })}
                  placeholder="السَّلَامُ عَلَيْكُمْ" />
              )}
              <ArabicKeyboard
                value={editing.word ?? ""}
                onChange={(next) => setEditing({ ...editing, word: next })}
                targetRef={arabicInputRef}
                open={kbOpen}
              />
            </div>
            {isReligion ? (
              <div style={{ marginBottom: 16 }}>
                <label style={lbl}>Français *</label>
                <textarea
                  style={{ ...inp, minHeight: 110, lineHeight: 1.5, padding: "10px 14px", resize: "vertical" }}
                  value={(editing.translation as any)?.fr ?? ""}
                  onChange={e => setEditing({ ...editing, translation: { fr: e.target.value } })}
                  placeholder="L'Islam est bâti sur cinq : témoigner…"
                />
              </div>
            ) : (
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
            )}
            <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 12, fontSize: 13, color: "var(--c-text)" }}>
              <input
                type="checkbox"
                id="vocab-ispublished"
                checked={editing.isPublished ?? true}
                onChange={e => setEditing({ ...editing, isPublished: e.target.checked })}
              />
              <label htmlFor="vocab-ispublished" style={{ cursor: "pointer", fontWeight: 700 }}>Publié</label>
              <span style={{ fontSize: 11, color: "var(--c-sub)", marginLeft: 8 }}>
                (décoche pour masquer l'item du parcours élève)
              </span>
            </div>

            {/* Section / Cours de destination — permet de déplacer l'item
                vers un autre cours (même section ou autre) au moment du save */}
            <div style={{
              padding: 12, marginBottom: 12, borderRadius: 8,
              background: "var(--c-bg)", border: "1px solid var(--c-border)",
            }}>
              <div style={{
                fontSize: 11, fontWeight: 800, color: "var(--c-sub)",
                textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 8,
              }}>
                Emplacement {willMove && <span style={{ color: "#ff8800" }}>· déplacement prévu</span>}
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
                <div>
                  <label style={lbl}>Section</label>
                  <select
                    style={inp}
                    value={targetModuleId}
                    onChange={e => {
                      const v = e.target.value;
                      setTargetModuleId(v);
                      const first = allLessons
                        .filter(l => l.moduleId === v && !l.isDeleted)
                        .sort((a, b) => a.order - b.order)[0];
                      setTargetLessonId(first?.id ?? "");
                    }}
                  >
                    {modules.map(m => (
                      <option key={m.id} value={m.id}>
                        {TRACK_BADGE[m.track].label} · {m.title}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label style={lbl}>Cours</label>
                  <select
                    style={inp}
                    value={targetLessonId}
                    onChange={e => setTargetLessonId(e.target.value)}
                    disabled={lessonsInTargetModule.length === 0}
                  >
                    {lessonsInTargetModule.length === 0 && (
                      <option value="">— Aucun cours —</option>
                    )}
                    {lessonsInTargetModule.map(l => (
                      <option key={l.id} value={l.id}>
                        #{l.order} · {l.title}{!l.isPublished ? " (brouillon)" : ""}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            <div style={{ display: "flex", gap: 8, justifyContent: "flex-end", paddingTop: 8, borderTop: "1px solid var(--c-border)" }}>
              <button onClick={() => setEditing(null)} style={{ padding: "8px 16px", borderRadius: 8, border: "1px solid var(--c-border)", background: "var(--c-bg)", color: "var(--c-sub)", fontSize: 13, cursor: "pointer" }}>Annuler</button>
              <button onClick={() => onSave(targetLessonId || undefined)} disabled={!editing.word || !targetLessonId} style={{ padding: "8px 18px", borderRadius: 8, border: "none", background: "#58cc02", color: "white", fontWeight: 800, fontSize: 13, cursor: "pointer", opacity: (!editing.word || !targetLessonId) ? 0.5 : 1 }}>
                {editing.id
                  ? (willMove ? "📦 Enregistrer + déplacer" : "💾 Enregistrer")
                  : (willMove ? "➕ Créer dans le cours choisi" : "➕ Créer + lier au cours")}
              </button>
            </div>
          </>
        )}
      </Modal>

      <div className="col-scroll" style={{ flex: 1, overflow: "auto" }}>
        {vocab.length === 0 ? (
          <div style={{ padding: 30, textAlign: "center", color: "var(--c-sub)", fontSize: 12 }}>Aucun item — clique ➕</div>
        ) : (
          <SortableList
            items={vocab}
            onReorder={onReorder}
            renderItem={(v, { handleProps, isDragging }) => {
              const idx = vocab.findIndex(x => x.id === v.id);
              return (
                <ItemRow
                  v={v}
                  isFirst={idx === 0}
                  isLast={idx === vocab.length - 1}
                  hideRomanisation={isReligion}
                  dragHandle={<DragHandle handleProps={handleProps} />}
                  isDragging={isDragging}
                  onEdit={() => setEditing(v)}
                  onRemove={() => onRemove(v.id)}
                  onUploadAudio={(f) => onUploadAudio(v.id, f)}
                  onUp={() => moveBy(idx, -1)}
                  onDown={() => moveBy(idx, 1)}
                  onMove={() => onMove(v)}
                  onTogglePublished={() => onTogglePublished(v.id, !(v.isPublished !== false))}
                />
              );
            }}
          />
        )}
      </div>
    </>
  );
}

function ItemRow({
  v, isFirst, isLast, hideRomanisation = false, dragHandle, isDragging, onEdit, onRemove, onUploadAudio, onUp, onDown, onMove, onTogglePublished,
}: {
  v: VocabRow;
  isFirst: boolean;
  isLast: boolean;
  hideRomanisation?: boolean;
  dragHandle?: React.ReactNode;
  isDragging?: boolean;
  onEdit: () => void;
  onRemove: () => void;
  onUploadAudio: (f: File) => void;
  onUp: () => void;
  onDown: () => void;
  onMove: () => void;
  onTogglePublished: () => void;
}) {
  const fileRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const published = v.isPublished !== false;

  return (
    <div style={{
      ...rowBase,
      cursor: "default",
      opacity: published ? 1 : 0.55,
      borderColor: isDragging ? "#58cc02" : undefined,
      boxShadow: isDragging ? "0 4px 12px rgba(0,0,0,0.15)" : undefined,
    }}>
      {dragHandle}
      <div style={{ flex: 1, minWidth: 0, display: "grid", gridTemplateColumns: hideRomanisation ? "1fr 1fr" : "1fr 1fr 1fr", gap: 8, alignItems: "center" }}>
        <div style={{ fontSize: hideRomanisation ? 14 : 18, fontFamily: "var(--font-amiri), serif", direction: "rtl", color: "var(--c-text)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", display: "flex", alignItems: "center", gap: 6 }}>
          <span style={{ flex: 1, overflow: "hidden", textOverflow: "ellipsis" }}>{v.word}</span>
          {!published && (
            <span style={{ fontSize: 9, fontWeight: 800, color: "#ff8800", background: "rgba(255,136,0,0.15)", border: "1px solid #ff8800", padding: "1px 6px", borderRadius: 4, textTransform: "uppercase", letterSpacing: "0.04em", fontFamily: "system-ui, sans-serif", direction: "ltr" }}>
              Brouillon
            </span>
          )}
        </div>
        {!hideRomanisation && (
          <div style={{ fontSize: 12, fontWeight: 700, color: "#58cc02", fontFamily: "monospace" }}>{v.transliteration ?? "—"}</div>
        )}
        <div style={{ fontSize: 12, color: "var(--c-sub)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{fmtTr(v.translation)}</div>
      </div>
      <div style={{ display: "flex", gap: 2, alignItems: "center", flexShrink: 0 }}>
        <button
          onClick={onTogglePublished}
          style={{ background: "transparent", border: "none", cursor: "pointer", color: published ? "#58cc02" : "#ff8800", fontSize: 14, padding: 4 }}
          title={published ? "Publié (cliquer pour mettre en brouillon)" : "Brouillon (cliquer pour publier)"}
        >{published ? "👁️" : "🙈"}</button>
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
  onReorder: (orderedIds: string[]) => void;
}) {
  function moveBy(idx: number, dir: -1 | 1) {
    const j = idx + dir;
    if (j < 0 || j >= exercises.length) return;
    const next = exercises.map(e => e.id);
    [next[idx], next[j]] = [next[j], next[idx]];
    onReorder(next);
  }
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

      <div className="col-scroll" style={{ flex: 1, overflow: "auto", padding: 8 }}>
        {exercises.length === 0 ? (
          <div style={{ padding: 30, textAlign: "center", color: "var(--c-sub)", fontSize: 12 }}>
            Aucun exercice — clique ➕ pour en ajouter
          </div>
        ) : (
          <SortableList
            items={exercises}
            onReorder={onReorder}
            renderItem={(ex, { handleProps, isDragging }) => {
              const idx = exercises.findIndex(e => e.id === ex.id);
              const t = EXERCISE_REGISTRY[ex.typology];
              const summary = summarizeConfig(ex.typology, ex.config, vocab);
              const published = ex.isPublished !== false;
              return (
                <div style={{
                  display: "flex", alignItems: "center", gap: 8,
                  padding: "10px 12px", marginBottom: 6,
                  background: t ? "var(--c-card)" : "rgba(255,75,75,0.08)",
                  border: `1px solid ${isDragging ? "#58cc02" : (t ? "var(--c-border)" : "#ff4b4b")}`,
                  borderRadius: 8,
                  opacity: published ? 1 : 0.55,
                  boxShadow: isDragging ? "0 4px 12px rgba(0,0,0,0.15)" : "none",
                }}>
                  <DragHandle handleProps={handleProps} />
                  <span style={{ fontSize: 11, fontWeight: 800, color: "var(--c-sub)", minWidth: 18 }}>{idx + 1}.</span>
                  <span style={{ fontSize: 18 }}>{t?.icon ?? "❓"}</span>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontWeight: 800, fontSize: 13, color: "var(--c-text)", display: "flex", alignItems: "center", gap: 6 }}>
                      {t?.label ?? ex.typology}
                      {!t && <span style={{ color: "#ff4b4b", fontSize: 10 }}>(typologie inconnue)</span>}
                      {!published && (
                        <span style={{ fontSize: 9, fontWeight: 800, color: "#ff8800", background: "rgba(255,136,0,0.15)", border: "1px solid #ff8800", padding: "1px 6px", borderRadius: 4, textTransform: "uppercase", letterSpacing: "0.04em" }}>
                          Brouillon
                        </span>
                      )}
                    </div>
                    <div style={{ fontSize: 11, color: "var(--c-sub)", marginTop: 2, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                      {summary || "— config vide"}
                    </div>
                  </div>
                  <div style={{ display: "flex", gap: 2, alignItems: "center", flexShrink: 0 }}>
                    <button
                      onClick={() => onUpdate(ex.id, { isPublished: !published })}
                      style={{ background: "transparent", border: "none", cursor: "pointer", color: published ? "#58cc02" : "#ff8800", fontSize: 14, padding: 4 }}
                      title={published ? "Publié (cliquer pour mettre en brouillon)" : "Brouillon (cliquer pour publier)"}
                    >{published ? "👁️" : "🙈"}</button>
                    <button
                      onClick={() => moveBy(idx, -1)}
                      disabled={idx === 0}
                      style={{ background: "transparent", border: "none", cursor: idx === 0 ? "default" : "pointer", color: "var(--c-sub)", fontSize: 14, opacity: idx === 0 ? 0.3 : 1 }}
                      title="Monter"
                    >↑</button>
                    <button
                      onClick={() => moveBy(idx, 1)}
                      disabled={idx === exercises.length - 1}
                      style={{ background: "transparent", border: "none", cursor: idx === exercises.length - 1 ? "default" : "pointer", color: "var(--c-sub)", fontSize: 14, opacity: idx === exercises.length - 1 ? 0.3 : 1 }}
                      title="Descendre"
                    >↓</button>
                    <button onClick={() => setEditing(ex)} style={{ background: "transparent", border: "none", cursor: "pointer", color: "var(--c-sub)", fontSize: 13, padding: 4 }} title="Éditer le contenu">✏️</button>
                    <button onClick={() => onDelete(ex.id)} style={{ background: "transparent", border: "none", cursor: "pointer", color: "#ff4b4b", fontSize: 13, padding: 4 }} title="Supprimer">🗑️</button>
                  </div>
                </div>
              );
            }}
          />
        )}
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
    case "TexteReligieux": {
      const ar = typeof cfg.arabe === "string" ? cfg.arabe : "";
      const fr = typeof cfg.fr === "string" ? cfg.fr : "";
      if (!ar && !fr) return "(vide)";
      const excerpt = (fr || ar).slice(0, 60);
      return `${excerpt}${excerpt.length === 60 ? "…" : ""}${cfg.source ? ` · ${cfg.source}` : ""}`;
    }
    case "SelectionImages": {
      const items = Array.isArray(cfg.items) ? cfg.items : [];
      const correct = items.filter((i: any) => i?.isCorrect).length;
      const mode = cfg.freeSelection ? "libre" : `${correct} correct(s)`;
      return `${items.length} item(s) · ${mode}`;
    }
    case "TriDeuxCategories": {
      const items = Array.isArray(cfg.items) ? cfg.items : [];
      const a = items.filter((i: any) => i?.correct === "A").length;
      const b = items.filter((i: any) => i?.correct === "B").length;
      const labA = cfg.categorieA?.label ?? "A";
      const labB = cfg.categorieB?.label ?? "B";
      return `${labA} (${a}) · ${labB} (${b})`;
    }
    case "RelierParTrait": {
      const pg = Array.isArray(cfg.pairesGauche) ? cfg.pairesGauche : [];
      const pd = Array.isArray(cfg.pairesDroite) ? cfg.pairesDroite : [];
      const pairs = cfg.correct ? Object.keys(cfg.correct).length : 0;
      return `${pg.length}↔${pd.length} · ${pairs} paire(s)`;
    }
    case "VoixVisuel": {
      const ids: string[] = Array.isArray(cfg.vocabIds) ? cfg.vocabIds : [];
      const mode = cfg.mode === 'drag' ? 'glisser' : 'ligne';
      return `${ids.length} mot(s) · mode ${mode}`;
    }
    case "TrouverIntrus": {
      const ids: string[] = Array.isArray(cfg.vocabIds) ? cfg.vocabIds : [];
      const played: string[] = Array.isArray(cfg.playedIds) ? cfg.playedIds : [];
      return `${ids.length} visuel(s) · ${played.length} voix jouée(s)`;
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
  const [localPublished, setLocalPublished] = useState<boolean>(exercise.isPublished !== false);
  const [showPreview, setShowPreview] = useState<boolean>(true);
  const t = EXERCISE_REGISTRY[exercise.typology];

  const initialPublished = exercise.isPublished !== false;
  const dirty =
    JSON.stringify(local) !== JSON.stringify(exercise.config ?? {}) ||
    localPublished !== initialPublished;
  const needsVocab = (t?.minItems ?? 0) > 0;

  return (
    <Modal
      open
      title={`${t?.icon ?? ""} ${t?.label ?? exercise.typology} — éditer le contenu`}
      onClose={onClose}
      width={720}
    >
      {needsVocab && vocab.length === 0 ? (
        <div style={{ padding: 30, textAlign: "center", color: "var(--c-sub)", fontSize: 13 }}>
          Aucun item disponible. Ajoute d'abord des mots dans l'onglet Items.
        </div>
      ) : (
        <>
          <ExerciseConfigEditor typology={exercise.typology} config={local} vocab={vocab} onChange={setLocal} />
          <div style={{ marginTop: 18, paddingTop: 14, borderTop: "1px dashed var(--c-border)" }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 10 }}>
              <div style={{ fontSize: 13, fontWeight: 800, color: "var(--c-text)" }}>
                👁️ Aperçu live
              </div>
              <button
                type="button"
                onClick={() => setShowPreview(v => !v)}
                style={{ padding: "4px 10px", borderRadius: 6, border: "1px solid var(--c-border)", background: "var(--c-bg)", color: "var(--c-sub)", fontSize: 11, cursor: "pointer", fontWeight: 700 }}
              >
                {showPreview ? "Masquer" : "Afficher"}
              </button>
            </div>
            {showPreview && (
              <div style={{ padding: 10, background: "#1a1f26", borderRadius: 12, border: "1px solid var(--c-border)", overflow: "hidden" }}>
                <div style={{ zoom: 0.7 }}>
                  <ExercisePreview typology={exercise.typology} config={local} vocab={vocab} />
                </div>
              </div>
            )}
          </div>
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
      <div style={{ display: "flex", alignItems: "center", gap: 6, marginTop: 14, paddingTop: 12, borderTop: "1px dashed var(--c-border)", fontSize: 13, color: "var(--c-text)" }}>
        <input
          type="checkbox"
          id="ex-ispublished"
          checked={localPublished}
          onChange={e => setLocalPublished(e.target.checked)}
        />
        <label htmlFor="ex-ispublished" style={{ cursor: "pointer", fontWeight: 700 }}>Publié</label>
        <span style={{ fontSize: 11, color: "var(--c-sub)", marginLeft: 8 }}>
          (décoche pour masquer l'exercice du parcours élève)
        </span>
      </div>
      <div style={{ display: "flex", gap: 8, justifyContent: "flex-end", paddingTop: 12, marginTop: 14, borderTop: "1px solid var(--c-border)" }}>
        <button onClick={onClose} style={{ padding: "8px 16px", borderRadius: 8, border: "1px solid var(--c-border)", background: "var(--c-bg)", color: "var(--c-sub)", fontSize: 13, cursor: "pointer" }}>Annuler</button>
        <button
          onClick={() => onSave({ config: local, isPublished: localPublished })}
          disabled={!dirty}
          style={{ padding: "8px 18px", borderRadius: 8, border: "none", background: "#58cc02", color: "white", fontWeight: 800, fontSize: 13, cursor: dirty ? "pointer" : "default", opacity: dirty ? 1 : 0.4 }}
        >💾 Enregistrer</button>
      </div>
    </Modal>
  );
}

// ── Sous-éditeurs ──────────────────────────────────────────────────────────

function TexteReligieuxEditor({ cfg, onChange }: { cfg: any; onChange: (next: any) => void }) {
  const arabe  = typeof cfg.arabe  === "string" ? cfg.arabe  : "";
  const fr     = typeof cfg.fr     === "string" ? cfg.fr     : "";
  const source = typeof cfg.source === "string" ? cfg.source : "";
  const titre  = typeof cfg.titre  === "string" ? cfg.titre  : "";
  const arabeRef = useRef<HTMLTextAreaElement | null>(null);
  const [kbOpen, setKbOpen] = useState(false);
  return (
    <>
      <div style={{ fontSize: 12, color: "var(--c-sub)", marginBottom: 10 }}>
        Écran de lecture : saisis un bloc arabe (hadith, verset…) et sa traduction française. Pas de romanisation, pas de distracteurs.
      </div>
      <div style={{ marginBottom: 14 }}>
        <label style={lbl}>Titre (optionnel)</label>
        <input
          style={inp}
          value={titre}
          onChange={(e) => onChange({ ...cfg, titre: e.target.value })}
          placeholder="ex. Hadith de l'unité"
        />
      </div>
      <div style={{ marginBottom: 14 }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 4 }}>
          <label style={{ ...lbl, margin: 0 }}>Texte arabe (avec diacritiques) *</label>
          <label style={{ display: "inline-flex", alignItems: "center", gap: 6, fontSize: 11, color: "var(--c-sub)", cursor: "pointer", userSelect: "none" }}>
            <input type="checkbox" checked={kbOpen} onChange={(e) => setKbOpen(e.target.checked)} />
            Afficher le clavier arabe
          </label>
        </div>
        <textarea
          ref={arabeRef}
          style={{ ...inp, fontFamily: 'var(--font-amiri), serif', fontSize: 18, direction: "rtl", padding: "12px 14px", minHeight: 140, lineHeight: 1.8, resize: "vertical" }}
          value={arabe}
          onChange={(e) => onChange({ ...cfg, arabe: e.target.value })}
          placeholder="بُنِيَ الْإِسْلَامُ عَلَى خَمْسٍ …"
        />
        <ArabicKeyboard
          value={arabe}
          onChange={(next) => onChange({ ...cfg, arabe: next })}
          targetRef={arabeRef}
          open={kbOpen}
        />
      </div>
      <div style={{ marginBottom: 14 }}>
        <label style={lbl}>Traduction française *</label>
        <textarea
          style={{ ...inp, minHeight: 110, lineHeight: 1.5, resize: "vertical", padding: "10px 14px" }}
          value={fr}
          onChange={(e) => onChange({ ...cfg, fr: e.target.value })}
          placeholder="L'Islam est bâti sur cinq…"
        />
      </div>
      <div>
        <label style={lbl}>Source (optionnelle)</label>
        <input
          style={inp}
          value={source}
          onChange={(e) => onChange({ ...cfg, source: e.target.value })}
          placeholder="ex. Rapporté par al-Bukhārī et Muslim"
        />
      </div>
      <div style={{ fontSize: 11, color: (!arabe || !fr) ? "#ff4b4b" : "var(--c-sub)", marginTop: 8, fontWeight: 700 }}>
        {(!arabe || !fr) ? "Arabe et français sont obligatoires" : "✓ prêt"}
      </div>
    </>
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
    case "TexteReligieux": {
      return <TexteReligieuxEditor cfg={cfg} onChange={onChange} />;
    }
    case "SelectionImages": {
      const items: Array<{ emoji?: string; label?: string; isCorrect?: boolean }> =
        Array.isArray(cfg.items) ? cfg.items : [];
      const freeSelection = cfg.freeSelection === true;
      const correctCount = items.filter(i => i.isCorrect).length;
      return (
        <>
          <div style={{ fontSize: 12, color: "var(--c-sub)", marginBottom: 10 }}>
            Exercice à sélection multiple avec emoji + label. Coche les réponses attendues (sauf mode libre).
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 12 }}>
            <div>
              <label style={lbl}>Question (arabe, avec chakle)</label>
              <input style={{ ...inp, direction: "rtl", fontSize: 16 }}
                value={cfg.question ?? ""}
                onChange={e => onChange({ ...cfg, question: e.target.value })}
                placeholder="اِخْتَرِ اَلْجَوَابَ" />
            </div>
            <div>
              <label style={lbl}>Question (français)</label>
              <input style={inp}
                value={cfg.questionFr ?? ""}
                onChange={e => onChange({ ...cfg, questionFr: e.target.value })}
                placeholder="Lesquels sont vrais ?" />
            </div>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 12, flexWrap: "wrap" }}>
            <label style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 12, fontWeight: 700 }}>
              <input type="checkbox" checked={freeSelection}
                onChange={e => onChange({ ...cfg, freeSelection: e.target.checked })} />
              Sélection libre (pas de bonne réponse)
            </label>
            {!freeSelection && (
              <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                <span style={{ fontSize: 11, color: "var(--c-sub)", fontWeight: 700 }}>Min à cocher :</span>
                <input type="number" min={0} style={{ ...inp, width: 70, padding: "6px 8px" }}
                  value={typeof cfg.minSelection === "number" ? cfg.minSelection : ""}
                  onChange={e => {
                    const v = e.target.value;
                    onChange({ ...cfg, minSelection: v === "" ? undefined : Number(v) });
                  }}
                  placeholder="auto" />
              </div>
            )}
          </div>
          <div>
            <div style={{ ...lbl, marginBottom: 8 }}>Items</div>
            <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
              {items.map((it, idx) => (
                <div key={idx} style={{
                  display: "grid", gridTemplateColumns: "60px 1fr auto auto", gap: 8,
                  alignItems: "center", padding: "8px 10px",
                  border: "1px solid var(--c-border)", borderRadius: 10, background: "var(--c-bg)",
                }}>
                  <input style={{ ...inp, textAlign: "center", fontSize: 22, padding: "6px 8px" }}
                    maxLength={4}
                    value={it.emoji ?? ""}
                    onChange={e => {
                      const next = [...items]; next[idx] = { ...next[idx], emoji: e.target.value };
                      onChange({ ...cfg, items: next });
                    }}
                    placeholder="🙂" />
                  <input style={inp}
                    value={it.label ?? ""}
                    onChange={e => {
                      const next = [...items]; next[idx] = { ...next[idx], label: e.target.value };
                      onChange({ ...cfg, items: next });
                    }}
                    placeholder="Libellé (optionnel)" />
                  {!freeSelection && (
                    <label style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 11, fontWeight: 700 }}>
                      <input type="checkbox" checked={!!it.isCorrect}
                        onChange={e => {
                          const next = [...items]; next[idx] = { ...next[idx], isCorrect: e.target.checked };
                          onChange({ ...cfg, items: next });
                        }} />
                      Correct
                    </label>
                  )}
                  <button type="button" style={{ ...colBtnGhost, padding: "4px 8px" }}
                    onClick={() => {
                      const next = items.filter((_, i) => i !== idx);
                      onChange({ ...cfg, items: next });
                    }}>🗑</button>
                </div>
              ))}
            </div>
            <button type="button"
              onClick={() => onChange({ ...cfg, items: [...items, { emoji: "🙂", label: "", isCorrect: false }] })}
              style={{ marginTop: 10, padding: "7px 12px", borderRadius: 8, border: "1.5px dashed var(--c-border)", background: "var(--c-bg)", color: "var(--c-sub)", fontSize: 12, fontWeight: 800, cursor: "pointer" }}>
              + Ajouter un item
            </button>
            <div style={{ fontSize: 11, color: items.length < 2 ? "#ff4b4b" : "var(--c-sub)", marginTop: 8, fontWeight: 700 }}>
              {items.length} item(s){!freeSelection && ` · ${correctCount} marqué(s) "correct"`}{items.length < 2 && " · min 2 requis"}
            </div>
          </div>
        </>
      );
    }
    case "TriDeuxCategories": {
      const items: Array<{ emoji?: string; label?: string; correct: "A" | "B" }> =
        Array.isArray(cfg.items) ? cfg.items : [];
      const catA = cfg.categorieA ?? { label: "A" };
      const catB = cfg.categorieB ?? { label: "B" };
      return (
        <>
          <div style={{ fontSize: 12, color: "var(--c-sub)", marginBottom: 10 }}>
            Trie chaque item dans la catégorie A ou B. Idéal pour "ce qu'Allah aime" / "ce qu'Allah n'aime pas".
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 12 }}>
            <div>
              <label style={lbl}>Question (arabe)</label>
              <input style={{ ...inp, direction: "rtl", fontSize: 16 }}
                value={cfg.question ?? ""}
                onChange={e => onChange({ ...cfg, question: e.target.value })} />
            </div>
            <div>
              <label style={lbl}>Question (français)</label>
              <input style={inp}
                value={cfg.questionFr ?? ""}
                onChange={e => onChange({ ...cfg, questionFr: e.target.value })} />
            </div>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 14 }}>
            <div style={{ padding: 10, border: "1.5px solid var(--c-border)", borderRadius: 10, background: "rgba(88,204,2,0.05)" }}>
              <label style={lbl}>Catégorie A</label>
              <input style={inp}
                value={catA.label ?? ""}
                onChange={e => onChange({ ...cfg, categorieA: { ...catA, label: e.target.value } })}
                placeholder="Ce qu'Allah aime" />
              <div style={{ marginTop: 6, display: "flex", alignItems: "center", gap: 6 }}>
                <span style={{ fontSize: 10, color: "var(--c-sub)", fontWeight: 700 }}>Couleur :</span>
                <input type="color" value={catA.color ?? "#58cc02"}
                  onChange={e => onChange({ ...cfg, categorieA: { ...catA, color: e.target.value } })} />
              </div>
            </div>
            <div style={{ padding: 10, border: "1.5px solid var(--c-border)", borderRadius: 10, background: "rgba(255,75,75,0.05)" }}>
              <label style={lbl}>Catégorie B</label>
              <input style={inp}
                value={catB.label ?? ""}
                onChange={e => onChange({ ...cfg, categorieB: { ...catB, label: e.target.value } })}
                placeholder="Ce qu'Allah n'aime pas" />
              <div style={{ marginTop: 6, display: "flex", alignItems: "center", gap: 6 }}>
                <span style={{ fontSize: 10, color: "var(--c-sub)", fontWeight: 700 }}>Couleur :</span>
                <input type="color" value={catB.color ?? "#ff4b4b"}
                  onChange={e => onChange({ ...cfg, categorieB: { ...catB, color: e.target.value } })} />
              </div>
            </div>
          </div>
          <div>
            <div style={{ ...lbl, marginBottom: 8 }}>Items à trier</div>
            <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
              {items.map((it, idx) => (
                <div key={idx} style={{
                  display: "grid", gridTemplateColumns: "60px 1fr auto auto", gap: 8,
                  alignItems: "center", padding: "8px 10px",
                  border: "1px solid var(--c-border)", borderRadius: 10, background: "var(--c-bg)",
                }}>
                  <input style={{ ...inp, textAlign: "center", fontSize: 22, padding: "6px 8px" }}
                    maxLength={4}
                    value={it.emoji ?? ""}
                    onChange={e => {
                      const next = [...items]; next[idx] = { ...next[idx], emoji: e.target.value };
                      onChange({ ...cfg, items: next });
                    }}
                    placeholder="✅" />
                  <input style={inp}
                    value={it.label ?? ""}
                    onChange={e => {
                      const next = [...items]; next[idx] = { ...next[idx], label: e.target.value };
                      onChange({ ...cfg, items: next });
                    }}
                    placeholder="Libellé" />
                  <select style={{ ...inp, width: 120, padding: "6px 8px" }}
                    value={it.correct}
                    onChange={e => {
                      const next = [...items]; next[idx] = { ...next[idx], correct: e.target.value as "A" | "B" };
                      onChange({ ...cfg, items: next });
                    }}>
                    <option value="A">→ {catA.label ?? "A"}</option>
                    <option value="B">→ {catB.label ?? "B"}</option>
                  </select>
                  <button type="button" style={{ ...colBtnGhost, padding: "4px 8px" }}
                    onClick={() => {
                      const next = items.filter((_, i) => i !== idx);
                      onChange({ ...cfg, items: next });
                    }}>🗑</button>
                </div>
              ))}
            </div>
            <button type="button"
              onClick={() => onChange({ ...cfg, items: [...items, { emoji: "✅", label: "", correct: "A" }] })}
              style={{ marginTop: 10, padding: "7px 12px", borderRadius: 8, border: "1.5px dashed var(--c-border)", background: "var(--c-bg)", color: "var(--c-sub)", fontSize: 12, fontWeight: 800, cursor: "pointer" }}>
              + Ajouter un item
            </button>
            <div style={{ fontSize: 11, color: items.length < 2 ? "#ff4b4b" : "var(--c-sub)", marginTop: 8, fontWeight: 700 }}>
              {items.length} item(s) · A: {items.filter(i => i.correct === "A").length} / B: {items.filter(i => i.correct === "B").length}
            </div>
          </div>
        </>
      );
    }
    case "RelierParTrait": {
      const pg: Array<{ id: string; emoji?: string; label?: string }> =
        Array.isArray(cfg.pairesGauche) ? cfg.pairesGauche : [];
      const pd: Array<{ id: string; emoji?: string; label?: string }> =
        Array.isArray(cfg.pairesDroite) ? cfg.pairesDroite : [];
      const correct: Record<string, string> =
        cfg.correct && typeof cfg.correct === "object" ? cfg.correct : {};
      const nextId = (prefix: string, existing: Array<{ id: string }>) => {
        let i = existing.length + 1;
        while (existing.some(x => x.id === `${prefix}${i}`)) i++;
        return `${prefix}${i}`;
      };
      return (
        <>
          <div style={{ fontSize: 12, color: "var(--c-sub)", marginBottom: 10 }}>
            Chaque item de gauche se relie à un item de droite. Définis les paires correctes dans la table d'association.
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 14 }}>
            <div>
              <label style={lbl}>Question (arabe)</label>
              <input style={{ ...inp, direction: "rtl", fontSize: 16 }}
                value={cfg.question ?? ""}
                onChange={e => onChange({ ...cfg, question: e.target.value })} />
            </div>
            <div>
              <label style={lbl}>Question (français)</label>
              <input style={inp}
                value={cfg.questionFr ?? ""}
                onChange={e => onChange({ ...cfg, questionFr: e.target.value })} />
            </div>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 14 }}>
            <div>
              <div style={{ ...lbl, marginBottom: 6 }}>Côté gauche (source)</div>
              <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                {pg.map((n, idx) => (
                  <div key={n.id} style={{
                    display: "grid", gridTemplateColumns: "50px 1fr auto", gap: 6,
                    alignItems: "center", padding: "6px 8px",
                    border: "1px solid var(--c-border)", borderRadius: 10, background: "var(--c-bg)",
                  }}>
                    <input style={{ ...inp, textAlign: "center", fontSize: 20, padding: "4px 6px" }}
                      maxLength={4}
                      value={n.emoji ?? ""}
                      onChange={e => {
                        const next = [...pg]; next[idx] = { ...next[idx], emoji: e.target.value };
                        onChange({ ...cfg, pairesGauche: next });
                      }} />
                    <input style={inp}
                      value={n.label ?? ""}
                      onChange={e => {
                        const next = [...pg]; next[idx] = { ...next[idx], label: e.target.value };
                        onChange({ ...cfg, pairesGauche: next });
                      }}
                      placeholder="Libellé" />
                    <button type="button" style={{ ...colBtnGhost, padding: "4px 8px" }}
                      onClick={() => {
                        const removed = pg[idx].id;
                        const next = pg.filter((_, i) => i !== idx);
                        const nextCorrect = { ...correct }; delete nextCorrect[removed];
                        onChange({ ...cfg, pairesGauche: next, correct: nextCorrect });
                      }}>🗑</button>
                  </div>
                ))}
              </div>
              <button type="button"
                onClick={() => onChange({ ...cfg, pairesGauche: [...pg, { id: nextId("g", pg), emoji: "", label: "" }] })}
                style={{ marginTop: 8, padding: "6px 10px", borderRadius: 8, border: "1.5px dashed var(--c-border)", background: "var(--c-bg)", color: "var(--c-sub)", fontSize: 11, fontWeight: 800, cursor: "pointer" }}>
                + Ajouter à gauche
              </button>
            </div>
            <div>
              <div style={{ ...lbl, marginBottom: 6 }}>Côté droit (cibles)</div>
              <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                {pd.map((n, idx) => (
                  <div key={n.id} style={{
                    display: "grid", gridTemplateColumns: "50px 1fr auto", gap: 6,
                    alignItems: "center", padding: "6px 8px",
                    border: "1px solid var(--c-border)", borderRadius: 10, background: "var(--c-bg)",
                  }}>
                    <input style={{ ...inp, textAlign: "center", fontSize: 20, padding: "4px 6px" }}
                      maxLength={4}
                      value={n.emoji ?? ""}
                      onChange={e => {
                        const next = [...pd]; next[idx] = { ...next[idx], emoji: e.target.value };
                        onChange({ ...cfg, pairesDroite: next });
                      }} />
                    <input style={inp}
                      value={n.label ?? ""}
                      onChange={e => {
                        const next = [...pd]; next[idx] = { ...next[idx], label: e.target.value };
                        onChange({ ...cfg, pairesDroite: next });
                      }}
                      placeholder="Libellé" />
                    <button type="button" style={{ ...colBtnGhost, padding: "4px 8px" }}
                      onClick={() => {
                        const removed = pd[idx].id;
                        const next = pd.filter((_, i) => i !== idx);
                        const nextCorrect: Record<string, string> = {};
                        for (const [k, v] of Object.entries(correct)) if (v !== removed) nextCorrect[k] = v;
                        onChange({ ...cfg, pairesDroite: next, correct: nextCorrect });
                      }}>🗑</button>
                  </div>
                ))}
              </div>
              <button type="button"
                onClick={() => onChange({ ...cfg, pairesDroite: [...pd, { id: nextId("d", pd), emoji: "", label: "" }] })}
                style={{ marginTop: 8, padding: "6px 10px", borderRadius: 8, border: "1.5px dashed var(--c-border)", background: "var(--c-bg)", color: "var(--c-sub)", fontSize: 11, fontWeight: 800, cursor: "pointer" }}>
                + Ajouter à droite
              </button>
            </div>
          </div>
          <div>
            <div style={{ ...lbl, marginBottom: 8 }}>Paires correctes (gauche → droite)</div>
            <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
              {pg.map(g => (
                <div key={g.id} style={{
                  display: "grid", gridTemplateColumns: "1fr auto 1fr", gap: 8,
                  alignItems: "center", padding: "6px 10px",
                  border: "1px solid var(--c-border)", borderRadius: 10, background: "var(--c-bg)",
                }}>
                  <div style={{ fontSize: 13, fontWeight: 700 }}>
                    <span style={{ fontSize: 18, marginRight: 6 }}>{g.emoji}</span>
                    {g.label || <span style={{ color: "var(--c-sub)", fontStyle: "italic" }}>(sans libellé)</span>}
                  </div>
                  <span style={{ fontSize: 12, color: "var(--c-sub)" }}>→</span>
                  <select style={inp}
                    value={correct[g.id] ?? ""}
                    onChange={e => {
                      const val = e.target.value;
                      const nextCorrect = { ...correct };
                      if (val) nextCorrect[g.id] = val; else delete nextCorrect[g.id];
                      onChange({ ...cfg, correct: nextCorrect });
                    }}>
                    <option value="">— Choisir —</option>
                    {pd.map(d => (
                      <option key={d.id} value={d.id}>
                        {d.emoji ? `${d.emoji} ` : ""}{d.label || d.id}
                      </option>
                    ))}
                  </select>
                </div>
              ))}
            </div>
            <div style={{ fontSize: 11, color: Object.keys(correct).length < pg.length ? "#ff4b4b" : "var(--c-sub)", marginTop: 8, fontWeight: 700 }}>
              {Object.keys(correct).length} / {pg.length} paires définies
            </div>
          </div>
        </>
      );
    }
    case "VoixVisuel": {
      const ids: string[] = Array.isArray(cfg.vocabIds) ? cfg.vocabIds : [];
      const mode: 'ligne' | 'drag' = cfg.mode === 'drag' ? 'drag' : 'ligne';
      const min = EXERCISE_REGISTRY["VoixVisuel"]?.minItems ?? 3;
      return (
        <>
          <div style={{ marginBottom: 14 }}>
            <label style={lbl}>Mode d'interaction</label>
            <div style={{ display: "flex", gap: 8 }}>
              {(["ligne", "drag"] as const).map((m) => (
                <button
                  key={m}
                  type="button"
                  onClick={() => onChange({ ...cfg, mode: m })}
                  style={{
                    flex: 1, padding: "10px 12px", borderRadius: 10,
                    border: `2px solid ${mode === m ? "#58cc02" : "var(--c-border)"}`,
                    background: mode === m ? "rgba(88,204,2,0.12)" : "var(--c-bg)",
                    color: "var(--c-text)", fontWeight: 800, fontSize: 12, cursor: "pointer",
                  }}
                >
                  {m === "ligne" ? "🖱️ Clique pour relier" : "✋ Glisser-déposer"}
                </button>
              ))}
            </div>
          </div>
          <div style={{ fontSize: 12, color: "var(--c-sub)", marginBottom: 10 }}>
            Choisis les mots (l'audio + le mot arabe seront utilisés comme visuel). <strong>Minimum : {min}</strong>
          </div>
          <VocabMultiPicker vocab={vocab} selected={ids} onChange={(next) => onChange({ ...cfg, vocabIds: next })} />
          <div style={{ fontSize: 11, color: ids.length < min ? "#ff4b4b" : "var(--c-sub)", marginTop: 8, fontWeight: 700 }}>
            {ids.length} sélectionné(s) {ids.length < min && `· ${min - ids.length} manquant(s)`}
          </div>
        </>
      );
    }
    case "TrouverIntrus": {
      const ids: string[] = Array.isArray(cfg.vocabIds) ? cfg.vocabIds : [];
      const played: string[] = Array.isArray(cfg.playedIds) ? cfg.playedIds : [];
      const min = EXERCISE_REGISTRY["TrouverIntrus"]?.minItems ?? 3;
      const togglePlayed = (id: string) => {
        const next = played.includes(id) ? played.filter((x) => x !== id) : [...played, id];
        onChange({ ...cfg, playedIds: next });
      };
      return (
        <>
          <div style={{ fontSize: 12, color: "var(--c-sub)", marginBottom: 10 }}>
            Choisis les visuels affichés. <strong>Minimum : {min}</strong>
          </div>
          <VocabMultiPicker
            vocab={vocab}
            selected={ids}
            onChange={(next) => onChange({ ...cfg, vocabIds: next, playedIds: played.filter((p) => next.includes(p)) })}
          />
          <div style={{ fontSize: 11, color: ids.length < min ? "#ff4b4b" : "var(--c-sub)", marginTop: 8, fontWeight: 700 }}>
            {ids.length} visuel(s) {ids.length < min && `· ${min - ids.length} manquant(s)`}
          </div>
          <div style={{ marginTop: 14 }}>
            <label style={lbl}>Voix prononcées (l'intrus = visuel NON coché)</label>
            <div style={{ display: "flex", flexDirection: "column", gap: 4, maxHeight: 180, overflow: "auto", border: "1px solid var(--c-border)", borderRadius: 8, padding: 6, background: "var(--c-bg)" }}>
              {ids.length === 0 && (
                <div style={{ fontSize: 11, color: "var(--c-sub)", padding: 6 }}>Sélectionne d'abord les visuels ci-dessus.</div>
              )}
              {ids.map((id) => {
                const v = vocab.find((x) => x.id === id);
                if (!v) return null;
                const on = played.includes(id);
                return (
                  <label key={id} style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 12, cursor: "pointer", padding: "4px 6px", borderRadius: 6, background: on ? "rgba(88,204,2,0.08)" : "transparent" }}>
                    <input type="checkbox" checked={on} onChange={() => togglePlayed(id)} />
                    <span style={{ fontWeight: 700 }}>{v.word}</span>
                    {v.transliteration && <span style={{ color: "var(--c-sub)" }}>· {v.transliteration}</span>}
                  </label>
                );
              })}
            </div>
            <div style={{ fontSize: 11, color: played.length === 0 || played.length >= ids.length ? "#ff4b4b" : "var(--c-sub)", marginTop: 6, fontWeight: 700 }}>
              {played.length} / {ids.length} voix jouées
              {played.length === 0 && " · coche au moins 1 voix"}
              {played.length >= ids.length && ids.length > 0 && " · il faut laisser 1 intrus non coché"}
            </div>
          </div>
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
