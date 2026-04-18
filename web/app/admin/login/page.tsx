"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";

export default function AdminLoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });
      if (!res.ok) {
        const d = await res.json();
        setError(d.error ?? "Identifiants incorrects");
        return;
      }
      router.push("/admin");
    } catch {
      setError("Erreur réseau");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{
      minHeight: "100vh", display: "flex",
      alignItems: "center", justifyContent: "center",
      background: "var(--c-bg)",
    }}>
      <div style={{
        width: "100%", maxWidth: 360,
        background: "var(--c-card)",
        border: "1px solid var(--c-border)",
        borderRadius: 20, padding: "36px 32px",
        boxShadow: "0 4px 24px rgba(0,0,0,0.12)",
      }}>
        <div style={{ textAlign: "center", marginBottom: 28 }}>
          <div style={{ fontSize: 40, marginBottom: 8 }}>🛠️</div>
          <h1 style={{ fontSize: 20, fontWeight: 900, color: "var(--c-text)", margin: 0 }}>
            Administration
          </h1>
          <p style={{ fontSize: 13, color: "var(--c-sub)", marginTop: 4 }}>
            AjiTahdar Darija
          </p>
        </div>

        <form onSubmit={handleLogin} style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          <div>
            <label style={{ fontSize: 12, fontWeight: 700, color: "var(--c-sub)", display: "block", marginBottom: 6 }}>
              UTILISATEUR
            </label>
            <input
              type="text"
              value={username}
              onChange={e => setUsername(e.target.value)}
              placeholder="admin"
              autoFocus
              required
              style={{
                width: "100%", padding: "10px 14px",
                borderRadius: 10, border: "1.5px solid var(--c-border)",
                background: "var(--c-bg)", color: "var(--c-text)",
                fontSize: 14, outline: "none", boxSizing: "border-box",
              }}
              onFocus={e => (e.target.style.borderColor = "#58cc02")}
              onBlur={e => (e.target.style.borderColor = "var(--c-border)")}
            />
          </div>

          <div>
            <label style={{ fontSize: 12, fontWeight: 700, color: "var(--c-sub)", display: "block", marginBottom: 6 }}>
              MOT DE PASSE
            </label>
            <input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="••••••••"
              required
              style={{
                width: "100%", padding: "10px 14px",
                borderRadius: 10, border: "1.5px solid var(--c-border)",
                background: "var(--c-bg)", color: "var(--c-text)",
                fontSize: 14, outline: "none", boxSizing: "border-box",
              }}
              onFocus={e => (e.target.style.borderColor = "#58cc02")}
              onBlur={e => (e.target.style.borderColor = "var(--c-border)")}
            />
          </div>

          {error && (
            <div style={{
              padding: "8px 12px", borderRadius: 8,
              background: "rgba(255,75,75,0.1)",
              border: "1px solid rgba(255,75,75,0.3)",
              color: "#ff4b4b", fontSize: 13,
            }}>
              ⚠️ {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            style={{
              padding: "12px", borderRadius: 12, border: "none",
              background: loading ? "var(--c-card2)" : "#58cc02",
              color: loading ? "var(--c-sub)" : "white",
              fontWeight: 800, fontSize: 15, cursor: loading ? "wait" : "pointer",
              marginTop: 4, transition: "background 0.15s",
            }}
          >
            {loading ? "⏳ Connexion..." : "Se connecter"}
          </button>
        </form>
      </div>
    </div>
  );
}
