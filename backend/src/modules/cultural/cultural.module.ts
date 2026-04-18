import { Module } from '@nestjs/common';
import { CulturalService } from './cultural.service';
import { CulturalController } from './cultural.controller';
import { PrismaModule } from '../../prisma/prisma.module';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [PrismaModule, AuthModule],
  controllers: [CulturalController],
  providers: [CulturalService],
  exports: [CulturalService],
})
export class CulturalModule {}
