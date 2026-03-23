"use client"
import React from 'react'

export default function Loader({ size = 24 }: { size?: number }) {
  return (
    <div className="flex items-center justify-center" role="status">
      <svg className="animate-spin" width={size} height={size} viewBox="0 0 24 24">
        <circle cx="12" cy="12" r="10" strokeWidth="4" stroke="#e5e7eb" fill="none" />
        <path d="M22 12a10 10 0 00-10-10" stroke="#06b6d4" strokeWidth="4" strokeLinecap="round" fill="none" />
      </svg>
    </div>
  )
}
