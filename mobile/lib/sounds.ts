import { Audio } from 'expo-av'

type SoundName = 'correct' | 'incorrect' | 'progress' | 'badge' | 'streak'

export async function playSound(name: SoundName) {
  try {
    const { sound } = await Audio.Sound.createAsync((require as any)(`../assets/sounds/${name}.mp3`))
    await sound.playAsync()
    // unload after play
    setTimeout(() => { sound.unloadAsync().catch(() => {}) }, 3000)
  } catch (e) {
    // ignore missing assets
  }
}

export default { playSound }
