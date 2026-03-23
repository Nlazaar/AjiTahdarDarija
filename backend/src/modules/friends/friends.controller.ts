import { Body, Controller, Delete, Get, Param, Post, Req } from '@nestjs/common'
import { FriendsService } from './friends.service'

@Controller('friends')
export class FriendsController {
  constructor(private svc: FriendsService) {}

  @Post('request')
  async send(@Req() req: any, @Body() body: { toId: string }) {
    const fromId = req.user?.id
    return this.svc.sendRequest(fromId, body.toId)
  }

  @Get('requests')
  async incoming(@Req() req: any) {
    const userId = req.user?.id
    return this.svc.listRequestsFor(userId)
  }

  @Post('respond/:id')
  async respond(@Param('id') id: string, @Body() body: { accept: boolean }) {
    return this.svc.respond(id, body.accept)
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return this.svc.remove(id)
  }
}
