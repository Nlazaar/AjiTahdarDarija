import { Module, MiddlewareConsumer, NestModule } from '@nestjs/common'
import { MetricsService } from './metrics.service'
import { MetricsMiddleware } from './metrics.middleware'
import { MetricsController } from './metrics.controller'

@Module({
  providers: [MetricsService, MetricsMiddleware],
  controllers: [MetricsController],
  exports: [MetricsService, MetricsMiddleware],
})
export class MetricsModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(MetricsMiddleware).forRoutes('*')
  }
}
