import React from 'react'
import { View, Animated, StyleSheet } from 'react-native'

export default function SkeletonLoader({ width = '100%', height = 16 }: { width?: string | number; height?: number }) {
  const anim = React.useRef(new Animated.Value(0)).current
  React.useEffect(() => {
    Animated.loop(Animated.sequence([Animated.timing(anim, { toValue: 1, duration: 800, useNativeDriver: true }), Animated.timing(anim, { toValue: 0, duration: 800, useNativeDriver: true })])).start()
  }, [anim])

  const translateX = anim.interpolate({ inputRange: [0, 1], outputRange: [-100, 100] })

  return (
    <View style={[styles.wrapper, { width }] as any}>
      <View style={[styles.base, { height }]} />
      <Animated.View style={[styles.shimmer, { transform: [{ translateX }], height }]} />
    </View>
  )
}

const styles = StyleSheet.create({
  wrapper: { overflow: 'hidden', backgroundColor: 'transparent', borderRadius: 4 },
  base: { backgroundColor: '#e5e7eb', width: '100%' },
  shimmer: { position: 'absolute', left: 0, top: 0, width: '40%', backgroundColor: 'rgba(255,255,255,0.6)' },
})
