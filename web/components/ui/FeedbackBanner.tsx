"use client"
import React, { useEffect, useState } from "react"

interface FeedbackBannerProps {
  type: "correct" | "incorrect"
  message: string
  duration?: number  // ms avant disparition, défaut 1600
}

export const FeedbackBanner: React.FC<FeedbackBannerProps> = ({
  type, message, duration = 1600
}) => {
  const [visible, setVisible] = useState(true)

  useEffect(() => {
    const t = setTimeout(() => setVisible(false), duration)
    return () => clearTimeout(t)
  }, [duration])

  if (!visible) return null

  return (
    <div className={`
      flex items-center gap-2 w-full px-4 py-3 rounded-xl
      text-sm font-semibold animate-fadeUp
      ${type === "correct"
        ? "bg-green-50 border border-green-300 text-green-700"
        : "bg-red-50 border border-red-300 text-red-700"
      }
    `}>
      <span className="text-base">{type === "correct" ? "✓" : "✗"}</span>
      <span>{message}</span>
    </div>
  )
}
