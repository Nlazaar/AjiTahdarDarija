"use client";

import React from "react";

export type StarPosition = "top" | "right-top" | "right-bot" | "left-bot" | "left-top";

export const STAR_POSITION_COORDS: Record<StarPosition, { x: number; y: number }> = {
  top:         { x: 50, y: 12 },
  "right-top": { x: 88, y: 38 },
  "right-bot": { x: 74, y: 86 },
  "left-bot":  { x: 26, y: 86 },
  "left-top":  { x: 12, y: 38 },
};

function starPath(cx: number, cy: number, R: number, r: number): string {
  const pts: Array<[number, number]> = [];
  for (let i = 0; i < 10; i++) {
    const angle = (Math.PI / 5) * i - Math.PI / 2;
    const radius = i % 2 === 0 ? R : r;
    pts.push([cx + radius * Math.cos(angle), cy + radius * Math.sin(angle)]);
  }
  return "M" + pts.map(([x, y]) => `${x.toFixed(2)},${y.toFixed(2)}`).join(" L ") + " Z";
}

interface Props {
  fillFrom?: string;
  fillTo?: string;
  stroke?: string;
  fillOpacity?: number;
  gradientId?: string;
}

export default function StarShape({
  fillFrom = "#7c3aed",
  fillTo = "#059669",
  stroke = "#7c3aed",
  fillOpacity = 0.35,
  gradientId = "starGrad",
}: Props) {
  return (
    <svg viewBox="0 0 100 100" style={{ width: "100%", height: "100%" }}>
      <defs>
        <linearGradient id={gradientId} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor={fillFrom} stopOpacity={fillOpacity} />
          <stop offset="100%" stopColor={fillTo} stopOpacity={fillOpacity} />
        </linearGradient>
      </defs>
      <path
        d={starPath(50, 52, 46, 18)}
        fill={`url(#${gradientId})`}
        stroke={stroke}
        strokeWidth="0.6"
        strokeLinejoin="round"
      />
    </svg>
  );
}
