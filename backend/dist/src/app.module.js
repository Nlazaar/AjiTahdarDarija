"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const app_controller_1 = require("./app.controller");
const app_service_1 = require("./app.service");
const logger_middleware_1 = require("./common/middleware/logger.middleware");
const metrics_module_1 = require("./metrics/metrics.module");
const health_module_1 = require("./health/health.module");
const prisma_module_1 = require("./prisma/prisma.module");
const auth_module_1 = require("./modules/auth/auth.module");
const users_module_1 = require("./modules/users/users.module");
const courses_module_1 = require("./modules/courses/courses.module");
const lessons_module_1 = require("./modules/lessons/lessons.module");
const vocabulary_module_1 = require("./modules/vocabulary/vocabulary.module");
const exercises_module_1 = require("./modules/exercises/exercises.module");
const progress_module_1 = require("./modules/progress/progress.module");
const gamification_module_1 = require("./modules/gamification/gamification.module");
const i18n_module_1 = require("./modules/i18n/i18n.module");
let AppModule = class AppModule {
    configure(consumer) {
        consumer.apply(logger_middleware_1.LoggerMiddleware).forRoutes('*');
    }
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            prisma_module_1.PrismaModule,
            auth_module_1.AuthModule,
            users_module_1.UsersModule,
            courses_module_1.CoursesModule,
            lessons_module_1.LessonsModule,
            vocabulary_module_1.VocabularyModule,
            exercises_module_1.ExercisesModule,
            progress_module_1.ProgressModule,
            gamification_module_1.GamificationModule,
            i18n_module_1.I18nModule,
            metrics_module_1.MetricsModule,
            health_module_1.HealthModule,
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
        controllers: [app_controller_1.AppController],
        providers: [app_service_1.AppService],
    })
], AppModule);
