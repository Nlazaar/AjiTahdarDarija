import React from 'react'
import { View, Text, TextInput, Button, Alert } from 'react-native'
import { login as apiLogin } from '../lib/auth'
import { saveToken } from '../lib/auth'
import { useRouter } from 'expo-router'

export default function Login() {
  const [email, setEmail] = React.useState('')
  const [password, setPassword] = React.useState('')
  const router = useRouter()

  const onSubmit = async () => {
    try {
      const res = await apiLogin(email, password)
      if (res?.token) {
        await saveToken(res.token)
        router.replace('/')
      } else {
        Alert.alert('Erreur', 'Réponse invalide du serveur')
      }
    } catch (err: any) {
      Alert.alert('Erreur', err.message ?? 'Échec de la connexion')
    }
  }

  return (
    <View style={{ padding: 16 }}>
      <Text style={{ fontSize: 20, fontWeight: '600', marginBottom: 12 }}>Connexion</Text>
      <TextInput value={email} onChangeText={setEmail} placeholder="Email" style={{ borderWidth: 1, borderColor: '#e5e7eb', padding: 10, borderRadius: 8, marginBottom: 8 }} />
      <TextInput value={password} onChangeText={setPassword} placeholder="Mot de passe" secureTextEntry style={{ borderWidth: 1, borderColor: '#e5e7eb', padding: 10, borderRadius: 8, marginBottom: 12 }} />
      <Button title="Se connecter" onPress={onSubmit} />
    </View>
  )
}
