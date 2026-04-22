import { Body, Controller, Delete, Post, Request, UseGuards } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { JwtGuard } from '../auth/guards/jwt.guard';

@UseGuards(JwtGuard)
@Controller('push')
export class PushController {
  constructor(private readonly prisma: PrismaService) {}

  @Post('subscription')
  async setSubscription(
    @Request() req: any,
    @Body() body: { subscriptionId: string },
  ) {
    const subId = (body?.subscriptionId ?? '').trim();
    if (!subId) return { ok: false, error: 'Missing subscriptionId' };
    await this.prisma.user.update({
      where: { id: req.user.id },
      data: {
        oneSignalSubId: subId,
        pushOptedInAt: new Date(),
      },
    });
    return { ok: true };
  }

  @Delete('subscription')
  async clearSubscription(@Request() req: any) {
    await this.prisma.user.update({
      where: { id: req.user.id },
      data: { oneSignalSubId: null },
    });
    return { ok: true };
  }
}
