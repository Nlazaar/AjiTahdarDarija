import React from 'react'
import { View, Text, ScrollView, Button, Alert, FlatList } from 'react-native'
import { useAuth } from '../lib/useAuth'
import { logout as authLogout } from '../lib/auth'
import useGamification from '../hooks/useGamification'
import BadgeCard from '../components/BadgeCard'

export default function Profile() {
  const { ensureAuth } = useAuth()
  React.useEffect(() => {
    ensureAuth()
  }, [ensureAuth])

  const { xp, level, streak, hearts, badges, refreshGamification } = useGamification()

  const onLogout = async () => {
    try {
      await authLogout()
    } catch (e: any) {
      Alert.alert('Erreur', e.message ?? 'Impossible de se déconnecter')
    }
  }

  return (
    <ScrollView contentContainerStyle={{ padding: 16 }}>
      <Text style={{ fontSize: 22, fontWeight: '700', marginBottom: 8 }}>Profil</Text>

      <View style={{ backgroundColor: '#fff', padding: 12, borderRadius: 8, marginBottom: 12 }}>
        <Text style={{ fontSize: 16, fontWeight: '700' }}>Stats</Text>
        <Text>{`XP: ${xp}`}</Text>
        <Text>{`Niveau: ${level}`}</Text>
        <Text>{`Streak: ${streak}`}</Text>
        <Text>{`Cœurs: ${hearts}`}</Text>
        <View style={{ marginTop: 8 }}>
          <Button title="Rafraîchir" onPress={() => refreshGamification()} />
        </View>
      </View>

      <Text style={{ fontSize: 18, fontWeight: '700', marginBottom: 8 }}>Badges</Text>
      <FlatList data={badges} keyExtractor={(b: any) => b.id} horizontal={false} numColumns={3} renderItem={({ item }) => <BadgeCard badge={item} />} />

      <View style={{ marginTop: 12 }}>
        <Button title="Se déconnecter" onPress={onLogout} />
      </View>
    </ScrollView>
  )
}
