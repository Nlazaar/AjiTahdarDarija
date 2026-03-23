"use client"
import React from 'react'

type Props = { children: React.ReactNode }

export default function ErrorBoundary({ children }: Props) {
  const [hasError, setHasError] = React.useState(false)

  React.useEffect(() => {
    const handle = (e: any) => {
      console.error('Unhandled error', e)
      setHasError(true)
    }
    window.addEventListener('error', handle)
    window.addEventListener('unhandledrejection', handle)
    return () => {
      window.removeEventListener('error', handle)
      window.removeEventListener('unhandledrejection', handle)
    }
  }, [])

  if (hasError) {
    return (
      <div className="p-6 bg-red-50 rounded">
        <h2 className="text-xl font-bold mb-2">Une erreur est survenue</h2>
        <p className="mb-4">Veuillez recharger la page ou réessayer plus tard.</p>
        <button className="px-4 py-2 bg-slate-800 text-white rounded" onClick={() => location.reload()}>
          Recharger
        </button>
      </div>
    )
  }

  return <>{children}</>
}
