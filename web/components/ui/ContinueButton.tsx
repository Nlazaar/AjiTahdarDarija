"use client"
import React from "react"

interface ContinueButtonProps {
  onClick: () => void
  label?: string
}

export const ContinueButton: React.FC<ContinueButtonProps> = ({
  onClick,
  label = "Continuer →"
}) => (
  <button
    onClick={onClick}
    className="
      w-full py-4 bg-green-500 hover:bg-green-600 active:scale-95
      text-white font-bold text-base rounded-2xl
      transition-all duration-150 animate-fadeUp
      shadow-[0_4px_0_#16a34a] hover:shadow-[0_2px_0_#16a34a]
    "
  >
    {label}
  </button>
)
