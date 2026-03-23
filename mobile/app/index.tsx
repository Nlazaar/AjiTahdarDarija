import React from 'react'
import { ScrollView, View, Text } from 'react-native'
import { Link } from 'expo-router'
import ModuleCard from '../components/ModuleCard'
import { useAuth } from '../lib/useAuth'

export default function Home() {
  const { loading, userId, ensureAuth } = useAuth()
  React.useEffect(() => {
    ensureAuth()
  }, [ensureAuth])

  return (
    <ScrollView contentContainerStyle={{ padding: 16 }}>
      <Text style={{ fontSize: 28, fontWeight: '700', marginBottom: 8 }}>Bienvenue — Darija Maroc</Text>
      <Text style={{ color: '#6b7280', marginBottom: 16 }}>Apprenez la darija marocaine avec des leçons interactives.</Text>

      <View style={{ gap: 12 }}>
        <ModuleCard title="Module 1 — Débutant" description="Bases et salutations" progress={25} />
        <ModuleCard title="Module 2 — Conversation" description="Dialogues simples" progress={10} />
      </View>

      <View style={{ marginTop: 20 }}>
        {!loading && !userId ? <Link href="/login">Se connecter / S'inscrire</Link> : null}
      </View>
    </ScrollView>
  )
}
