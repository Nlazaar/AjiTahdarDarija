import { Module } from '@nestjs/common';
import { UserVocabularyService } from './user-vocabulary.service';
import { UserVocabularyController } from './user-vocabulary.controller';

@Module({
  providers: [UserVocabularyService],
  controllers: [UserVocabularyController],
})
export class UserVocabularyModule {}
