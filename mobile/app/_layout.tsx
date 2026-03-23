import { Stack } from 'expo-router'
import React from 'react'
import { SafeAreaView, StyleSheet } from 'react-native'
import GamificationHeader from '../components/GamificationHeader'
import { ToastProvider } from '../components/ToastContext'
import ErrorBoundary from '../components/ErrorBoundary'

export default function RootLayout() {
  return (
    <SafeAreaView style={styles.container}>
      <ToastProvider>
        <ErrorBoundary>
          <Stack
            screenOptions={{
              headerShown: true,
              headerRight: () => <GamificationHeader compact />,
            }}
          />
        </ErrorBoundary>
      </ToastProvider>
      {/* optionally place a persistent header here */}
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1 }
})
