import { useCallback } from 'react';

export function useAnalytics() {
  const trackEvent = useCallback(async (type: string, payload: any = {}) => {
    try {
      await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'}/analytics`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type,
          payload,
          timestamp: new Date().toISOString(),
        }),
      });
    } catch (err) {
      console.error('Analytics error:', err);
    }
  }, []);

  return { trackEvent };
}
