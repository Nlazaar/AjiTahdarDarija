import React from 'react'
import { SafeAreaView, Text } from 'react-native'

// Note: `SplashScreen` and `Stack` were previously imported from 'expo-router'
// but unused; removed to satisfy ESLint `no-unused-vars` warnings.
export default function App() {
  return (
    <SafeAreaView style={{flex:1,alignItems:'center',justifyContent:'center'}}>
      <Text>Darija Mobile — bienvenue</Text>
    </SafeAreaView>
  )
}
