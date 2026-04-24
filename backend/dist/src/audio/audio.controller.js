"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var AudioController_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.AudioController = void 0;
const common_1 = require("@nestjs/common");
const platform_express_1 = require("@nestjs/platform-express");
const path = require("path");
const fs = require("fs");
const audio_service_1 = require("./audio.service");
const pronunciation_score_dto_1 = require("./dto/pronunciation-score.dto");
const PUBLIC_AUDIO = path.join(process.cwd(), 'public', 'audio');
let AudioController = AudioController_1 = class AudioController {
    constructor(audioService) {
        this.audioService = audioService;
        this.logger = new common_1.Logger(AudioController_1.name);
    }
    /**
     * GET /audio/tts?text=مرحبا
     * Retourne un MP3 :
     *   1. Depuis le cache disque si déjà généré
     *   2. Génère via Habibi-TTS et met en cache
     *   3. 501 si aucun provider configuré
     *
     * Cache-Control: 7 jours — le slug est déterministe (MD5 du texte)
     */
    async tts(text, res) {
        if (!text)
            throw new common_1.HttpException('text is required', common_1.HttpStatus.BAD_REQUEST);
        const slug = audio_service_1.AudioService.slug(text);
        const subDir = 'tts';
        const dir = path.join(PUBLIC_AUDIO, subDir);
        const mp3Path = path.join(dir, `${slug}.mp3`);
        // Servir depuis le cache disque si disponible
        if (fs.existsSync(mp3Path)) {
            res.setHeader('Cache-Control', 'public, max-age=604800');
            res.setHeader('Content-Type', 'audio/mpeg');
            return res.sendFile(mp3Path);
        }
        // Générer via Habibi-TTS
        const out = await this.audioService.synthesize(text);
        if (!out) {
            throw new common_1.HttpException('TTS provider not configured — set HABIBI_TTS_URL or HUGGINGFACE_API_KEY', common_1.HttpStatus.NOT_IMPLEMENTED);
        }
        // Mettre en cache
        if (!fs.existsSync(dir))
            fs.mkdirSync(dir, { recursive: true });
        fs.writeFileSync(mp3Path, out.buffer);
        this.logger.log(`[TTS] Generated + cached: ${slug}`);
        res.setHeader('Cache-Control', 'public, max-age=604800');
        res.setHeader('Content-Type', out.contentType ?? 'audio/mpeg');
        return res.send(out.buffer);
    }
    /**
     * GET /audio/vocab/:slug
     * Sert un fichier audio pré-généré du vocabulaire.
     * Utilisé par le script de pré-génération.
     */
    async serveVocab(rawSlug, res) {
        // Accepter avec ou sans .mp3
        const slug = rawSlug.replace(/\.mp3$/i, '');
        if (!/^[a-f0-9]{16}$/.test(slug)) {
            throw new common_1.HttpException('Invalid slug', common_1.HttpStatus.BAD_REQUEST);
        }
        const filePath = path.join(PUBLIC_AUDIO, 'vocab', `${slug}.mp3`);
        if (!fs.existsSync(filePath)) {
            throw new common_1.HttpException('Audio not found', common_1.HttpStatus.NOT_FOUND);
        }
        res.setHeader('Cache-Control', 'public, max-age=2592000'); // 30 jours
        res.setHeader('Content-Type', 'audio/mpeg');
        return res.sendFile(filePath);
    }
    /**
     * POST /audio/vocab/upload
     * Admin: uploader manuellement un MP3 pour un texte donné.
     * Body multipart: { text: string, file: MP3 }
     * Header: X-Admin-Token (comparé à process.env.ADMIN_TOKEN)
     */
    async uploadVocabAudio(file, text, res) {
        const adminToken = process.env.ADMIN_TOKEN;
        const provided = res.req.headers['x-admin-token']?.trim();
        if (!adminToken || provided !== adminToken) {
            throw new common_1.HttpException('Unauthorized', common_1.HttpStatus.UNAUTHORIZED);
        }
        if (!file)
            throw new common_1.HttpException('file is required', common_1.HttpStatus.BAD_REQUEST);
        if (!text?.trim())
            throw new common_1.HttpException('text is required', common_1.HttpStatus.BAD_REQUEST);
        if (!file.mimetype?.startsWith('audio/')) {
            throw new common_1.HttpException('file must be audio/*', common_1.HttpStatus.BAD_REQUEST);
        }
        const slug = audio_service_1.AudioService.slug(text);
        const dir = path.join(PUBLIC_AUDIO, 'vocab');
        if (!fs.existsSync(dir))
            fs.mkdirSync(dir, { recursive: true });
        const dst = path.join(dir, `${slug}.mp3`);
        fs.writeFileSync(dst, file.buffer);
        this.logger.log(`[UPLOAD] vocab audio ${slug} (${file.size} bytes) — text="${text.slice(0, 40)}"`);
        return res.json({ slug, url: `/audio/vocab/${slug}.mp3`, sizeBytes: file.size });
    }
    /**
     * GET /audio/alphabet/:key
     * Retro-compat — génère/sert l'audio d'une lettre de l'alphabet
     */
    async getAlphabetAudio(key, res) {
        // Sécurité basique sur le nom de fichier
        const safeKey = key.replace(/[^a-zA-Z0-9_-]/g, '_').slice(0, 50);
        try {
            await this.audioService.ensureAudio(safeKey, key, 'alphabet');
            const filePath = path.join(PUBLIC_AUDIO, 'alphabet', `${safeKey}.mp3`);
            res.setHeader('Cache-Control', 'public, max-age=2592000');
            return res.sendFile(filePath);
        }
        catch {
            throw new common_1.HttpException('Audio generation failed', common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    // ── ASR ──────────────────────────────────────────────────────────
    async asr(file, body) {
        let transcript = null;
        if (file) {
            transcript = await this.audioService.transcribeBuffer(file.buffer, file.mimetype);
        }
        else if (body?.base64) {
            const buf = Buffer.from(body.base64, 'base64');
            transcript = await this.audioService.transcribeBuffer(buf, body.mimetype ?? 'audio/wav');
        }
        else {
            throw new common_1.HttpException('No audio provided', common_1.HttpStatus.BAD_REQUEST);
        }
        return { transcription: transcript };
    }
    // ── Score prononciation ───────────────────────────────────────────
    async pronunciationScore(file, body) {
        if (!body?.expectedText) {
            throw new common_1.HttpException('expectedText is required', common_1.HttpStatus.BAD_REQUEST);
        }
        let transcription = body.transcription ?? null;
        if (!transcription) {
            if (file) {
                transcription = await this.audioService.transcribeBuffer(file.buffer, file.mimetype);
            }
            else if (body.userAudio) {
                const buf = Buffer.from(body.userAudio, 'base64');
                transcription = await this.audioService.transcribeBuffer(buf, body.mimetype ?? 'audio/wav');
            }
        }
        const score = this.audioService.scorePronunciation(body.expectedText, transcription ?? '');
        return { transcription, ...score };
    }
};
exports.AudioController = AudioController;
__decorate([
    (0, common_1.Get)('tts'),
    __param(0, (0, common_1.Query)('text')),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], AudioController.prototype, "tts", null);
__decorate([
    (0, common_1.Get)('vocab/:slug'),
    __param(0, (0, common_1.Param)('slug')),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], AudioController.prototype, "serveVocab", null);
__decorate([
    (0, common_1.Post)('vocab/upload'),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)('file')),
    __param(0, (0, common_1.UploadedFile)()),
    __param(1, (0, common_1.Body)('text')),
    __param(2, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, Object]),
    __metadata("design:returntype", Promise)
], AudioController.prototype, "uploadVocabAudio", null);
__decorate([
    (0, common_1.Get)('alphabet/:key'),
    __param(0, (0, common_1.Param)('key')),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], AudioController.prototype, "getAlphabetAudio", null);
__decorate([
    (0, common_1.Post)('asr'),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)('file')),
    __param(0, (0, common_1.UploadedFile)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], AudioController.prototype, "asr", null);
__decorate([
    (0, common_1.Post)('pronunciation-score'),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)('file')),
    __param(0, (0, common_1.UploadedFile)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, pronunciation_score_dto_1.PronunciationScoreDto]),
    __metadata("design:returntype", Promise)
], AudioController.prototype, "pronunciationScore", null);
exports.AudioController = AudioController = AudioController_1 = __decorate([
    (0, common_1.Controller)('audio'),
    __metadata("design:paramtypes", [audio_service_1.AudioService])
], AudioController);
