"use client";

import React, { useEffect, useState } from "react";
import { getToken } from "@/lib/auth";

const APP_ID = process.env.NEXT_PUBLIC_ONESIGNAL_APP_ID ?? "";
const SDK_URL = "https://cdn.onesignal.com/sdks/web/v16/OneSignalSDK.page.js";
const STORAGE_KEY = "darija_push_optin";   // 'granted' | 'dismissed' | timestamp
const DISMISS_COOLDOWN_DAYS = 7;

declare global {
  interface Window {
    OneSignal?: any;
    OneSignalDeferred?: any[];
  }
}

type Status = "loading" | "hidden" | "prompt" | "asking" | "subscribed" | "denied";

export default function PushOptInBanner() {
  const [status, setStatus] = useState<Status>("loading");

  useEffect(() => {
    if (!APP_ID) { setStatus("hidden"); return; }
    if (typeof window === "undefined") return;
    if (!("Notification" in window)) { setStatus("hidden"); return; }

    // Cooldown : si l'utilisateur a déjà refusé récemment, on ne réaffiche pas
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored === "granted") { setStatus("hidden"); return; }
    if (stored && stored.startsWith("dismissed:")) {
      const ts = parseInt(stored.split(":")[1] ?? "0", 10);
      const ageDays = (Date.now() - ts) / (1000 * 60 * 60 * 24);
      if (ageDays < DISMISS_COOLDOWN_DAYS) { setStatus("hidden"); return; }
    }

    // Si l'utilisateur a déjà refusé au niveau navigateur, ne pas insister
    if (Notification.permission === "denied") {
      setStatus("hidden");
      return;
    }

    // Charge le SDK OneSignal une seule fois
    window.OneSignalDeferred = window.OneSignalDeferred || [];
    if (!document.querySelector(`script[src="${SDK_URL}"]`)) {
      const s = document.createElement("script");
      s.src = SDK_URL;
      s.defer = true;
      document.head.appendChild(s);
    }

    window.OneSignalDeferred.push(async (OneSignal: any) => {
      try {
        await OneSignal.init({
          appId: APP_ID,
          allowLocalhostAsSecureOrigin: true,
          serviceWorkerPath: "/OneSignalSDKWorker.js",
        });
        const permission = OneSignal.Notifications?.permission;
        if (permission === true) {
          setStatus("subscribed");
          await pushSubIdToBackend(OneSignal);
        } else {
          setStatus("prompt");
        }
      } catch (err) {
        console.warn("[OneSignal] init failed", err);
        setStatus("hidden");
      }
    });
  }, []);

  const handleEnable = async () => {
    setStatus("asking");
    try {
      const OneSignal = window.OneSignal;
      if (!OneSignal) { setStatus("hidden"); return; }
      await OneSignal.Notifications.requestPermission();
      const granted = OneSignal.Notifications?.permission === true;
      if (granted) {
        localStorage.setItem(STORAGE_KEY, "granted");
        setStatus("subscribed");
        await pushSubIdToBackend(OneSignal);
      } else {
        setStatus("denied");
        localStorage.setItem(STORAGE_KEY, `dismissed:${Date.now()}`);
        setTimeout(() => setStatus("hidden"), 1800);
      }
    } catch (err) {
      console.warn("[OneSignal] permission request failed", err);
      setStatus("hidden");
    }
  };

  const handleDismiss = () => {
    localStorage.setItem(STORAGE_KEY, `dismissed:${Date.now()}`);
    setStatus("hidden");
  };

  if (status === "loading" || status === "hidden" || status === "subscribed") return null;

  return (
    <div
      style={{
        position: "fixed",
        bottom: 16,
        left: "50%",
        transform: "translateX(-50%)",
        zIndex: 100,
        background: "#1e2d35",
        border: "1px solid #2a3d47",
        borderRadius: 14,
        padding: "12px 16px",
        boxShadow: "0 8px 24px rgba(0,0,0,0.4)",
        display: "flex",
        alignItems: "center",
        gap: 12,
        maxWidth: 460,
        width: "calc(100% - 24px)",
      }}
    >
      <div style={{ fontSize: 28 }}>🔔</div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: 13, fontWeight: 800, color: "white", lineHeight: 1.2 }}>
          {status === "denied"
            ? "Notifications refusées"
            : "Préserve ta série de jours !"}
        </div>
        <div style={{ fontSize: 11, color: "#8a9baa", marginTop: 2, lineHeight: 1.3 }}>
          {status === "denied"
            ? "Tu peux les réactiver dans les paramètres du navigateur."
            : "Active les rappels — on te préviendra avant que ton streak expire."}
        </div>
      </div>
      {status !== "denied" && (
        <>
          <button
            onClick={handleEnable}
            disabled={status === "asking"}
            style={{
              padding: "8px 14px",
              borderRadius: 10,
              border: "none",
              background: "#58cc02",
              color: "white",
              fontWeight: 900,
              fontSize: 12,
              letterSpacing: "0.04em",
              textTransform: "uppercase",
              cursor: status === "asking" ? "default" : "pointer",
              opacity: status === "asking" ? 0.6 : 1,
              flexShrink: 0,
            }}
          >
            {status === "asking" ? "..." : "Activer"}
          </button>
          <button
            onClick={handleDismiss}
            title="Plus tard"
            style={{
              background: "transparent",
              border: "none",
              color: "#6b7f8a",
              fontSize: 16,
              cursor: "pointer",
              padding: "4px 6px",
              flexShrink: 0,
            }}
          >✕</button>
        </>
      )}
    </div>
  );
}

async function pushSubIdToBackend(OneSignal: any) {
  try {
    const subId = OneSignal?.User?.PushSubscription?.id;
    if (!subId) return;
    const token = getToken();
    if (!token) return;
    const base = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3001";
    await fetch(`${base}/push/subscription`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`,
      },
      body: JSON.stringify({ subscriptionId: subId }),
    });
  } catch (err) {
    console.warn("[OneSignal] push subId failed", err);
  }
}
