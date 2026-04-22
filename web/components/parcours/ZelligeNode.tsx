"use client"
import React from "react"
import { useRouter } from "next/navigation"

export type NodeStatus = "done" | "active" | "locked"
export type NodeShape  = "star" | "circle" | "arch" | "hex" | "medallion"

export const NODE_SHAPES: Array<{
  key: NodeShape
  label: string
  description: string
  icon: string
}> = [
  { key: 'star',      label: 'Zellige épuré',     description: "Étoile à 8 pointes marocaine, simplifiée.",         icon: '✦' },
  { key: 'circle',    label: 'Pastille ronde',    description: "Cercle Duolingo avec anneau et relief.",            icon: '◯' },
  { key: 'arch',      label: 'Arc marocain',      description: "Porte de médina / mihrab, arc brisé.",              icon: '⌒' },
  { key: 'hex',       label: 'Hexagone tapis',    description: "Hexagone avec motif radial discret, esprit tissé.", icon: '⬡' },
  { key: 'medallion', label: 'Médaillon cranté',  description: "Disque avec couronne crantée, hybride élégant.",    icon: '❋' },
]

interface ZelligeNodeProps {
  status:  NodeStatus
  icon:    string
  label:   string
  route?:  string
  size?:   "sm" | "md" | "lg"
  shape?:  NodeShape
  interactive?: boolean
  /** Si true, affiche `icon` tel quel au lieu des ✓ / 🔒 automatiques */
  forceIcon?: boolean
}

const SIZES = { sm: 56, md: 66, lg: 78 }

export const ZelligeNode: React.FC<ZelligeNodeProps> = ({
  status, icon, label, route, size = "md", shape = "star", interactive = true, forceIcon = false,
}) => {
  const router = useRouter()
  const base = SIZES[size]
  const isActive = status === "active"
  const w = isActive ? base + 8 : base
  const h = w
  const viewBox = shape === "arch" ? "0 0 100 100" : "0 0 110 110"

  const handleClick = () => {
    if (!interactive) return
    if (status === "done")   return
    if (status === "locked") { showToast(); return }
    if (status === "active" && route) router.push(route)
  }

  return (
    <div
      style={{
        display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6,
        cursor: interactive ? 'pointer' : 'inherit', userSelect: 'none',
      }}
      onClick={handleClick}
    >
      <svg
        width={w}
        height={h}
        viewBox={viewBox}
        shapeRendering="geometricPrecision"
        style={getSVGStyle(status)}
      >
        {renderShape(shape, status, icon, forceIcon)}
      </svg>
      {label ? <span style={getLabelStyle(status)}>{label}</span> : null}
    </div>
  )
}

/* ─── SVG star rendering (épuré) ──────────────────────────── */
// Étoile à 8 pointes, lignes épurées, un seul polygone par statut.
// Grille 110×110, centre en (55, 52).
const STAR_8 =
  "55,4 64,28 87,19 78,42 101,52 78,62 87,85 64,76 55,100 46,76 23,85 32,62 9,52 32,42 23,19 46,28"

// Petite étoile intérieure pour enrichir légèrement sans charger
const STAR_8_INNER =
  "55,32 60,44 70,40 66,50 76,52 66,54 70,64 60,60 55,72 50,60 40,64 44,54 34,52 44,50 40,40 50,44"

const PALETTES: Record<NodeStatus, { fillId: string; from: string; to: string; ring: string; inner: string; icon: string; iconColor: string; shadow: string }> = {
  done: {
    fillId: "zelGrad-done",
    from:   "#7ed321",
    to:     "#3fa102",
    ring:   "#2d6e02",
    inner:  "rgba(255,255,255,0.16)",
    icon:   "#ffffff",
    iconColor: "#ffffff",
    shadow: "drop-shadow(0 4px 0 #2d6e02)",
  },
  active: {
    fillId: "zelGrad-active",
    from:   "#fbbf24",
    to:     "#e76f51",
    ring:   "#b84420",
    inner:  "rgba(255,255,255,0.22)",
    icon:   "",
    iconColor: "#ffffff",
    shadow: "drop-shadow(0 5px 0 #b84420)",
  },
  locked: {
    fillId: "zelGrad-locked",
    from:   "#475569",
    to:     "#1f2937",
    ring:   "#0f172a",
    inner:  "rgba(255,255,255,0.05)",
    icon:   "🔒",
    iconColor: "#94a3b8",
    shadow: "drop-shadow(0 4px 0 #0f172a)",
  },
}

/* ─── Dispatcher ──────────────────────────────────────────── */
function renderShape(shape: NodeShape, status: NodeStatus, icon: string, forceIcon: boolean) {
  switch (shape) {
    case 'arch':      return renderArch(status, icon, forceIcon)
    case 'circle':    return renderCircle(status, icon, forceIcon)
    case 'hex':       return renderHex(status, icon, forceIcon)
    case 'medallion': return renderMedallion(status, icon, forceIcon)
    default:          return renderStar(status, icon, forceIcon)
  }
}

function iconFor(status: NodeStatus, icon: string, forceIcon: boolean): string {
  if (forceIcon) return icon
  if (status === 'done') return '✓'
  if (status === 'locked') return '🔒'
  return icon
}

/* ─── Arch (mihrab) — viewBox 100×100 ─────────────────────── */
const ARCH_OUTER = "M 18 94 L 18 42 C 18 22, 32 10, 50 6 C 68 10, 82 22, 82 42 L 82 94 Z"
const ARCH_INNER = "M 30 90 L 30 47 C 30 30, 40 20, 50 17 C 60 20, 70 30, 70 47 L 70 90 Z"

function renderArch(status: NodeStatus, icon: string, forceIcon: boolean) {
  const p = PALETTES[status]
  const label = iconFor(status, icon, forceIcon)
  return (
    <>
      <defs>
        <linearGradient id={`${p.fillId}-arch`} x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%"  stopColor={p.from}/>
          <stop offset="100%" stopColor={p.to}/>
        </linearGradient>
      </defs>
      <path
        d={ARCH_OUTER}
        fill={`url(#${p.fillId}-arch)`}
        stroke={p.ring}
        strokeWidth={2.5}
        strokeLinejoin="round"
      />
      <path d={ARCH_INNER} fill={p.inner} />
      <text
        x="50" y="55"
        textAnchor="middle" dominantBaseline="central"
        fontSize={status === "done" ? 22 : 18}
        fill={p.iconColor}
        fontWeight="900"
        fontFamily="sans-serif"
        style={{ filter: status === "locked" ? "none" : "drop-shadow(0 1px 1px rgba(0,0,0,0.25))" }}
      >
        {label}
      </text>
    </>
  )
}

/* ─── Circle (pastille Duolingo) ──────────────────────────── */
function renderCircle(status: NodeStatus, icon: string, forceIcon: boolean) {
  const p = PALETTES[status]
  const label = iconFor(status, icon, forceIcon)
  return (
    <>
      <defs>
        <radialGradient id={`${p.fillId}-circ`} cx="50%" cy="38%" r="65%">
          <stop offset="0%"  stopColor={p.from}/>
          <stop offset="100%" stopColor={p.to}/>
        </radialGradient>
      </defs>
      <circle cx="55" cy="55" r="46" fill={p.ring} />
      <circle cx="55" cy="55" r="42" fill={`url(#${p.fillId}-circ)`} stroke={p.ring} strokeWidth={2.2} />
      <ellipse cx="55" cy="40" rx="26" ry="12" fill={p.inner} />
      <text
        x="55" y="58"
        textAnchor="middle" dominantBaseline="central"
        fontSize={status === "done" ? 26 : 24}
        fill={p.iconColor}
        fontWeight="900"
        fontFamily="sans-serif"
        style={{ filter: status === "locked" ? "none" : "drop-shadow(0 1px 1px rgba(0,0,0,0.25))" }}
      >
        {label}
      </text>
    </>
  )
}

/* ─── Hexagone (tapis, pointy-top) ────────────────────────── */
const HEX_POINTS = "55,6 96,30 96,80 55,104 14,80 14,30"

function renderHex(status: NodeStatus, icon: string, forceIcon: boolean) {
  const p = PALETTES[status]
  const label = iconFor(status, icon, forceIcon)
  return (
    <>
      <defs>
        <radialGradient id={`${p.fillId}-hex`} cx="50%" cy="40%" r="65%">
          <stop offset="0%"  stopColor={p.from}/>
          <stop offset="100%" stopColor={p.to}/>
        </radialGradient>
      </defs>
      <polygon
        points={HEX_POINTS}
        fill={`url(#${p.fillId}-hex)`}
        stroke={p.ring}
        strokeWidth={2.5}
        strokeLinejoin="round"
      />
      {/* Motif radial discret : 6 lignes du centre vers chaque sommet */}
      <g stroke={p.inner} strokeWidth={1} opacity={0.55}>
        <line x1="55" y1="55" x2="55" y2="6"  />
        <line x1="55" y1="55" x2="96" y2="30" />
        <line x1="55" y1="55" x2="96" y2="80" />
        <line x1="55" y1="55" x2="55" y2="104"/>
        <line x1="55" y1="55" x2="14" y2="80" />
        <line x1="55" y1="55" x2="14" y2="30" />
      </g>
      <circle cx="55" cy="55" r="18" fill={p.inner} />
      <text
        x="55" y="57"
        textAnchor="middle" dominantBaseline="central"
        fontSize={status === "done" ? 22 : 20}
        fill={p.iconColor}
        fontWeight="900"
        fontFamily="sans-serif"
        style={{ filter: status === "locked" ? "none" : "drop-shadow(0 1px 1px rgba(0,0,0,0.25))" }}
      >
        {label}
      </text>
    </>
  )
}

/* ─── Médaillon cranté ────────────────────────────────────── */
const MEDALLION_POINTS = (() => {
  const n = 32, cx = 55, cy = 55, rOut = 50, rIn = 44
  const pts: string[] = []
  for (let i = 0; i < n; i++) {
    const a = (i * Math.PI * 2) / n - Math.PI / 2
    const r = i % 2 === 0 ? rOut : rIn
    pts.push(`${(cx + r * Math.cos(a)).toFixed(1)},${(cy + r * Math.sin(a)).toFixed(1)}`)
  }
  return pts.join(' ')
})()

function renderMedallion(status: NodeStatus, icon: string, forceIcon: boolean) {
  const p = PALETTES[status]
  const label = iconFor(status, icon, forceIcon)
  return (
    <>
      <defs>
        <radialGradient id={`${p.fillId}-med`} cx="50%" cy="38%" r="65%">
          <stop offset="0%"  stopColor={p.from}/>
          <stop offset="100%" stopColor={p.to}/>
        </radialGradient>
      </defs>
      <polygon
        points={MEDALLION_POINTS}
        fill={p.ring}
        stroke={p.ring}
        strokeWidth={1}
        strokeLinejoin="round"
      />
      <circle cx="55" cy="55" r="36" fill={`url(#${p.fillId}-med)`} stroke={p.ring} strokeWidth={1} />
      <circle cx="55" cy="40" r="12" fill={p.inner} opacity={0.6} />
      <text
        x="55" y="58"
        textAnchor="middle" dominantBaseline="central"
        fontSize={status === "done" ? 22 : 20}
        fill={p.iconColor}
        fontWeight="900"
        fontFamily="sans-serif"
        style={{ filter: status === "locked" ? "none" : "drop-shadow(0 1px 1px rgba(0,0,0,0.25))" }}
      >
        {label}
      </text>
    </>
  )
}

function renderStar(status: NodeStatus, icon: string, forceIcon: boolean) {
  const p = PALETTES[status]
  const label = iconFor(status, icon, forceIcon)
  return (
    <>
      <defs>
        <radialGradient id={p.fillId} cx="50%" cy="38%" r="65%">
          <stop offset="0%"  stopColor={p.from}/>
          <stop offset="100%" stopColor={p.to}/>
        </radialGradient>
      </defs>
      <polygon
        points={STAR_8}
        fill={`url(#${p.fillId})`}
        stroke={p.ring}
        strokeWidth={2.2}
        strokeLinejoin="round"
      />
      <polygon points={STAR_8_INNER} fill={p.inner} />
      <text
        x="55" y="54"
        textAnchor="middle" dominantBaseline="central"
        fontSize={status === "done" ? 22 : 20}
        fill={p.iconColor}
        fontWeight="900"
        fontFamily="sans-serif"
        style={{ filter: status === "locked" ? "none" : "drop-shadow(0 1px 1px rgba(0,0,0,0.25))" }}
      >
        {label}
      </text>
    </>
  )
}

/* ─── Styles ──────────────────────────────────────────────── */
function getSVGStyle(status: NodeStatus): React.CSSProperties {
  const base: React.CSSProperties = {
    transition: 'transform 0.2s',
    filter: PALETTES[status].shadow,
    display: 'block',
    transformOrigin: '50% 50%',
  }
  if (status === "active") return { ...base, animation: 'zelligePulse 2s ease-in-out infinite' }
  if (status === "locked") return { ...base, opacity: 0.6 }
  return base
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
