"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";

type Lesson = {
  id: string;
  title: string;
  slug: string | null;
  subtitle: string | null;
  order: number;
  level: number;
  videoUrl: string | null;
  moduleId: string | null;
  languageId: string;
  isPublished: boolean;
  isDeleted: boolean;
};

type ModuleRow = { id: string; slug: string; title: string; level: number; isPublished: boolean };
type Language  = { id: string; code: string; name: string };

const empty: Partial<Lesson> = {
  title: "", slug: "", subtitle: "", order: 0, level: 1,
  videoUrl: "", moduleId: "", languageId: "", isPublished: true,
};

const inp: React.CSSProperties = {
  width: "100%", padding: "8px 12px", borderRadius: 8,
  border: "1.5px solid var(--c-border)", background: "var(--c-bg)",
  color: "var(--c-text)", fontSize: 13, outline: "none", boxSizing: "border-box",
};
const lbl: React.CSSProperties = { fontSize: 11, fontWeight: 700, color: "var(--c-sub)", display: "block", marginBottom: 4 };

export default function AdminLessonsPage() {
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [modules, setModules] = useState<ModuleRow[]>([]);
  const [languages, setLanguages] = useState<Language[]>([]);
  const [filter, setFilter] = useState<"all" | "msa" | "darija" | "deleted">("all");
  const [search, setSearch] = useState("");
  const [form, setForm] = useState<Partial<Lesson>>(empty);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState<{ ok: boolean; text: string } | null>(null);

  const loadAll = useCallback(async () => {
    const [lsRes, metaRes] = await Promise.all([
      fetch("/api/admin/lessons", { credentials: "include" }),
      fetch("/api/admin/lessons/meta", { credentials: "include" }),
    ]);
    if (lsRes.ok) setLessons(await lsRes.json());
    if (metaRes.ok) {
      const m = await metaRes.json();
      setLanguages(m.languages ?? []);
      setModules(m.modules ?? []);
    }
  }, []);

  useEffect(() => { loadAll(); }, [loadAll]);

  function moduleOf(id: string | null) {
    return modules.find(m => m.id === id);
  }

  const visible = lessons
    .filter(l => filter !== "deleted" ? !l.isDeleted : l.isDeleted)
    .filter(l => {
      if (filter === "msa")    return moduleOf(l.moduleId)?.slug?.startsWith("msa-");
      if (filter === "darija") return l.moduleId && !moduleOf(l.moduleId)?.slug?.startsWith("msa-");
      return true;
    })
    .filter(l => {
      if (!search.trim()) return true;
      const s = search.toLowerCase();
      return l.title.toLowerCase().includes(s) || l.slug?.toLowerCase().includes(s);
    })
    .sort((a, b) => (a.level - b.level) || a.order - b.order);

  function startEdit(l: Lesson) {
    setEditingId(l.id);
    setForm({
      title: l.title, slug: l.slug ?? "", subtitle: l.subtitle ?? "",
      order: l.order, level: l.level, videoUrl: l.videoUrl ?? "",
      moduleId: l.moduleId ?? "", languageId: l.languageId,
      isPublished: l.isPublished,
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function resetForm() { setEditingId(null); setForm(empty); }

  async function save() {
    setBusy(true); setMsg(null);
    try {
      const payload: any = { ...form };
      // Nettoyer les champs vides optionnels
      ["slug", "subtitle", "videoUrl", "moduleId"].forEach(k => {
        if (payload[k] === "") payload[k] = null;
      });

      const url = editingId ? `/api/admin/lessons/${editingId}` : "/api/admin/lessons";
      const method = editingId ? "PATCH" : "POST";
      const r = await fetch(url, {
        method, credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const d = await r.json().catch(() => ({}));
      if (!r.ok) {
        setMsg({ ok: false, text: d.message || d.error || `Erreur ${r.status}` });
      } else {
        setMsg({ ok: true, text: editingId ? "Leçon mise à jour ✓" : "Leçon créée ✓" });
        resetForm();
        loadAll();
      }
    } catch (e: any) {
      setMsg({ ok: false, text: e.message });
    }
    setBusy(false);
    setTimeout(() => setMsg(null), 4000);
  }

  async function remove(id: string, hard: boolean) {
    const label = hard ? "SUPPRIMER DÉFINITIVEMENT" : "archiver";
    if (!confirm(`Voulez-vous ${label} cette leçon ?${hard ? "\n\nCela supprimera aussi ses exercices et la progression des utilisateurs." : ""}`)) return;
    setBusy(true);
    const r = await fetch(`/api/admin/lessons/${id}${hard ? "?hard=true" : ""}`, {
      method: "DELETE", credentials: "include",
    });
    setBusy(false);
    if (r.ok) { setMsg({ ok: true, text: hard ? "Supprimée définitivement" : "Archivée" }); loadAll(); }
    else      { setMsg({ ok: false, text: `Erreur ${r.status}` }); }
    setTimeout(() => setMsg(null), 4000);
  }

  async function restore(id: string) {
    const r = await fetch(`/api/admin/lessons/${id}`, {
      method: "PATCH", credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ isDeleted: false, isPublished: false }),
    });
    if (r.ok) { setMsg({ ok: true, text: "Restaurée — pensez à la republier" }); loadAll(); }
    setTimeout(() => setMsg(null), 4000);
  }

  return (
    <div style={{ maxWidth: 1100, margin: "0 auto", padding: "24px 20px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
        <div>
          <h1 style={{ fontSize: 22, fontWeight: 900, margin: 0 }}>📚 Gestion des leçons</h1>
          <p style={{ fontSize: 12, color: "var(--c-sub)", marginTop: 2 }}>Créer / modifier / archiver</p>
        </div>
        <Link href="/admin" style={{ fontSize: 13, color: "var(--c-sub)", textDecoration: "none" }}>← Retour admin</Link>
      </div>

      {/* Formulaire */}
      <div style={{ background: "var(--c-card)", border: "1px solid var(--c-border)", borderRadius: 14, padding: "18px 20px", marginBottom: 24 }}>
        <h2 style={{ fontSize: 14, fontWeight: 800, margin: "0 0 14px" }}>
          {editingId ? `✏️ Éditer la leçon` : "➕ Nouvelle leçon"}
        </h2>

        <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: 12, marginBottom: 12 }}>
          <div>
            <label style={lbl}>TITRE *</label>
            <input style={inp} value={form.title ?? ""} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} placeholder="Mon prénom" />
          </div>
          <div>
            <label style={lbl}>SLUG (optionnel, unique)</label>
            <input style={inp} value={form.slug ?? ""} onChange={e => setForm(f => ({ ...f, slug: e.target.value }))} placeholder="se-presenter-lecon-1" />
          </div>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12, marginBottom: 12 }}>
          <div>
            <label style={lbl}>LANGUE *</label>
            <select style={inp} value={form.languageId ?? ""} onChange={e => setForm(f => ({ ...f, languageId: e.target.value }))}>
              <option value="">—</option>
              {languages.map(l => <option key={l.id} value={l.id}>{l.code} — {l.name}</option>)}
            </select>
          </div>
          <div>
            <label style={lbl}>MODULE</label>
            <select style={inp} value={form.moduleId ?? ""} onChange={e => setForm(f => ({ ...f, moduleId: e.target.value }))}>
              <option value="">— (sans module)</option>
              {modules.map(m => (
                <option key={m.id} value={m.id}>
                  {m.slug.startsWith("msa-") ? "📖 MSA" : "🇲🇦 Darija"} · Niv.{m.level} · {m.title}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label style={lbl}>SOUS-TITRE</label>
            <input style={inp} value={form.subtitle ?? ""} onChange={e => setForm(f => ({ ...f, subtitle: e.target.value }))} placeholder="شنو سميتك؟" />
          </div>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 2fr", gap: 12, marginBottom: 12 }}>
          <div>
            <label style={lbl}>ORDRE (dans le module)</label>
            <input style={inp} type="number" value={form.order ?? 0} onChange={e => setForm(f => ({ ...f, order: Number(e.target.value) }))} />
          </div>
          <div>
            <label style={lbl}>NIVEAU</label>
            <input style={inp} type="number" value={form.level ?? 1} onChange={e => setForm(f => ({ ...f, level: Number(e.target.value) }))} />
          </div>
          <div>
            <label style={lbl}>URL VIDÉO (optionnel — YouTube/Vimeo/MP4)</label>
            <input style={inp} value={form.videoUrl ?? ""} onChange={e => setForm(f => ({ ...f, videoUrl: e.target.value }))} placeholder="https://youtu.be/..." />
          </div>
        </div>

        <label style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 13, marginBottom: 14 }}>
          <input type="checkbox" checked={form.isPublished ?? true} onChange={e => setForm(f => ({ ...f, isPublished: e.target.checked }))} />
          Publié (visible par les apprenants)
        </label>

        <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
          <button onClick={save} disabled={busy || !form.title || !form.languageId} style={{
            padding: "10px 22px", borderRadius: 10, border: "none",
            background: busy || !form.title || !form.languageId ? "var(--c-card2)" : "#58cc02",
            color: "white", fontWeight: 800, fontSize: 13,
            cursor: busy || !form.title || !form.languageId ? "not-allowed" : "pointer",
          }}>
            {busy ? "⏳" : (editingId ? "💾 Enregistrer" : "➕ Créer")}
          </button>
          {editingId && (
            <button onClick={resetForm} style={{
              padding: "10px 18px", borderRadius: 10, border: "1px solid var(--c-border)",
              background: "var(--c-bg)", color: "var(--c-sub)", fontSize: 13, cursor: "pointer",
            }}>Annuler</button>
          )}
          {msg && <span style={{ fontSize: 13, fontWeight: 600, color: msg.ok ? "#46a302" : "#ff4b4b" }}>{msg.text}</span>}
        </div>
      </div>

      {/* Filtres + recherche */}
      <div style={{ display: "flex", gap: 8, alignItems: "center", marginBottom: 14, flexWrap: "wrap" }}>
        {(["all", "darija", "msa", "deleted"] as const).map(k => (
          <button key={k} onClick={() => setFilter(k)} style={{
            padding: "6px 14px", borderRadius: 8, cursor: "pointer", fontSize: 12, fontWeight: 700,
            border: "1.5px solid", borderColor: filter === k ? "#58cc02" : "var(--c-border)",
            background: filter === k ? "rgba(88,204,2,0.1)" : "var(--c-bg)",
            color: filter === k ? "#46a302" : "var(--c-sub)",
          }}>
            {k === "all" ? "Toutes" : k === "darija" ? "🇲🇦 Darija" : k === "msa" ? "📖 MSA" : "🗑️ Archivées"}
          </button>
        ))}
        <input style={{ ...inp, flex: 1, minWidth: 220, maxWidth: 400 }}
          placeholder="Rechercher par titre ou slug…"
          value={search} onChange={e => setSearch(e.target.value)} />
        <span style={{ fontSize: 12, color: "var(--c-sub)" }}>{visible.length} résultat(s)</span>
      </div>

      {/* Liste */}
      <div style={{ background: "var(--c-card)", border: "1px solid var(--c-border)", borderRadius: 14, overflow: "hidden" }}>
        {visible.length === 0 ? (
          <div style={{ padding: 30, textAlign: "center", color: "var(--c-sub)", fontSize: 13 }}>Aucune leçon</div>
        ) : (
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
            <thead>
              <tr style={{ background: "var(--c-bg)", textAlign: "left" }}>
                <th style={{ padding: "10px 14px", fontSize: 11, fontWeight: 800, letterSpacing: ".05em", textTransform: "uppercase", color: "var(--c-sub)" }}>Piste</th>
                <th style={{ padding: "10px 14px", fontSize: 11, fontWeight: 800, letterSpacing: ".05em", textTransform: "uppercase", color: "var(--c-sub)" }}>Module</th>
                <th style={{ padding: "10px 14px", fontSize: 11, fontWeight: 800, letterSpacing: ".05em", textTransform: "uppercase", color: "var(--c-sub)" }}>Titre</th>
                <th style={{ padding: "10px 14px", fontSize: 11, fontWeight: 800, letterSpacing: ".05em", textTransform: "uppercase", color: "var(--c-sub)" }}>Ordre</th>
                <th style={{ padding: "10px 14px", fontSize: 11, fontWeight: 800, letterSpacing: ".05em", textTransform: "uppercase", color: "var(--c-sub)" }}>Statut</th>
                <th style={{ padding: "10px 14px", fontSize: 11, fontWeight: 800, letterSpacing: ".05em", textTransform: "uppercase", color: "var(--c-sub)", textAlign: "right" }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {visible.map(l => {
                const mod = moduleOf(l.moduleId);
                const isMsa = mod?.slug?.startsWith("msa-");
                return (
                  <tr key={l.id} style={{ borderTop: "1px solid var(--c-border)" }}>
                    <td style={{ padding: "10px 14px" }}>{isMsa ? "📖" : mod ? "🇲🇦" : "—"}</td>
                    <td style={{ padding: "10px 14px", color: "var(--c-sub)" }}>{mod?.title ?? "—"}</td>
                    <td style={{ padding: "10px 14px", fontWeight: 600 }}>
                      {l.title}
                      {l.slug && <div style={{ fontSize: 11, color: "var(--c-sub)", fontFamily: "monospace" }}>{l.slug}</div>}
                    </td>
                    <td style={{ padding: "10px 14px" }}>{l.order}</td>
                    <td style={{ padding: "10px 14px" }}>
                      {l.isDeleted
                        ? <span style={{ color: "#ff4b4b", fontSize: 11, fontWeight: 700 }}>ARCHIVÉE</span>
                        : l.isPublished
                          ? <span style={{ color: "#46a302", fontSize: 11, fontWeight: 700 }}>● PUBLIÉE</span>
                          : <span style={{ color: "var(--c-sub)", fontSize: 11, fontWeight: 700 }}>BROUILLON</span>}
                    </td>
                    <td style={{ padding: "10px 14px", textAlign: "right" }}>
                      {l.isDeleted ? (
                        <>
                          <button onClick={() => restore(l.id)} style={btnLink}>Restaurer</button>
                          <button onClick={() => remove(l.id, true)} style={{ ...btnLink, color: "#ff4b4b" }}>Supprimer def.</button>
                        </>
                      ) : (
                        <>
                          <button onClick={() => startEdit(l)} style={btnLink}>Éditer</button>
                          <button onClick={() => remove(l.id, false)} style={{ ...btnLink, color: "#ff4b4b" }}>Archiver</button>
                        </>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

const btnLink: React.CSSProperties = {
  background: "transparent", border: "none", color: "var(--c-text)",
  fontSize: 12, fontWeight: 600, cursor: "pointer", padding: "4px 8px", marginLeft: 6,
};
