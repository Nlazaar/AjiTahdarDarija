import { Module } from '@nestjs/common';
import { ModulesController } from './modules.controller';
import { CoursesModule } from '../courses/courses.module';

@Module({
  imports: [CoursesModule],
  controllers: [ModulesController],
})
export class ModulesModule {}
