"use client";

import React, { createContext, useCallback, useContext, useMemo, useRef, useState } from "react";

type Tone = "default" | "danger";

interface ConfirmOptions {
  title: string;
  message?: string;
  confirmLabel?: string;
  cancelLabel?: string;
  tone?: Tone;
}

type ConfirmFn = (opts: ConfirmOptions) => Promise<boolean>;

const ConfirmContext = createContext<ConfirmFn | null>(null);

export function ConfirmProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<ConfirmOptions | null>(null);
  const resolverRef = useRef<((v: boolean) => void) | null>(null);

  const confirm = useCallback<ConfirmFn>((opts) => {
    return new Promise<boolean>((resolve) => {
      resolverRef.current = resolve;
      setState(opts);
    });
  }, []);

  const handleClose = (ok: boolean) => {
    resolverRef.current?.(ok);
    resolverRef.current = null;
    setState(null);
  };

  const value = useMemo(() => confirm, [confirm]);

  return (
    <ConfirmContext.Provider value={value}>
      {children}
      {state && (
        <ConfirmModal
          opts={state}
          onConfirm={() => handleClose(true)}
          onCancel={() => handleClose(false)}
        />
      )}
    </ConfirmContext.Provider>
  );
}

export function useConfirm(): ConfirmFn {
  const ctx = useContext(ConfirmContext);
  if (!ctx) {
    // Fallback navigateur si l'app oublie le provider
    return async (opts) => window.confirm(`${opts.title}${opts.message ? "\n\n" + opts.message : ""}`);
  }
  return ctx;
}

function ConfirmModal({
  opts, onConfirm, onCancel,
}: { opts: ConfirmOptions; onConfirm: () => void; onCancel: () => void }) {
  const isDanger = opts.tone === "danger";
  return (
    <div
      role="dialog"
      aria-modal="true"
      onClick={onCancel}
      style={{
        position: "fixed", inset: 0, zIndex: 2000,
        background: "rgba(0,0,0,0.55)",
        display: "flex", alignItems: "center", justifyContent: "center",
        padding: 20,
      }}
    >
      <div
        onClick={e => e.stopPropagation()}
        style={{
          width: "100%", maxWidth: 440,
          background: "var(--c-card)",
          border: "1.5px solid var(--c-border)",
          borderRadius: 16,
          boxShadow: "0 20px 60px rgba(0,0,0,0.35)",
          padding: 22,
        }}
      >
        <div style={{
          display: "flex", alignItems: "center", gap: 12, marginBottom: 10,
        }}>
          <div style={{
            width: 36, height: 36, borderRadius: 10,
            background: isDanger ? "rgba(220,38,38,0.12)" : "rgba(59,130,246,0.12)",
            color: isDanger ? "#dc2626" : "#3b82f6",
            fontSize: 20, fontWeight: 900,
            display: "flex", alignItems: "center", justifyContent: "center",
          }}>
            {isDanger ? "⚠" : "?"}
          </div>
          <div style={{ fontSize: 15, fontWeight: 900, color: "var(--c-text)" }}>
            {opts.title}
          </div>
        </div>
        {opts.message && (
          <div style={{
            fontSize: 13, color: "var(--c-sub)", lineHeight: 1.45,
            marginBottom: 18, whiteSpace: "pre-line",
          }}>
            {opts.message}
          </div>
        )}
        <div style={{ display: "flex", justifyContent: "flex-end", gap: 8 }}>
          <button
            onClick={onCancel}
            style={{
              padding: "9px 16px", borderRadius: 10,
              border: "1.5px solid var(--c-border)",
              background: "var(--c-bg)",
              color: "var(--c-text)",
              fontSize: 12, fontWeight: 800, cursor: "pointer",
              letterSpacing: "0.04em", textTransform: "uppercase",
            }}
          >
            {opts.cancelLabel ?? "Annuler"}
          </button>
          <button
            onClick={onConfirm}
            autoFocus
            style={{
              padding: "9px 16px", borderRadius: 10,
              border: "none",
              background: isDanger ? "#dc2626" : "#58cc02",
              color: "white",
              fontSize: 12, fontWeight: 900, cursor: "pointer",
              letterSpacing: "0.04em", textTransform: "uppercase",
            }}
          >
            {opts.confirmLabel ?? "Confirmer"}
          </button>
        </div>
      </div>
    </div>
  );
}
