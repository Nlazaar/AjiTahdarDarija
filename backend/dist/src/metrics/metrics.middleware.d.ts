import { NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { MetricsService } from './metrics.service';
export declare class MetricsMiddleware implements NestMiddleware {
    private metrics;
    constructor(metrics: MetricsService);
    use(req: Request, res: Response, next: NextFunction): void;
}
