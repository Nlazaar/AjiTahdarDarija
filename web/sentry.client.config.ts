import * as Sentry from '@sentry/nextjs';

const SENTRY_DSN = process.env.NEXT_PUBLIC_SENTRY_DSN;

if (SENTRY_DSN) {
  Sentry.init({
    dsn: SENTRY_DSN,
    environment: process.env.NODE_ENV,
    tracesSampleRate: process.env.NODE_ENV === 'production' ? 0.1 : 1.0,
    debug: false,
    // Ignorer les erreurs connues non-critiques
    ignoreErrors: [
      'ResizeObserver loop limit exceeded',
      'Network request failed',
      'NEXT_REDIRECT',
      'NEXT_NOT_FOUND',
    ],
  });
}
