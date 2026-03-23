import { Injectable } from '@nestjs/common'

@Injectable()
export class MetricsService {
  private requestCount = 0
  private totalResponseTime = 0
  private errorCount = 0

  recordRequest(durationMs: number, isError = false) {
    this.requestCount += 1
    this.totalResponseTime += durationMs
    if (isError) this.errorCount += 1
  }

  getMetrics() {
    return {
      requests: this.requestCount,
      avgResponseMs: this.requestCount ? this.totalResponseTime / this.requestCount : 0,
      errors: this.errorCount,
    }
  }
}
