"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var AudioService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.AudioService = void 0;
const common_1 = require("@nestjs/common");
const node_fetch_1 = require("node-fetch");
const fs = require("fs");
const path = require("path");
const crypto = require("crypto");
const levenshtein_1 = require("./utils/levenshtein");
/**
 * Habibi-TTS — F5-TTS fine-tuné sur 12 dialectes arabes dont MAR (Marocain)
 * Repo HuggingFace : https://huggingface.co/ffatherdan/Habibi-TTS
 *
 * Modes de fonctionnement (par ordre de priorité) :
 *   1. Self-hosted  → HABIBI_TTS_URL = http://votre-serveur:7860
 *   2. HF Space     → HABIBI_TTS_URL = https://ffatherdan-habibi-tts.hf.space
 *   3. HF Inference → HUGGINGFACE_API_KEY défini (modèle fallback)
 */
const HABIBI_DIALECT = 'MAR'; // Moroccan Arabic
const CACHE_DIR_BASE = path.join(process.cwd(), 'public', 'audio');
let AudioService = AudioService_1 = class AudioService {
    constructor() {
        this.logger = new common_1.Logger(AudioService_1.name);
        this.habibUrl = process.env.HABIBI_TTS_URL?.replace(/\/$/, '') ?? '';
        this.hfKey = process.env.HUGGINGFACE_API_KEY ?? '';
        this.hfModel = process.env.HUGGINGFACE_TTS_MODEL ?? 'espnet/kan-bayashi_ljspeech_vits';
    }
    // ──────────────────────────────────────────────
    //  PUBLIC API
    // ──────────────────────────────────────────────
    /**
     * Retourne le chemin absolu du fichier MP3 pour `text`.
     * Génère et met en cache si inexistant.
     */
    async ensureAudio(slug, text, subDir = 'vocab') {
        const dir = path.join(CACHE_DIR_BASE, subDir);
        const outPath = path.join(dir, `${slug}.mp3`);
        if (!fs.existsSync(dir))
            fs.mkdirSync(dir, { recursive: true });
        if (fs.existsSync(outPath))
            return outPath;
        const result = await this.synthesize(text);
        if (!result?.buffer)
            throw new Error(`TTS generation failed for "${text}"`);
        fs.writeFileSync(outPath, result.buffer);
        this.logger.log(`[TTS] Cached: ${outPath}`);
        return outPath;
    }
    /**
     * Génère l'audio pour `text` — essaie Habibi-TTS en priorité,
     * puis HuggingFace Inference API en fallback.
     */
    async synthesize(text) {
        if (this.habibUrl) {
            const result = await this.callHabibi(text);
            if (result)
                return result;
        }
        if (this.hfKey) {
            const result = await this.callHuggingFace(text);
            if (result)
                return result;
        }
        this.logger.warn('[TTS] No provider configured — set HABIBI_TTS_URL or HUGGINGFACE_API_KEY');
        return null;
    }
    // ──────────────────────────────────────────────
    //  HABIBI-TTS (Gradio API)
    // ──────────────────────────────────────────────
    async callHabibi(text) {
        try {
            /**
             * Habibi-TTS expose une API Gradio standard.
             * Endpoint : POST /run/predict
             * Payload  : { "data": [text, dialect_code] }
             *            dialect_code ∈ ["MAR","EGY","KSA","UAE","LEB","IRQ","TUN","LIB","YEM","SYR","KUW","BAH"]
             *
             * Réponse  : { "data": [{ "name": "...", "url": "..." }] }
             * L'audio est ensuite récupéré via GET /file=...
             */
            const predictRes = await node_fetch_1.default(`${this.habibUrl}/run/predict`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ data: [text, HABIBI_DIALECT] }),
                timeout: 30000,
            });
            if (!predictRes.ok) {
                this.logger.warn(`[Habibi-TTS] predict failed: ${predictRes.status}`);
                return null;
            }
            const json = await predictRes.json();
            const audioData = json?.data?.[0];
            if (!audioData)
                return null;
            // Cas 1 : data-URL base64 directement dans la réponse
            if (typeof audioData === 'string' && audioData.startsWith('data:audio')) {
                const base64 = audioData.split(',')[1];
                return { buffer: Buffer.from(base64, 'base64'), contentType: 'audio/wav' };
            }
            // Cas 2 : objet { name, path, url } — récupérer le fichier audio
            const filePath = audioData?.url ?? audioData?.path ?? audioData?.name ?? '';
            if (!filePath)
                return null;
            const fileUrl = filePath.startsWith('http')
                ? filePath
                : `${this.habibUrl}/file=${filePath}`;
            const fileRes = await node_fetch_1.default(fileUrl, { timeout: 20000 });
            if (!fileRes.ok)
                return null;
            const arrayBuffer = await fileRes.arrayBuffer();
            return { buffer: Buffer.from(arrayBuffer), contentType: 'audio/wav' };
        }
        catch (err) {
            this.logger.error('[Habibi-TTS] Error', err?.message);
            return null;
        }
    }
    // ──────────────────────────────────────────────
    //  HUGGINGFACE INFERENCE API (fallback)
    // ──────────────────────────────────────────────
    async callHuggingFace(text) {
        try {
            const url = `https://api-inference.huggingface.co/models/${this.hfModel}`;
            const res = await node_fetch_1.default(url, {
                method: 'POST',
                headers: {
                    Authorization: `Bearer ${this.hfKey}`,
                    'Content-Type': 'application/json',
                    Accept: 'audio/mpeg',
                },
                body: JSON.stringify({ inputs: text }),
                timeout: 30000,
            });
            if (!res.ok) {
                const txt = await res.text().catch(() => '');
                this.logger.warn(`[HuggingFace TTS] ${res.status}: ${txt}`);
                return null;
            }
            const buffer = Buffer.from(await res.arrayBuffer());
            return { buffer, contentType: 'audio/mpeg' };
        }
        catch (err) {
            this.logger.error('[HuggingFace TTS] Error', err?.message);
            return null;
        }
    }
    // ──────────────────────────────────────────────
    //  ASR + PRONUNCIATION SCORE
    // ──────────────────────────────────────────────
    async transcribeBuffer(_buffer, _mimetype = 'audio/wav') {
        this.logger.warn('[ASR] No provider configured');
        return null;
    }
    scorePronunciation(expectedText, transcription) {
        const a = (expectedText || '').trim().toLowerCase();
        const b = (transcription || '').trim().toLowerCase();
        const distance = (0, levenshtein_1.levenshtein)(a, b);
        const maxLen = Math.max(a.length, b.length, 1);
        const score = Math.round(Math.max(0, 100 - (distance / maxLen) * 100));
        const expectedWords = a.split(/\s+/).filter(Boolean);
        const actualWords = b.split(/\s+/).filter(Boolean);
        const wordErrors = [];
        const maxWords = Math.max(expectedWords.length, actualWords.length);
        for (let i = 0; i < maxWords; i++) {
            if (expectedWords[i] !== actualWords[i]) {
                wordErrors.push({ expected: expectedWords[i], actual: actualWords[i] });
            }
        }
        const suggestions = [];
        if (score < 90)
            suggestions.push('Écoutez l\'audio lentement et répétez phrase par phrase.');
        if (score < 70)
            suggestions.push('Concentrez-vous sur les sons manquants ou les liaisons.');
        return { score, distance, wordErrors, suggestions };
    }
    // ──────────────────────────────────────────────
    //  UTILITAIRES STATIQUES
    // ──────────────────────────────────────────────
    /** Génère un slug de fichier stable (SHA-256 du texte, 16 premiers chars) */
    static slug(text) {
        return crypto.createHash('sha256').update(text.trim().toLowerCase()).digest('hex').slice(0, 16);
    }
    /** URL publique relative du fichier audio mis en cache */
    static publicUrl(slug, subDir = 'vocab') {
        return `/audio/${subDir}/${slug}.mp3`;
    }
};
exports.AudioService = AudioService;
exports.AudioService = AudioService = AudioService_1 = __decorate([
    (0, common_1.Injectable)()
], AudioService);
