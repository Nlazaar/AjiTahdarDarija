import { Body, Controller, Delete, Get, Param, Patch, Post, Put, Request, UseGuards } from '@nestjs/common';
import { RevisionsService } from './revisions.service';
import { AdminGuard } from '../../common/guards/admin.guard';
import { JwtGuard } from '../auth/guards/jwt.guard';

@Controller()
export class RevisionsController {
  constructor(private readonly service: RevisionsService) {}

  // Admin — CRUD complet
  @Get('admin/modules/:moduleId/revisions')
  @UseGuards(AdminGuard)
  list(@Param('moduleId') moduleId: string) {
    return this.service.listForModule(moduleId);
  }

  @Get('admin/modules/:moduleId/revisions/:position')
  @UseGuards(AdminGuard)
  getOne(@Param('moduleId') moduleId: string, @Param('position') position: string) {
    return this.service.getOne(moduleId, position);
  }

  @Put('admin/modules/:moduleId/revisions/:position')
  @UseGuards(AdminGuard)
  upsert(
    @Param('moduleId') moduleId: string,
    @Param('position') position: string,
    @Body() body: { title?: string | null; content: any; isPublished?: boolean; anchorAfterOrder?: number | null },
  ) {
    return this.service.upsert(moduleId, position, body);
  }

  @Patch('admin/modules/:moduleId/revisions/:position/anchor')
  @UseGuards(AdminGuard)
  patchAnchor(
    @Param('moduleId') moduleId: string,
    @Param('position') position: string,
    @Body() body: { anchorAfterOrder: number | null },
  ) {
    return this.service.patchAnchor(moduleId, position, body?.anchorAfterOrder ?? null);
  }

  @Delete('admin/modules/:moduleId/revisions/:position')
  @UseGuards(AdminGuard)
  remove(@Param('moduleId') moduleId: string, @Param('position') position: string) {
    return this.service.remove(moduleId, position);
  }

  // Public — lecture seule pour l'app (révisions publiées)
  @Get('modules/:moduleId/revisions')
  listPublic(@Param('moduleId') moduleId: string) {
    return this.service.listPublishedForModule(moduleId);
  }

  @Get('revisions/:id')
  getPublic(@Param('id') id: string) {
    return this.service.getPublishedById(id);
  }

  @Post('revisions/:id/complete')
  @UseGuards(JwtGuard)
  complete(@Request() req: any, @Param('id') id: string) {
    return this.service.completeForUser(req.user.id, id);
  }
}
