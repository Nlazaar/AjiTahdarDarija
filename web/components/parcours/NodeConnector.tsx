"use client"
import React from "react"

interface NodeConnectorProps {
  direction: "left-to-right" | "right-to-left" | "center"
}

export const NodeConnector: React.FC<NodeConnectorProps> = ({ direction }) => {
  const path =
    direction === "left-to-right" ? "M 25 2 Q 55 12 85 2" :
    direction === "right-to-left" ? "M 85 2 Q 55 12 25 2" :
    "M 40 2 Q 55 12 70 2"

  return (
    <div style={{ width: '100%', height: 14, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <svg width="120" height="14" viewBox="0 0 120 14">
        <path d={path} stroke="#374151" strokeWidth="2" strokeDasharray="4 3" fill="none"/>
      </svg>
    </div>
  )
}
