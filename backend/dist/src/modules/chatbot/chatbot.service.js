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
var ChatbotService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChatbotService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../prisma/prisma.service");
const audio_service_1 = require("../../audio/audio.service");
let ChatbotService = ChatbotService_1 = class ChatbotService {
    constructor(prisma, audioService) {
        this.prisma = prisma;
        this.audioService = audioService;
        this.logger = new common_1.Logger(ChatbotService_1.name);
    }
    // Store message and generate a simple reply + corrections
    async handleMessage(userId, message, audioBase64) {
        // store user message
        const userMsg = await this.prisma.conversationMessage.create({ data: { userId: userId || null, role: 'user', text: message } });
        // Simple analysis: detect common errors (very naive): repeated spaces, non-letter tokens
        const corrections = [];
        if (/\s{2,}/.test(message)) {
            corrections.push({ error: 'Espaces multiples', expected: message.replace(/\s{2,}/g, ' '), explanation: 'Supprimez les espaces en trop entre les mots.' });
        }
        // Suggest alternatives: echo + small variants
        const suggestions = [message, `${message} (parfait)`, `Je dirais: ${message}`].slice(0, 3);
        // Difficulty heuristic: short messages -> A1, longer -> B1
        const difficultyLevel = message.length < 40 ? 'A1' : 'B1';
        // Reply generation: simple templated reply for now
        const replyText = `Je vous entends — vous avez dit: "${message}". Voici une suggestion.`;
        const botMsg = await this.prisma.conversationMessage.create({ data: { userId: userId || null, role: 'bot', text: replyText } });
        // Optionally produce TTS if audio requested (AudioService.synthesize must be implemented)
        let replyAudioUrl = null;
        try {
            const tts = await this.audioService.synthesize(replyText);
            if (tts && tts.buffer) {
                // In this scaffold we won't persist the buffer; in prod we'd upload to storage (S3) and return URL
                replyAudioUrl = null;
            }
        }
        catch (e) {
            this.logger.warn('TTS generation failed or not configured');
        }
        return { replyText, replyAudioUrl, suggestions, corrections, difficultyLevel };
    }
    async getRecentMessages(userId, limit = 50) {
        return this.prisma.conversationMessage.findMany({ where: { userId: userId || undefined }, orderBy: { createdAt: 'desc' }, take: limit });
    }
};
exports.ChatbotService = ChatbotService;
exports.ChatbotService = ChatbotService = ChatbotService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService, audio_service_1.AudioService])
], ChatbotService);
