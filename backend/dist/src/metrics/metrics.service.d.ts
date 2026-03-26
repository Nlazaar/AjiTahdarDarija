export declare class MetricsService {
    private requestCount;
    private totalResponseTime;
    private errorCount;
    recordRequest(durationMs: number, isError?: boolean): void;
    getMetrics(): {
        requests: number;
        avgResponseMs: number;
        errors: number;
    };
}
