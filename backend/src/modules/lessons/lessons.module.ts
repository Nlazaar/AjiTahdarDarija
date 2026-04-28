import { Module } from '@nestjs/common';
import { LessonsService } from './lessons.service';
import { LessonsController } from './lessons.controller';
import { PrismaModule } from '../../prisma/prisma.module';
import { AuthModule } from '../auth/auth.module';
import { QuestsModule } from '../quests/quests.module';
import { GamificationModule } from '../gamification/gamification.module';

@Module({
  imports: [PrismaModule, AuthModule, QuestsModule, GamificationModule],
  providers: [LessonsService],
  controllers: [LessonsController],
  exports: [LessonsService],
})
export class LessonsModule {}
