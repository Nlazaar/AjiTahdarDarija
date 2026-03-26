"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MetricsController = void 0;
const common_1 = require("@nestjs/common");
const metrics_service_1 = require("./metrics.service");
let MetricsController = class MetricsController {
    constructor(metrics) {
        this.metrics = metrics;
    }
    // Prometheus-compatible plaintext metrics
    get() {
        const m = this.metrics.getMetrics();
        // expose simple gauges
        const lines = [
            `darija_requests_total ${m.requests}`,
            `darija_avg_response_ms ${m.avgResponseMs}`,
            `darija_errors_total ${m.errors}`,
            `darija_uptime_seconds ${Math.floor(process.uptime())}`,
        ];
        return lines.join('\n');
    }
};
exports.MetricsController = MetricsController;
__decorate([
    (0, common_1.Get)(),
    (0, common_1.Header)('Content-Type', 'text/plain'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], MetricsController.prototype, "get", null);
exports.MetricsController = MetricsController = __decorate([
    (0, common_1.Controller)('metrics'),
    __metadata("design:paramtypes", [metrics_service_1.MetricsService])
], MetricsController);
