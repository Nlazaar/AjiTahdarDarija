import * as React from 'react'
import { Audio } from 'expo-av'
import * as FileSystem from 'expo-file-system'

const API = process.env.EXPO_PUBLIC_API_URL ?? ''

export default function useASR() {
  const [recording, setRecording] = React.useState<Audio.Recording | null>(null)
  const [isRecording, setIsRecording] = React.useState(false)
  const [transcription, setTranscription] = React.useState<string | null>(null)

  async function startRecording() {
    try {
      await Audio.requestPermissionsAsync()
      await Audio.setAudioModeAsync({ allowsRecordingIOS: true, playsInSilentModeIOS: true })
      const rec = new Audio.Recording()
      await rec.prepareToRecordAsync(Audio.RECORDING_OPTIONS_PRESET_HIGH_QUALITY)
      await rec.startAsync()
      setRecording(rec)
      setIsRecording(true)
    } catch (e) {
      throw e
    }
  }

  async function stopRecording() {
    if (!recording) return null
    await recording.stopAndUnloadAsync()
    setIsRecording(false)
    const uri = recording.getURI()
    setRecording(null)
    return uri
  }

  async function sendToBackend(uri?: string) {
    const targetUri = uri ?? ''
    if (!targetUri) return null
    const base64 = await FileSystem.readAsStringAsync(targetUri, { encoding: FileSystem.EncodingType.Base64 })
    const res = await fetch(`${API}/audio/asr`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ base64 }) })
    if (!res.ok) throw new Error('ASR failed')
    const data = await res.json()
    setTranscription(data.transcription)
    return data
  }

  return { isRecording, startRecording, stopRecording, sendToBackend, transcription }
}
