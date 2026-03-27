import { Controller, Post, Body, HttpCode } from '@nestjs/common';
import { SignalementService } from './signalement.service';

export class SignalementDto {
  lessonId?: string;
  phase?: string;
  reasons: string[];
}

@Controller('signalement')
export class SignalementController {
  constructor(private readonly svc: SignalementService) {}

  @Post()
  @HttpCode(200)
  async create(@Body() dto: SignalementDto) {
    await this.svc.send(dto);
    return { ok: true };
  }
}
