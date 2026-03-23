import React from 'react'
import { View, Animated } from 'react-native'

export default function Mascotte({ size = 120 }: { size?: number }) {
  const anim = React.useRef(new Animated.Value(0)).current
  React.useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(anim, { toValue: -8, duration: 400, useNativeDriver: true }),
        Animated.timing(anim, { toValue: 0, duration: 400, useNativeDriver: true }),
      ])
    ).start()
  }, [anim])

  return (
    <View style={{ width: size, height: size, alignItems: 'center', justifyContent: 'center' }}>
      <Animated.View style={{ transform: [{ translateY: anim }] }}>
        <View style={{ width: size, height: size, borderRadius: size / 2, backgroundColor: '#F59E0B', alignItems: 'center', justifyContent: 'center' }}>
          <View style={{ width: size * 0.5, height: size * 0.3, backgroundColor: '#fff', borderRadius: 6 }} />
        </View>
      </Animated.View>
    </View>
  )
}
