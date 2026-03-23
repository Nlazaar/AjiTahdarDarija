export default function useTTS() {
  const synth = typeof window !== 'undefined' ? window.speechSynthesis : null
  let current: SpeechSynthesisUtterance | null = null

  function play(text: string, lang?: string) {
    if (!synth) return
    stop()
    current = new SpeechSynthesisUtterance(text)
    if (lang) current.lang = lang
    synth.speak(current)
  }

  function stop() {
    if (!synth) return
    synth.cancel()
    current = null
  }

  return { play, stop }
}
