'use client'

import React from 'react'
import { ProgressBar } from './ProgressBar'

export function ModuleCard({ title, description, progress = 0 }: { title: string; description?: string; progress?: number }) {
  return (
    <div className="p-4 ds-card">
      <h3 className="font-semibold">{title}</h3>
      {description && <p className="text-sm text-slate-500 mt-1">{description}</p>}
      <div className="mt-3">
        <ProgressBar value={progress} />
      </div>
    </div>
  )
}
