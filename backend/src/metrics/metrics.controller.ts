import { Controller, Get, Header } from '@nestjs/common'
import { MetricsService } from './metrics.service'

@Controller('metrics')
export class MetricsController {
  constructor(private metrics: MetricsService) {}

  // Prometheus-compatible plaintext metrics
  @Get()
  @Header('Content-Type', 'text/plain')
  get() {
    const m = this.metrics.getMetrics()
    // expose simple gauges
    const lines = [
      `darija_requests_total ${m.requests}`,
      `darija_avg_response_ms ${m.avgResponseMs}`,
      `darija_errors_total ${m.errors}`,
      `darija_uptime_seconds ${Math.floor(process.uptime())}`,
    ]
    return lines.join('\n')
  }
}
