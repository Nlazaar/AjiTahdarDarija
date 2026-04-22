import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import { OneSignalService } from './onesignal.service';
import { PushController } from './push.controller';
import { StreakReminderService } from './streak-reminder.service';

@Module({
  imports: [ScheduleModule.forRoot()],
  providers: [OneSignalService, StreakReminderService],
  controllers: [PushController],
  exports: [OneSignalService],
})
export class PushModule {}
