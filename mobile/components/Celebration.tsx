import React from 'react'
import { View, Text, Animated } from 'react-native'

export default function Celebration() {
  const scale = React.useRef(new Animated.Value(0.5)).current
  React.useEffect(() => {
    Animated.spring(scale, { toValue: 1, useNativeDriver: true }).start()
  }, [scale])

  return (
    <View style={{ alignItems: 'center', padding: 12 }}>
      <Animated.Text style={{ fontSize: 36, transform: [{ scale }] }}>🎉</Animated.Text>
    </View>
  )
}
