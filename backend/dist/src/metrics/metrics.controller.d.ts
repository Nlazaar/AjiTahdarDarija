import { MetricsService } from './metrics.service';
export declare class MetricsController {
    private metrics;
    constructor(metrics: MetricsService);
    get(): string;
}
