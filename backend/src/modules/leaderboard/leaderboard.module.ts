import { Module } from '@nestjs/common'
import { LeaderboardService } from './leaderboard.service'
import { LeaderboardController } from './leaderboard.controller'
import { PrismaModule } from '../../prisma/prisma.module'
import { AuthModule } from '../auth/auth.module'

@Module({ imports: [PrismaModule, AuthModule], providers: [LeaderboardService], controllers: [LeaderboardController] })
export class LeaderboardModule {}
