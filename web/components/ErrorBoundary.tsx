"use client"
import React from 'react'
import { usePathname } from 'next/navigation'

type Props = { children: React.ReactNode }

export default function ErrorBoundary({ children }: Props) {
  const [errorMsg, setErrorMsg] = React.useState<string | null>(null)
  const pathname = usePathname()

  // Reset error when navigating to a new page
  React.useEffect(() => {
    setErrorMsg(null)
  }, [pathname])

  React.useEffect(() => {
    const handle = (e: any) => {
      const msg = e?.message ?? e?.reason?.message ?? String(e?.reason ?? '')
      // Ignore benign browser/Next.js internal errors
      if (!msg || msg.includes('ResizeObserver') || msg.includes('Script error') || msg.includes('NEXT_REDIRECT') || msg.includes('NEXT_NOT_FOUND')) return
      console.error('Unhandled error', e)
      setErrorMsg(msg)
    }
    window.addEventListener('error', handle)
    window.addEventListener('unhandledrejection', handle)
    return () => {
      window.removeEventListener('error', handle)
      window.removeEventListener('unhandledrejection', handle)
    }
  }, [])

  if (errorMsg) {
    return (
      <div className="p-6 bg-red-50 rounded">
        <h2 className="text-xl font-bold mb-2">Une erreur est survenue</h2>
        <p className="mb-4 font-mono text-sm text-red-700 bg-red-100 p-2 rounded">{errorMsg}</p>
        <button className="px-4 py-2 bg-slate-800 text-white rounded" onClick={() => location.reload()}>
          Recharger
        </button>
      </div>
    )
  }

  return <>{children}</>
}
