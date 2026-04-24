"use client";

import { useEffect, useState } from "react";

type BeforeInstallPromptEvent = Event & {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
};

const DISMISS_KEY = "darija.pwa.installDismissedAt";
const DISMISS_COOLDOWN_MS = 1000 * 60 * 60 * 24 * 14; // 14 jours

function isStandalone(): boolean {
  if (typeof window === "undefined") return false;
  const mq = window.matchMedia?.("(display-mode: standalone)").matches;
  // iOS exposes navigator.standalone
  const iosStandalone = (window.navigator as unknown as { standalone?: boolean }).standalone === true;
  return !!mq || iosStandalone;
}

function isIOS(): boolean {
  if (typeof navigator === "undefined") return false;
  const ua = navigator.userAgent || "";
  return /iPad|iPhone|iPod/.test(ua) && !(window as unknown as { MSStream?: unknown }).MSStream;
}

function wasRecentlyDismissed(): boolean {
  try {
    const raw = localStorage.getItem(DISMISS_KEY);
    if (!raw) return false;
    const ts = Number(raw);
    if (!Number.isFinite(ts)) return false;
    return Date.now() - ts < DISMISS_COOLDOWN_MS;
  } catch { return false; }
}

export default function InstallPrompt() {
  const [deferred, setDeferred] = useState<BeforeInstallPromptEvent | null>(null);
  const [visible, setVisible] = useState(false);
  const [iosHintOpen, setIosHintOpen] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (isStandalone()) return;
    if (wasRecentlyDismissed()) return;

    const onBefore = (e: Event) => {
      e.preventDefault();
      setDeferred(e as BeforeInstallPromptEvent);
      setVisible(true);
    };
    window.addEventListener("beforeinstallprompt", onBefore);

    const onInstalled = () => {
      setVisible(false);
      setDeferred(null);
    };
    window.addEventListener("appinstalled", onInstalled);

    // iOS : pas de beforeinstallprompt. On affiche après un délai si pas déjà installé.
    if (isIOS()) {
      const t = setTimeout(() => setVisible(true), 3000);
      return () => {
        clearTimeout(t);
        window.removeEventListener("beforeinstallprompt", onBefore);
        window.removeEventListener("appinstalled", onInstalled);
      };
    }

    return () => {
      window.removeEventListener("beforeinstallprompt", onBefore);
      window.removeEventListener("appinstalled", onInstalled);
    };
  }, []);

  const dismiss = () => {
    try { localStorage.setItem(DISMISS_KEY, String(Date.now())); } catch { /* noop */ }
    setVisible(false);
    setIosHintOpen(false);
  };

  const install = async () => {
    if (isIOS()) {
      setIosHintOpen(true);
      return;
    }
    if (!deferred) return;
    try {
      await deferred.prompt();
      const { outcome } = await deferred.userChoice;
      if (outcome === "accepted") {
        setVisible(false);
      } else {
        dismiss();
      }
    } catch { /* noop */ }
    setDeferred(null);
  };

  if (!visible) return null;

  return (
    <div
      role="dialog"
      aria-label="Installer l'application"
      style={{
        position: "fixed",
        left: 12,
        right: 12,
        bottom: "calc(12px + env(safe-area-inset-bottom, 0px))",
        zIndex: 9000,
        display: "flex",
        justifyContent: "center",
        pointerEvents: "none",
      }}
    >
      <div
        style={{
          pointerEvents: "auto",
          maxWidth: 520,
          width: "100%",
          background: "var(--c-card, #1a1d23)",
          border: "1px solid var(--c-border, #2a2f38)",
          borderRadius: 14,
          padding: 14,
          boxShadow: "0 14px 40px rgba(0,0,0,0.45)",
          color: "var(--c-text, #fff)",
        }}
      >
        {!iosHintOpen ? (
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <img src="/pwa/icon-192.png" alt="" width={40} height={40} style={{ borderRadius: 8 }} />
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontWeight: 800, fontSize: 14 }}>Installer Darija Maroc</div>
              <div style={{ fontSize: 12, color: "var(--c-sub, #9aa0aa)", marginTop: 2 }}>
                Ajoute l'app à ton écran d'accueil — plus rapide, plein écran.
              </div>
            </div>
            <button
              type="button"
              onClick={dismiss}
              style={{
                padding: "8px 10px", borderRadius: 8, background: "transparent",
                border: "1px solid var(--c-border, #2a2f38)",
                color: "var(--c-sub, #9aa0aa)", fontWeight: 700, fontSize: 12, cursor: "pointer",
              }}
            >
              Plus tard
            </button>
            <button
              type="button"
              onClick={install}
              style={{
                padding: "8px 12px", borderRadius: 8,
                background: "#d4a84b", color: "#1a1a1a",
                border: "none", fontWeight: 800, fontSize: 13, cursor: "pointer",
              }}
            >
              Installer
            </button>
          </div>
        ) : (
          <div>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 8 }}>
              <div style={{ fontWeight: 800, fontSize: 14 }}>Ajouter à l'écran d'accueil</div>
              <button
                type="button"
                onClick={dismiss}
                aria-label="Fermer"
                style={{ background: "transparent", border: "none", color: "var(--c-sub, #9aa0aa)", fontSize: 18, cursor: "pointer", lineHeight: 1 }}
              >×</button>
            </div>
            <ol style={{ fontSize: 13, lineHeight: 1.5, color: "var(--c-text, #fff)", margin: 0, paddingLeft: 18 }}>
              <li>Touche l'icône <strong>Partager</strong> en bas de Safari (carré avec flèche vers le haut).</li>
              <li>Fais défiler et choisis <strong>« Sur l'écran d'accueil »</strong>.</li>
              <li>Confirme avec <strong>Ajouter</strong>.</li>
            </ol>
          </div>
        )}
      </div>
    </div>
  );
}
