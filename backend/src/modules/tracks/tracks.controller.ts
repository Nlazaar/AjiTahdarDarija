import { Controller, Get, Patch, Param, Body, UseGuards } from '@nestjs/common';
import { TracksService } from './tracks.service';
import { AdminGuard } from '../../common/guards/admin.guard';

@Controller('tracks')
export class TracksController {
  constructor(private readonly tracks: TracksService) {}

  /** GET /tracks — publique. Retourne les tracks publiés, triés. */
  @Get()
  findAll() {
    return this.tracks.findAllPublic();
  }

  // ── Admin (header X-Admin-Token) ─────────────────────────────────────────

  @UseGuards(AdminGuard)
  @Get('admin/all')
  listAllForAdmin() {
    return this.tracks.findAllForAdmin();
  }

  @UseGuards(AdminGuard)
  @Patch('reorder')
  reorder(@Body() body: { ordered: { id: string; order: number }[] }) {
    return this.tracks.reorder(body?.ordered ?? []);
  }

  @UseGuards(AdminGuard)
  @Patch(':id')
  update(@Param('id') id: string, @Body() body: any) {
    return this.tracks.update(id, body ?? {});
  }
}
