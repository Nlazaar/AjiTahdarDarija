type SoundName = 'correct' | 'incorrect' | 'progress' | 'badge' | 'streak'

export function playSound(name: SoundName) {
  try {
    const url = `/sounds/${name}.mp3`
    const a = new Audio(url)
    a.play().catch(() => {})
  } catch (e) {
    // ignore
  }
}

export default { playSound }
