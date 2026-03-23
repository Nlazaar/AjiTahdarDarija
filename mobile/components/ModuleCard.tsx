import React from 'react'
import { View, Text, StyleSheet } from 'react-native'
import Card from './Card'

export default function ModuleCard({ title, description, progress = 0 }: { title: string; description?: string; progress?: number }) {
  return (
    <Card style={{ marginBottom: 8 }}>
      <Text style={{ fontWeight: '700' }}>{title}</Text>
      {description && <Text style={{ color: '#6b7280', marginTop: 4 }}>{description}</Text>}
      <View style={styles.progressBarBackground}>
        <View style={[styles.progressBarFill, { width: `${Math.max(0, Math.min(100, progress))}%` }]} />
      </View>
    </Card>
  )
}

const styles = StyleSheet.create({
  progressBarBackground: { height: 8, backgroundColor: '#e5e7eb', borderRadius: 999, marginTop: 10, overflow: 'hidden' },
  progressBarFill: { height: 8, backgroundColor: '#10b981' }
})
