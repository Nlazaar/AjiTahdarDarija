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
const levenshtein_1 = require("./utils/levenshtein");
let AudioService = AudioService_1 = class AudioService {
    constructor() {
        this.logger = new common_1.Logger(AudioService_1.name);
        this.hfKey = process.env.HUGGINGFACE_API_KEY || '';
        this.model = process.env.HUGGINGFACE_TTS_MODEL || 'google/flan-t5-small';
    }
    // Ensure a cached MP3 exists for the given letter key; generate via HF if missing
    async ensureAudio(letterKey, text) {
        const outDir = path.join(process.cwd(), 'public', 'audio', 'alphabet');
        if (!fs.existsSync(outDir))
            fs.mkdirSync(outDir, { recursive: true });
        const outPath = path.join(outDir, `${letterKey}.mp3`);
        if (fs.existsSync(outPath))
            return outPath;
        if (!this.hfKey) {
            this.logger.warn('HUGGINGFACE_API_KEY not set, skipping generation');
            throw new Error('No Hugging Face API key');
        }
        const payload = await this.synthesize(text);
        if (!payload || !payload.buffer)
            throw new Error('TTS generation failed');
        fs.writeFileSync(outPath, payload.buffer);
        this.logger.log(`Saved TTS to ${outPath}`);
        return outPath;
    }
    // Synthesize text to audio via Hugging Face (if configured)
    async synthesize(text) {
        if (!this.hfKey) {
            this.logger.warn('synthesize() called but HUGGINGFACE_API_KEY not set');
            return null;
        }
        const url = `https://api-inference.huggingface.co/models/${this.model}`;
        this.logger.log(`Requesting TTS from ${this.model}`);
        const res = await (0, node_fetch_1.default)(url, {
            method: 'POST',
            headers: {
                Authorization: `Bearer ${this.hfKey}`,
                Accept: 'audio/mpeg',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ inputs: text }),
        });
        if (!res.ok) {
            const txt = await res.text().catch(() => '');
            this.logger.error(`HuggingFace TTS failed: ${res.status} ${txt}`);
            return null;
        }
        const arrayBuffer = await res.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);
        return { buffer, contentType: 'audio/mpeg' };
    }
    // Transcribe audio buffer using configured ASR provider. Return transcription string or null.
    async transcribeBuffer(buffer, mimetype = 'audio/wav') {
        this.logger.warn('ASR requested but no provider implemented. Configure an ASR provider to enable transcribeBuffer().');
        return null;
    }
    // Score pronunciation by comparing expected vs actual transcription.
    scorePronunciation(expectedText, transcription) {
        const a = (expectedText || '').trim().toLowerCase();
        const b = (transcription || '').trim().toLowerCase();
        const distance = (0, levenshtein_1.levenshtein)(a, b);
        const maxLen = Math.max(a.length, b.length, 1);
        let score = Math.round(Math.max(0, 100 - (distance / maxLen) * 100));
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
            suggestions.push('Écoutez l’audio lentement et répétez phrase par phrase.');
        if (score < 70)
            suggestions.push('Concentrez-vous sur les sons manquants ou les liaisons.');
        return { score, distance, wordErrors, suggestions };
    }
};
exports.AudioService = AudioService;
exports.AudioService = AudioService = AudioService_1 = __decorate([
    (0, common_1.Injectable)()
], AudioService);
