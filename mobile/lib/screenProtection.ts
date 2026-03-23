import * as ScreenCapture from 'expo-screen-capture'
import { AppState } from 'react-native'
import React from 'react'

export function useScreenProtection() {
  React.useEffect(() => {
    // disable screenshots
    ScreenCapture.preventScreenCaptureAsync()
    const sub = AppState.addEventListener('change', (state) => {
      if (state === 'background') {
        // allow blur or other behavior -- here we just disable capture (placeholder)
        ScreenCapture.allowScreenCaptureAsync()
      } else {
        ScreenCapture.preventScreenCaptureAsync()
      }
    })
    return () => {
      try { sub.remove() } catch {}
      ScreenCapture.allowScreenCaptureAsync()
    }
  }, [])
}
