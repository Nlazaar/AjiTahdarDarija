import { Module } from '@nestjs/common'
import { IoService } from './io.service'
import { IoController } from './io.controller'
import { PrismaModule } from '../../prisma/prisma.module'

@Module({
  imports: [PrismaModule],
  providers: [IoService],
  controllers: [IoController],
})
export class IoModule {}
