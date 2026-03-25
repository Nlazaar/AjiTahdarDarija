import { Module, NestModule, MiddlewareConsumer } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { LoggerMiddleware } from './common/middleware/logger.middleware';
import { MetricsModule } from './metrics/metrics.module';
import { HealthModule } from './health/health.module';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './modules/auth/auth.module';
import { UsersModule } from './modules/users/users.module';
import { CoursesModule } from './modules/courses/courses.module';
import { LessonsModule } from './modules/lessons/lessons.module';
import { VocabularyModule } from './modules/vocabulary/vocabulary.module';
import { ExercisesModule } from './modules/exercises/exercises.module';
import { ProgressModule } from './modules/progress/progress.module';
import { GamificationModule } from './modules/gamification/gamification.module';
import { I18nModule } from './modules/i18n/i18n.module';

@Module({
  imports: [
    PrismaModule,
    AuthModule,
    UsersModule,
    CoursesModule,
    LessonsModule,
    VocabularyModule,
    ExercisesModule,
    ProgressModule,
    GamificationModule,
    I18nModule,
    MetricsModule,
    HealthModule,
    require('./billing/billing.module').BillingModule,
    require('./analytics/analytics.module').AnalyticsModule,
    require('./modules/friends/friends.module').FriendsModule,
    require('./modules/leaderboard/leaderboard.module').LeaderboardModule,
    require('./modules/leagues/leagues.module').LeaguesModule,
    require('./sync/sync.module').SyncModule,
    require('./modules/packs/packs.module').PacksModule,
    require('./modules/chatbot/chatbot.module').ChatbotModule,
    require('./modules/shop/shop.module').ShopModule,
    require('./modules/quests/quests.module').QuestsModule,
    require('./audio/audio.module').AudioModule,
    require('./modules/modules/modules.module').ModulesModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes('*');
  }
}

