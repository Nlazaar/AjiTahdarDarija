import { Module } from '@nestjs/common';
import { AdminDebugController } from './admin-debug.controller';
import { AdminDebugService } from './admin-debug.service';
import { PrismaModule } from '../../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [AdminDebugController],
  providers: [AdminDebugService],
})
export class AdminDebugModule {}
