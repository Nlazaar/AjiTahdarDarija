import { VocabularyService } from './vocabulary.service';
export declare class VocabularyController {
    private readonly vocabularyService;
    constructor(vocabularyService: VocabularyService);
    findAll(): {
        message: string;
    };
}
