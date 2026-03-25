import { Body, Controller, Delete, Get, Param, Post, Query, Request, UseGuards } from '@nestjs/common'
import { FriendsService } from './friends.service'
import { JwtGuard } from '../auth/guards/jwt.guard'

@UseGuards(JwtGuard)
@Controller('friends')
export class FriendsController {
  constructor(private svc: FriendsService) {}

  @Get()
  list(@Request() req: any) { return this.svc.listFriends(req.user.id) }

  @Get('requests')
  incoming(@Request() req: any) { return this.svc.listIncoming(req.user.id) }

  @Get('search')
  search(@Request() req: any, @Query('q') q: string) { return this.svc.searchUsers(q ?? '', req.user.id) }

  @Post('request')
  send(@Request() req: any, @Body() body: { email: string }) { return this.svc.sendRequest(req.user.id, body.email) }

  @Post('respond/:id')
  respond(@Request() req: any, @Param('id') id: string, @Body() body: { accept: boolean }) {
    return this.svc.respond(id, req.user.id, body.accept)
  }

  @Delete(':id')
  remove(@Request() req: any, @Param('id') id: string) { return this.svc.remove(id, req.user.id) }
}
