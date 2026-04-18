#!/usr/bin/env node
/**
 * Génère via Habibi-TTS les audios manquants pour les exercices importés
 * depuis arabic-quran-academy (Exercise.data.source === 'arabic-academy').
 *
 * Parcourt Exercise.data.content, extrait chaque champ `audioText`, et
 * génère backend/public/audio/vocab/{sha256-16}.mp3 s'il n'existe pas.
 *
 * Usage :
 *   node scripts/generateAcademyAudios.js
 *   node scripts/generateAcademyAudios.js --dry-run
 *   node scripts/generateAcademyAudios.js --force       (regenerate all)
 *   node scripts/generateAcademyAudios.js --dialect=MSA (default: MSA)
 *
 * Après run, relance l'import pour rafraîchir audioAvailability :
 *   npx ts-node scripts/importArabicAcademy.ts
 */

require('dotenv').config()
const { PrismaClient } = require('@prisma/client')
const fetch = require('node-fetch')
const fs = require('fs')
const path = require('path')
const crypto = require('crypto')

const HABIBI_URL = process.env.HABIBI_TTS_URL?.replace(/\/$/, '')
const OUT_DIR = path.join(__dirname, '..', 'public', 'audio', 'vocab')
const CONCURRENCY = 3
const DELAY_MS = 500

const DRY_RUN = process.argv.includes('--dry-run')
const FORCE = process.argv.includes('--force')
const dialectArg = process.argv.find(a => a.startsWith('--dialect='))
const DIALECT = dialectArg ? dialectArg.split('=')[1] : 'MSA'

function slug(text) {
  return crypto.createHash('sha256').update(text.trim().toLowerCase()).digest('hex').slice(0, 16)
}

function collectAudioTexts(content, acc = new Set()) {
  if (!content || typeof content !== 'object') return acc
  if (Array.isArray(content)) {
    content.forEach(item => collectAudioTexts(item, acc))
    return acc
  }
  for (const [k, v] of Object.entries(content)) {
    if (k === 'audioText' && typeof v === 'string' && v.trim()) acc.add(v.trim())
    else if (typeof v === 'object') collectAudioTexts(v, acc)
  }
  return acc
}

async function callHabibi(text, dialect) {
  const res = await fetch(`${HABIBI_URL}/run/predict`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ data: [text, dialect] }),
    timeout: 30000,
  })
  if (!res.ok) throw new Error(`Habibi predict: ${res.status}`)
  const json = await res.json()
  const audioData = json?.data?.[0]
  if (!audioData) throw new Error('No audio in response')

  if (typeof audioData === 'string' && audioData.startsWith('data:audio')) {
    return Buffer.from(audioData.split(',')[1], 'base64')
  }
  const fileUrl = audioData?.url ?? audioData?.path ?? audioData?.name ?? ''
  if (!fileUrl) throw new Error('No file URL in response')
  const fullUrl = fileUrl.startsWith('http') ? fileUrl : `${HABIBI_URL}/file=${fileUrl}`
  const fileRes = await fetch(fullUrl, { timeout: 20000 })
  if (!fileRes.ok) throw new Error(`File fetch: ${fileRes.status}`)
  return Buffer.from(await fileRes.arrayBuffer())
}

async function main() {
  if (!HABIBI_URL) {
    console.error('\n❌ HABIBI_TTS_URL non configurée. Exemple : HABIBI_TTS_URL=http://localhost:7860\n')
    process.exit(1)
  }

  console.log(`\n🎙  Academy audios — Habibi-TTS`)
  console.log(`   Provider : ${HABIBI_URL}`)
  console.log(`   Dialect  : ${DIALECT}`)
  console.log(`   Output   : ${OUT_DIR}`)
  console.log(`   Mode     : ${DRY_RUN ? 'DRY RUN' : FORCE ? 'FORCE' : 'INCREMENTAL'}\n`)

  if (!fs.existsSync(OUT_DIR)) fs.mkdirSync(OUT_DIR, { recursive: true })

  const prisma = new PrismaClient()
  let exercises
  try {
    exercises = await prisma.exercise.findMany({
      where: { data: { path: ['source'], equals: 'arabic-academy' } },
      select: { id: true, data: true },
    })
  } finally {
    await prisma.$disconnect()
  }

  console.log(`   ${exercises.length} exercices academy trouvés`)

  const allTexts = new Set()
  for (const ex of exercises) {
    const content = ex.data?.content
    collectAudioTexts(content, allTexts)
  }
  const textsArray = Array.from(allTexts)
  console.log(`   ${textsArray.length} textes audio uniques\n`)

  const toGenerate = FORCE
    ? textsArray
    : textsArray.filter(t => !fs.existsSync(path.join(OUT_DIR, `${slug(t)}.mp3`)))

  console.log(`   À générer : ${toGenerate.length}\n`)

  if (toGenerate.length === 0) {
    console.log('   ✅ Rien à faire.')
    return
  }

  if (DRY_RUN) {
    toGenerate.slice(0, 20).forEach(t => console.log(`   🔍 "${t}" → ${slug(t)}.mp3`))
    if (toGenerate.length > 20) console.log(`   … +${toGenerate.length - 20} autres`)
    return
  }

  let generated = 0, failed = 0
  const total = toGenerate.length

  for (let i = 0; i < toGenerate.length; i += CONCURRENCY) {
    const batch = toGenerate.slice(i, i + CONCURRENCY)
    await Promise.all(batch.map(async text => {
      const outPath = path.join(OUT_DIR, `${slug(text)}.mp3`)
      try {
        const buf = await callHabibi(text, DIALECT)
        fs.writeFileSync(outPath, buf)
        generated++
        process.stdout.write(`  ✅ [${generated + failed}/${total}] "${text}" → ${slug(text)}.mp3\n`)
      } catch (err) {
        failed++
        process.stdout.write(`  ❌ [${generated + failed}/${total}] FAILED "${text}": ${err.message}\n`)
      }
    }))
    if (i + CONCURRENCY < toGenerate.length) {
      await new Promise(r => setTimeout(r, DELAY_MS))
    }
  }

  console.log(`\n${'─'.repeat(50)}`)
  console.log(`  Total    : ${total}`)
  console.log(`  Generated: ${generated}`)
  console.log(`  Failed   : ${failed}`)
  if (failed > 0) console.log(`\n  ⚠️  Relance pour réessayer les échecs.`)
  console.log(`\n  → Pense à relancer : npx ts-node scripts/importArabicAcademy.ts`)
  console.log(`${'─'.repeat(50)}\n`)
}

main().catch(err => {
  console.error('Fatal:', err.message)
  process.exit(1)
})
