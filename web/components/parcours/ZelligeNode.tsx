"use client"
import React from "react"
import { useRouter } from "next/navigation"

export type NodeStatus = "done" | "active" | "locked"

interface ZelligeNodeProps {
  status:  NodeStatus
  icon:    string
  label:   string
  route?:  string
  size?:   "sm" | "md" | "lg"
}

const SIZES = { sm: 56, md: 66, lg: 78 }

export const ZelligeNode: React.FC<ZelligeNodeProps> = ({
  status, icon, label, route, size = "md"
}) => {
  const router = useRouter()
  const px = status === "active" ? SIZES[size] + 8 : SIZES[size]

  const handleClick = () => {
    if (status === "done")   return
    if (status === "locked") { showToast(); return }
    if (status === "active" && route) router.push(route)
  }

  return (
    <div
      style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6, cursor: 'pointer', userSelect: 'none' }}
      onClick={handleClick}
    >
      <svg width={px} height={px} viewBox="0 0 110 110" style={getSVGStyle(status)}>
        {renderStar(status, icon)}
      </svg>
      <span style={getLabelStyle(status)}>{label}</span>
    </div>
  )
}

/* ─── SVG star rendering ──────────────────────────────────── */
const OUTER = "55,1 68,22 93,14 87,40 112,51 87,62 93,88 68,80 55,101 42,80 17,88 23,62 -2,51 23,40 17,14 42,22"
const MID2  = "55,18 65,33 83,28 78,44 93,52 78,60 83,74 65,69 55,84 45,69 27,74 32,60 17,52 32,44 27,28 45,33"
const MID1  = "55,6 67,25 90,18 84,42 107,52 84,62 90,86 67,79 55,98 43,79 20,86 26,62 3,52 26,42 20,18 43,25"
const INNER = "55,29 63,40 75,36 71,48 82,52 71,56 75,68 63,64 55,75 47,64 35,68 39,56 28,52 39,48 35,36 47,40"
const OUTER_TRIM = OUTER.replace("55,1","55,4").replace("55,101","55,96").replace("-2,51","3,50").replace("112,51","107,50")

function renderStar(status: NodeStatus, icon: string) {
  if (status === "done") return (
    <>
      <polygon points={OUTER_TRIM} fill="#58cc02"/>
      <polygon points={MID2}  fill="#46a302"/>
      <circle cx="55" cy="51" r="14" fill="#3a8a02"/>
      <text x="55" y="51" textAnchor="middle" dominantBaseline="central"
        fontSize="17" fill="#ffffff" fontWeight="900" fontFamily="sans-serif">✓</text>
    </>
  )

  if (status === "active") return (
    <>
      <polygon points={OUTER} fill="#ffffff"/>
      <polygon points={MID1}  fill="#1b3a6b"/>
      <polygon points={MID2}  fill="#e76f51"/>
      <polygon points={INNER} fill="#2a9d8f"/>
      <circle cx="55" cy="52" r="13" fill="#c9941a"/>
      <text x="55" y="52" textAnchor="middle" dominantBaseline="central"
        fontSize="14" fontFamily="sans-serif">{icon}</text>
    </>
  )

  // locked
  return (
    <>
      <polygon points={OUTER_TRIM} fill="#374151"/>
      <polygon points={MID2}  fill="#4b5563"/>
      <circle cx="55" cy="51" r="14" fill="#1f2937"/>
      <text x="55" y="51" textAnchor="middle" dominantBaseline="central"
        fontSize="15" fontFamily="sans-serif">🔒</text>
    </>
  )
}

/* ─── Styles ──────────────────────────────────────────────── */
function getSVGStyle(status: NodeStatus): React.CSSProperties {
  const base: React.CSSProperties = { transition: 'transform 0.2s' }
  if (status === "done")   return { ...base, filter: 'drop-shadow(0 5px 0 #2d6e02)' }
  if (status === "active") return { ...base, animation: 'zelligePulse 2s ease-in-out infinite' }
  return { ...base, filter: 'drop-shadow(0 5px 0 #111827)', opacity: 0.55 }
}

function getLabelStyle(status: NodeStatus): React.CSSProperties {
  const base: React.CSSProperties = {
    fontSize: 8, fontWeight: 800, textTransform: 'uppercase',
    letterSpacing: '0.07em', textAlign: 'center',
    maxWidth: 72, lineHeight: 1.3, fontFamily: 'sans-serif',
  }
  if (status === "done")   return { ...base, color: '#58cc02' }
  if (status === "active") return { ...base, color: '#e76f51', fontSize: 9 }
  return { ...base, color: '#4b5563' }
}

/* ─── Toast ───────────────────────────────────────────────── */
let toastTimer: ReturnType<typeof setTimeout>

function showToast() {
  let toast = document.getElementById('zellige-toast')
  if (!toast) {
    toast = document.createElement('div')
    toast.id = 'zellige-toast'
    toast.style.cssText = `
      position:fixed;bottom:80px;left:50%;transform:translateX(-50%);
      background:#1f2937;border:1.5px solid #374151;color:#fff;
      font-size:11px;font-weight:700;padding:8px 14px;border-radius:10px;
      white-space:nowrap;z-index:999;opacity:0;transition:opacity 0.2s;
      pointer-events:none;
    `
    toast.textContent = "🔒 Termine d'abord la leçon précédente !"
    document.body.appendChild(toast)
  }
  toast.style.opacity = '1'
  clearTimeout(toastTimer)
  toastTimer = setTimeout(() => { if (toast) toast.style.opacity = '0' }, 1600)
}
