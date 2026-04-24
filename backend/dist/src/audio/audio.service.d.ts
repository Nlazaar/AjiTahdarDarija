export declare class AudioService {
    private readonly logger;
    private habibUrl;
    private hfKey;
    private hfModel;
    /**
     * Retourne le chemin absolu du fichier MP3 pour `text`.
     * Génère et met en cache si inexistant.
     */
    ensureAudio(slug: string, text: string, subDir?: string): Promise<string>;
    /**
     * Génère l'audio pour `text` — essaie Habibi-TTS en priorité,
     * puis HuggingFace Inference API en fallback.
     */
    synthesize(text: string): Promise<{
        buffer: Buffer;
        contentType: string;
    } | null>;
    private callHabibi;
    private callHuggingFace;
    transcribeBuffer(_buffer: Buffer, _mimetype?: string): Promise<string | null>;
    scorePronunciation(expectedText: string, transcription: string): {
        score: number;
        distance: number;
        wordErrors: {
            expected?: string;
            actual?: string;
        }[];
        suggestions: string[];
    };
    /** Génère un slug de fichier stable (SHA-256 du texte, 16 premiers chars) */
    static slug(text: string): string;
    /** URL publique relative du fichier audio mis en cache */
    static publicUrl(slug: string, subDir?: string): string;
}
