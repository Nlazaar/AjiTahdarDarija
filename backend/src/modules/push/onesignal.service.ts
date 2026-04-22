import { Injectable, Logger } from '@nestjs/common';

interface SendArgs {
  subscriptionIds: string[];
  title: string;
  body: string;
  url?: string;
  data?: Record<string, any>;
}

@Injectable()
export class OneSignalService {
  private readonly logger = new Logger(OneSignalService.name);
  private readonly appId  = process.env.ONESIGNAL_APP_ID ?? '';
  private readonly apiKey = process.env.ONESIGNAL_REST_API_KEY ?? '';

  isConfigured(): boolean {
    return !!this.appId && !!this.apiKey;
  }

  async send({ subscriptionIds, title, body, url, data }: SendArgs): Promise<{ ok: boolean; recipients?: number; error?: string }> {
    if (!this.isConfigured()) {
      this.logger.warn('OneSignal not configured — skipping push');
      return { ok: false, error: 'OneSignal not configured' };
    }
    if (subscriptionIds.length === 0) {
      return { ok: false, error: 'No recipients' };
    }
    try {
      const res = await fetch('https://api.onesignal.com/notifications', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Key ${this.apiKey}`,
        },
        body: JSON.stringify({
          app_id: this.appId,
          include_subscription_ids: subscriptionIds,
          headings: { en: title, fr: title },
          contents: { en: body, fr: body },
          url,
          data,
        }),
      });
      const json: any = await res.json().catch(() => ({}));
      if (!res.ok) {
        this.logger.error(`OneSignal send failed (${res.status}): ${JSON.stringify(json)}`);
        return { ok: false, error: json?.errors?.[0] ?? `HTTP ${res.status}` };
      }
      return { ok: true, recipients: json?.recipients ?? subscriptionIds.length };
    } catch (err: any) {
      this.logger.error(`OneSignal network error: ${err?.message}`);
      return { ok: false, error: err?.message ?? 'Network error' };
    }
  }
}
