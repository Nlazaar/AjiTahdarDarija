import { Response } from 'express';
import { AudioService } from './audio.service';
import { PronunciationScoreDto } from './dto/pronunciation-score.dto';
export declare class AudioController {
    private readonly audioService;
    private readonly logger;
    constructor(audioService: AudioService);
    /**
     * GET /audio/tts?text=مرحبا
     * Retourne un MP3 :
     *   1. Depuis le cache disque si déjà généré
     *   2. Génère via Habibi-TTS et met en cache
     *   3. 501 si aucun provider configuré
     *
     * Cache-Control: 7 jours — le slug est déterministe (MD5 du texte)
     */
    tts(text: string, res: Response): Promise<void | Response<any, Record<string, any>>>;
    /**
     * GET /audio/vocab/:slug
     * Sert un fichier audio pré-généré du vocabulaire.
     * Utilisé par le script de pré-génération.
     */
    serveVocab(rawSlug: string, res: Response): Promise<void>;
    /**
     * POST /audio/vocab/upload
     * Admin: uploader manuellement un MP3 pour un texte donné.
     * Body multipart: { text: string, file: MP3 }
     * Header: X-Admin-Token (comparé à process.env.ADMIN_TOKEN)
     */
    uploadVocabAudio(file: Express.Multer.File, text: string, res: Response): Promise<Response<any, Record<string, any>>>;
    /**
     * GET /audio/alphabet/:key
     * Retro-compat — génère/sert l'audio d'une lettre de l'alphabet
     */
    getAlphabetAudio(key: string, res: Response): Promise<void>;
    asr(file: Express.Multer.File, body: {
        base64?: string;
        mimetype?: string;
    }): Promise<{
        transcription: string;
    }>;
    pronunciationScore(file: Express.Multer.File, body: PronunciationScoreDto): Promise<{
        score: number;
        distance: number;
        wordErrors: {
            expected?: string;
            actual?: string;
        }[];
        suggestions: string[];
        transcription: string;
    }>;
}
