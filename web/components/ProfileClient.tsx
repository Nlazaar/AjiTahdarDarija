"use client"
import React from 'react'
import useApi from '@/lib/useApi'
import Loader from './Loader'
import BadgeCard from '@/components/ui/BadgeCard'

export default function ProfileClient() {
  const { loading, error, call } = useApi()
  const [data, setData] = React.useState<any | null>(null)

  React.useEffect(() => {
    let mounted = true
    ;(async () => {
      try {
        // TODO: replace userId with real auth
        const res = await call('/gamification/badges?userId=user-1')
        if (!mounted) return
        setData(res)
      } catch (e) {}
    })()
    return () => {
      mounted = false
    }
  }, [])

  if (loading) return <Loader />
  if (error) return <div className="p-4 bg-red-50 text-red-700 rounded">Erreur: {String(error.message ?? '')}</div>
  if (!data) return <div>Aucune donnée</div>

  return (
    <div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="p-4 bg-white rounded shadow">
          <h3 className="font-semibold">Expérience (XP)</h3>
          <div className="mt-2">XP: {data.xp}</div>
        </div>
        <div className="p-4 bg-white rounded shadow">
          <h3 className="font-semibold">Streak et Coeurs</h3>
          <div className="mt-2">Streak: {data.streak} jours</div>
          <div>Coeurs: {data.hearts}</div>
        </div>
      </div>

      <section className="mt-4">
        <h3 className="font-semibold mb-2">Badges</h3>
        <div className="flex flex-wrap gap-2">
          {data.badges.map((b: any) => (
            <BadgeCard key={b.id} badge={b} />
          ))}
        </div>
      </section>
    </div>
  )
}
