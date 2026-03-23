"use client"
import React from "react"

interface ExerciseCardProps {
  children: React.ReactNode
  className?: string
}

export const ExerciseCard: React.FC<ExerciseCardProps> = ({ children, className = "" }) => (
  <div className={`
    bg-white rounded-2xl border border-gray-100
    p-6 shadow-sm w-full
    animate-fadeUp
    ${className}
  `}>
    {children}
  </div>
)
