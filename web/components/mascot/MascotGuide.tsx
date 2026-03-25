"use client"
import React from "react"
import Image from "next/image"
import { useMascot, MASCOT_IMAGES } from "@/contexts/MascotContext"

interface MascotGuideProps {
  messageContext: string
  size?:          "sm" | "md" | "lg"
  showBubble?:    boolean
  customMessage?: string
}

const SIZES = {
  sm: { w: 40,  h: 60  },
  md: { w: 56,  h: 84  },
  lg: { w: 80,  h: 120 },
}

export const MascotGuide: React.FC<MascotGuideProps> = ({
  messageContext,
  size = "md",
  showBubble = true,
  customMessage,
}) => {
  const { mascot, getMessage } = useMascot()
  if (!mascot) return null

  const msg      = customMessage ?? getMessage(messageContext)
  const { w, h } = SIZES[size]

  return (
    <div className="flex flex-col items-center gap-1 flex-shrink-0">
      {showBubble && msg && (
        <div
          className="relative bg-[#2a9d8f] text-white text-[9px] font-bold px-2 py-1.5 rounded-lg whitespace-nowrap"
          style={{ animation: 'fadeUp 0.4s ease 0.5s both' }}
        >
          {msg}
          <div
            className="absolute -bottom-1 left-3 border-4 border-transparent"
            style={{ borderTopColor: '#2a9d8f', borderBottom: 'none' }}
          />
        </div>
      )}
      <Image
        src={MASCOT_IMAGES[mascot.id]}
        alt={mascot.name}
        width={w}
        height={h}
        className="object-contain drop-shadow-md"
        style={{ animation: 'float 3s ease-in-out infinite' }}
      />
      <span className="text-[8px] font-bold text-gray-400">{mascot.name}</span>
    </div>
  )
}

export default MascotGuide
