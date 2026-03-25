import { Controller, Get, Request, UseGuards } from '@nestjs/common';
import { ProgressService } from './progress.service';
import { JwtGuard } from '../auth/guards/jwt.guard';

@UseGuards(JwtGuard)
@Controller('progress')
export class ProgressController {
  constructor(private readonly progressService: ProgressService) {}

  @Get('me')
  me(@Request() req: any) {
    return this.progressService.getUserProgress(req.user.id);
  }
}
