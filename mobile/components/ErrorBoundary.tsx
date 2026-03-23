import React from 'react'
import { View, Text, Button, StyleSheet } from 'react-native'

type Props = { children: React.ReactNode }

export default function ErrorBoundary({ children }: Props) {
  const [hasError, setHasError] = React.useState(false)

  React.useEffect(() => {
    const onError = () => setHasError(true)
    const onRejection = () => setHasError(true)
    // Note: React Native global handlers could be set here if needed
    return () => {
      // no-op cleanup
    }
  }, [])

  if (hasError) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Une erreur est survenue</Text>
        <Text style={styles.message}>Veuillez réessayer ou redémarrer l'application.</Text>
        <Button title="Recharger" onPress={() => {
          // simple reload by remounting the app — in Expo, reload via DevSettings if available
          try { (global as any).location?.reload?.() } catch (e) { }
        }} />
      </View>
    )
  }

  return <>{children}</>
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 16 },
  title: { fontSize: 18, fontWeight: '700', marginBottom: 8 },
  message: { color: '#6b7280', marginBottom: 12, textAlign: 'center' },
})
