import { Module } from '@nestjs/common'
import { LeaguesService } from './leagues.service'
import { LeaguesController } from './leagues.controller'
import { PrismaModule } from '../../prisma/prisma.module'

@Module({ imports: [PrismaModule], providers: [LeaguesService], controllers: [LeaguesController] })
export class LeaguesModule {}
