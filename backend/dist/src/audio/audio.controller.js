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
Object.defineProperty(exports, "__esModule", { value: true });
exports.AudioController = void 0;
const common_1 = require("@nestjs/common");
const platform_express_1 = require("@nestjs/platform-express");
const audio_service_1 = require("./audio.service");
const pronunciation_score_dto_1 = require("./dto/pronunciation-score.dto");
const path = require("path");
let AudioController = class AudioController {
    constructor(audioService) {
        this.audioService = audioService;
    }
    // Serve or generate cached alphabet audio
    async getAlphabetAudio(key, res) {
        try {
            const text = key;
            await this.audioService.ensureAudio(key, text);
            const filePath = path.join(process.cwd(), 'public', 'audio', 'alphabet', `${key}.mp3`);
            return res.sendFile(filePath);
        }
        catch (err) {
            return res.status(common_1.HttpStatus.INTERNAL_SERVER_ERROR).json({ error: 'audio_error' });
        }
    }
    async tts(text, res) {
        if (!text)
            throw new common_1.HttpException('Missing text query', common_1.HttpStatus.BAD_REQUEST);
        const out = await this.audioService.synthesize?.(text);
        if (!out)
            throw new common_1.HttpException('TTS provider not configured', common_1.HttpStatus.NOT_IMPLEMENTED);
        res.setHeader('Content-Type', out.contentType || 'audio/mpeg');
        res.send(out.buffer);
    }
    async asr(file, body) {
        if (file) {
            const transcript = await this.audioService.transcribeBuffer?.(file.buffer, file.mimetype);
            return { transcription: transcript };
        }
        if (body?.base64) {
            const buf = Buffer.from(body.base64, 'base64');
            const transcript = await this.audioService.transcribeBuffer?.(buf, body.mimetype || 'audio/wav');
            return { transcription: transcript };
        }
        throw new common_1.HttpException('No audio provided', common_1.HttpStatus.BAD_REQUEST);
    }
    async pronunciationScore(file, body) {
        if (!body?.expectedText)
            throw new common_1.HttpException('expectedText is required', common_1.HttpStatus.BAD_REQUEST);
        let transcription = body.transcription;
        if (!transcription) {
            if (file)
                transcription = await this.audioService.transcribeBuffer?.(file.buffer, file.mimetype);
            else if (body.userAudio)
                transcription = await this.audioService.transcribeBuffer?.(Buffer.from(body.userAudio, 'base64'), body.mimetype || 'audio/wav');
        }
        if (!transcription) {
            const partial = this.audioService.scorePronunciation?.(body.expectedText, '');
            return { transcription: null, provider: null, ...partial };
        }
        const score = this.audioService.scorePronunciation?.(body.expectedText, transcription);
        return { transcription, provider: null, ...score };
    }
};
exports.AudioController = AudioController;
__decorate([
    (0, common_1.Get)('alphabet/:key'),
    __param(0, (0, common_1.Param)('key')),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], AudioController.prototype, "getAlphabetAudio", null);
__decorate([
    (0, common_1.Get)('tts'),
    __param(0, (0, common_1.Query)('text')),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], AudioController.prototype, "tts", null);
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
exports.AudioController = AudioController = __decorate([
    (0, common_1.Controller)('audio'),
    __metadata("design:paramtypes", [audio_service_1.AudioService])
], AudioController);
