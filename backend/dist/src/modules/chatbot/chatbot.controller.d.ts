import { ChatbotService } from './chatbot.service';
import { CreateMessageDto } from './dto/create-message.dto';
export declare class ChatbotController {
    private readonly chatbot;
    constructor(chatbot: ChatbotService);
    message(body: CreateMessageDto): Promise<{
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
    history(userId: string, limit?: string): Promise<{
        id: string;
        createdAt: Date;
        userId: string | null;
        audioUrl: string | null;
        text: string;
        role: string;
    }[]>;
}
