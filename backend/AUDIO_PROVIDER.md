Audio TTS / ASR provider setup

This document explains how to enable the backend `AudioModule` endpoints in `src/audio`.

Overview
 - `GET /audio/tts?text=...` — currently a placeholder. Implement a provider (Google/Azure/Coqui) to return binary audio.
 - `POST /audio/asr` — accepts multipart `file` or JSON `{ base64 }`. Currently a placeholder; integrate Whisper/Vosk/Azure to return transcription.
 - `POST /audio/pronunciation-score` — implemented locally: accepts `{ expectedText, transcription }` or audio file; if audio is provided and no ASR provider is configured the result will be partial. The endpoint uses a simple Levenshtein-based scorer.

Enabling providers (recommended options)

1) OpenAI Whisper (HTTP API)
 - Set `OPENAI_API_KEY` in your environment.
 - Implement `transcribeBuffer()` in `src/audio/audio.service.ts` to POST the audio file to OpenAI's transcription endpoint and return the `text` field.

2) Google Cloud Text-to-Speech
 - Install `@google-cloud/text-to-speech` and configure `GOOGLE_APPLICATION_CREDENTIALS`.
 - Implement `synthesize()` in `AudioService` to call GCP TTS and return `{ buffer, contentType }`.

3) Azure Cognitive Services
 - Configure `AZURE_TTS_KEY` and `AZURE_TTS_REGION` and call Azure endpoints from `synthesize()` / `transcribeBuffer()`.

Notes and best practices
 - Cache generated TTS audio (Redis or disk) keyed by `text+voice+lang` to avoid repeated billing and latency.
 - Enforce maximum recording size on the client (recommend 10s–30s) and on the server reject >5MB uploads.
 - Clean temporary files after processing.
 - For production, sign and verify webhook and API keys; avoid returning raw error stacks.

Run / Development
 - To try the basic hooks and components locally you must run backend, web and (optionally) mobile dev servers:

```bash
# Backend
cd backend
npm install
npm run start:dev

# Web
cd ../web
npm install
npm run dev

# Mobile (expo)
cd ../mobile
npm install
expo start
```

Client dependencies (if missing)
 - Web: none for basic hooks (uses browser Web Speech API and MediaRecorder). Ensure HTTPS or secure context for microphone access.
 - Mobile: install `expo-speech`, `expo-av`, and `expo-file-system`.

Example mobile installs:
```bash
cd mobile
expo install expo-speech expo-av expo-file-system
```

Next steps (recommended)
 - Implement provider integrations in `AudioService` for the selected TTS/ASR services.
 - Add server-side size limits and validation for uploads.
 - Add instrumentation (metrics) to track average transcription time and errors.
