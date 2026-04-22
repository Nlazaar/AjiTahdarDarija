import { Controller, Param, Post, UseGuards } from '@nestjs/common';
import { AdminDebugService } from './admin-debug.service';
import { AdminGuard } from '../../common/guards/admin.guard';

@Controller('admin/debug')
@UseGuards(AdminGuard)
export class AdminDebugController {
  constructor(private readonly service: AdminDebugService) {}

  @Post('reset-user/:userId')
  resetFull(@Param('userId') userId: string) {
    return this.service.resetFullUser(userId);
  }

  @Post('reset-user/:userId/module/:moduleId')
  resetModule(@Param('userId') userId: string, @Param('moduleId') moduleId: string) {
    return this.service.resetModule(userId, moduleId);
  }

  @Post('reset-user/:userId/lesson/:lessonId')
  resetLesson(@Param('userId') userId: string, @Param('lessonId') lessonId: string) {
    return this.service.resetLesson(userId, lessonId);
  }
}
