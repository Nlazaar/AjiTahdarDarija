export declare class AudioService {
    private readonly logger;
    private hfKey;
    private model;
    ensureAudio(letterKey: string, text: string): Promise<string>;
    synthesize(text: string): Promise<{
        buffer: Buffer;
        contentType?: string;
    } | null>;
    transcribeBuffer(buffer: Buffer, mimetype?: string): Promise<string | null>;
    scorePronunciation(expectedText: string, transcription: string): {
        score: number;
        distance: number;
        wordErrors: {
            expected?: string;
            actual?: string;
        }[];
        suggestions: string[];
    };
}
