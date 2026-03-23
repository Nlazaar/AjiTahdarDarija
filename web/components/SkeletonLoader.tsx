import React from 'react'

export default function SkeletonLoader({ className = 'h-4 w-full' }: { className?: string }) {
  return <div className={`bg-slate-200 animate-pulse rounded ${className}`} />
}
