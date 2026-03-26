import { PrismaService } from '../../prisma/prisma.service';
import { AudioService } from '../../audio/audio.service';
export declare class ChatbotService {
    private prisma;
    private audioService;
    private readonly logger;
    constructor(prisma: PrismaService, audioService: AudioService);
    handleMessage(userId: string | undefined, message: string, audioBase64?: string): Promise<{
        replyText: string;
        replyAudioUrl: string;
        suggestions: string[];
        corrections: {
            error: string;
            expected: string;
            explanation: string;
        }[];
        difficultyLevel: string;
    }>;
    getRecentMessages(userId: string | undefined, limit?: number): Promise<{
        id: string;
        createdAt: Date;
        userId: string | null;
        text: string;
        role: string;
        audioUrl: string | null;
    }[]>;
}
