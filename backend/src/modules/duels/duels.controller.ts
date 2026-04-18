import { Body, Controller, Get, Param, Post, Request, UseGuards } from '@nestjs/common';
import { DuelsService } from './duels.service';
import { JwtGuard } from '../auth/guards/jwt.guard';

@UseGuards(JwtGuard)
@Controller('duels')
export class DuelsController {
  constructor(private readonly duels: DuelsService) {}

  @Post()
  create(@Request() req: any, @Body() body: { lessonId?: string; rounds?: number }) {
    return this.duels.create(req.user.id, body ?? {});
  }

  @Get('open')
  listOpen(@Request() req: any) {
    return this.duels.listOpen(req.user.id);
  }

  @Get('mine')
  listMine(@Request() req: any) {
    return this.duels.listMine(req.user.id);
  }

  @Get(':id')
  get(@Param('id') id: string, @Request() req: any) {
    return this.duels.get(id, req.user.id);
  }

  @Post(':id/join')
  join(@Param('id') id: string, @Request() req: any) {
    return this.duels.join(id, req.user.id);
  }

  @Post(':id/round')
  submit(
    @Param('id') id: string,
    @Request() req: any,
    @Body() body: { score: number; correct: boolean },
  ) {
    return this.duels.submitRound(id, req.user.id, body);
  }

  @Post(':id/cancel')
  cancel(@Param('id') id: string, @Request() req: any) {
    return this.duels.cancel(id, req.user.id);
  }
}
