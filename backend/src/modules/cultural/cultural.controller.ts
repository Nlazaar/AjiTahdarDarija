import { Body, Controller, Get, Param, Post, Query, Request, UseGuards } from '@nestjs/common';
import { CulturalService } from './cultural.service';
import { JwtGuard } from '../auth/guards/jwt.guard';

@Controller('cultural')
export class CulturalController {
  constructor(private readonly svc: CulturalService) {}

  // Public: browse the collection catalog
  @Get()
  list(@Query('category') category?: string) {
    return this.svc.list(category);
  }

  @UseGuards(JwtGuard)
  @Get('mine')
  mine(@Request() req: any) {
    return this.svc.myCollection(req.user.id);
  }

  @UseGuards(JwtGuard)
  @Post('unlock/:key')
  unlock(@Param('key') key: string, @Request() req: any) {
    return this.svc.unlock(req.user.id, key);
  }
}
