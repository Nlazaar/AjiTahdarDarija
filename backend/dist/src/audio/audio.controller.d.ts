import { Response } from 'express';
import { AudioService } from './audio.service';
import { PronunciationScoreDto } from './dto/pronunciation-score.dto';
export declare class AudioController {
    private readonly audioService;
    constructor(audioService: AudioService);
    getAlphabetAudio(key: string, res: Response): Promise<void | Response<any, Record<string, any>>>;
    tts(text: string, res: Response): Promise<void>;
    asr(file: any, body: any): Promise<{
        transcription: string;
    }>;
    pronunciationScore(file: any, body: PronunciationScoreDto): Promise<{
        score: number;
        distance: number;
        wordErrors: {
            expected?: string;
            actual?: string;
        }[];
        suggestions: string[];
        transcription: string;
        provider: any;
    }>;
}
