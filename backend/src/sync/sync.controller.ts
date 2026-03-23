import { Body, Controller, Post, Req } from '@nestjs/common'
import { SyncService } from './sync.service'

@Controller('sync')
export class SyncController {
  constructor(private svc: SyncService) {}

  @Post()
  async sync(@Req() req: any, @Body() body: any) {
    // combine server-side user if available
    const userId = req.user?.id ?? body.userId
    return this.svc.processSync({ ...body, userId })
  }
}
