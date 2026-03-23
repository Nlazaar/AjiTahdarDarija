'use client'

import React from 'react'
import Link from 'next/link'
import { ProgressBar } from './ProgressBar'

export function LessonCard({ id, title, excerpt, progress = 0 }: { id?: string; title: string; excerpt?: string; progress?: number }) {
  return (
    <Link href={`/lesson/${id ?? '1'}`} className="block">
      <div className="p-4 ds-card hover:shadow-md transition">
        <h4 className="font-semibold">{title}</h4>
        {excerpt && <p className="text-sm text-slate-500 mt-1">{excerpt}</p>}
        <div className="mt-3">
          <ProgressBar value={progress} />
        </div>
      </div>
    </Link>
  )
}
