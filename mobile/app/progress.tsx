import React from 'react'
import { View, Text, ScrollView, Button } from 'react-native'
import ModuleCard from '../components/ModuleCard'
import { ToastProvider } from '../components/ToastContext'
import Loader from '../components/Loader'
import useApi from '../lib/useApi'
import { useAuth } from '../lib/useAuth'
import { useRouter } from 'expo-router'
import GamificationHeader from '../components/GamificationHeader'

export default function Progress() {
  const { ensureAuth } = useAuth()
  React.useEffect(() => {
    ensureAuth()
  }, [ensureAuth])
  const router = useRouter()
  const { loading, call } = useApi()
  const [modules, setModules] = React.useState<any[]>([])

  React.useEffect(() => {
    let mounted = true
    ;(async () => {
      try {
        const res = await call('/modules')
        if (!mounted) return
        setModules(res || [])
      } catch (e) {}
    })()
    return () => { mounted = false }
  }, [])

  return (
    <ScrollView contentContainerStyle={{ padding: 16 }}>
      <Text style={{ fontSize: 22, fontWeight: '700', marginBottom: 12 }}>Arbre de progression</Text>
      <GamificationHeader />
      <View style={{ gap: 12 }}>
        {loading ? <Loader /> : modules.length ? modules.map((m) => <ModuleCard key={m.id} title={m.title} description={m.description} progress={m.progress} />) : (
          <>
            <ModuleCard title="Module 1" description="Bases" progress={30} />
            <ModuleCard title="Module 2" description="Conversation" progress={12} />
            <ModuleCard title="Module 3" description="Vocabulaire" progress={60} />
          </>
        )}
        <View style={{ marginTop: 12 }}>
          <Button title="Révision" onPress={() => router.push('/review')} />
        </View>
      </View>
    </ScrollView>
  )
}
