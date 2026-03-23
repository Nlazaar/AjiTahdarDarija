import React from 'react'
import { Text } from 'react-native'
import Card from './Card'

export default function LessonCard({ title, excerpt }: { title: string; excerpt?: string }) {
  return (
    <Card style={{ marginBottom: 8 }}>
      <Text style={{ fontWeight: '700' }}>{title}</Text>
      {excerpt && <Text style={{ color: '#6b7280', marginTop: 4 }}>{excerpt}</Text>}
    </Card>
  )
}
