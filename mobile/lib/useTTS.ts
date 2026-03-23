import * as Speech from 'expo-speech'

export default function useTTS() {
  function play(text: string, options?: { language?: string }) {
    Speech.speak(text, { language: options?.language })
  }

  function stop() {
    Speech.stop()
  }

  return { play, stop }
}
