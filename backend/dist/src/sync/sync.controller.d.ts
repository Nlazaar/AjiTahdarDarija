import { SyncService } from './sync.service';
export declare class SyncController {
    private svc;
    constructor(svc: SyncService);
    sync(req: any, body: any): Promise<{
        error: string;
        ok?: undefined;
        results?: undefined;
    } | {
        ok: boolean;
        results: any[];
        error?: undefined;
    }>;
}
