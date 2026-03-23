import React from 'react';
import api from '../lib/api';

export function useAnalytics() {
  const trackEvent = React.useCallback(async (type: string, payload: any = {}) => {
    try {
      await api.request('/analytics', {
        method: 'POST',
        body: JSON.stringify({
          type,
          payload,
          timestamp: new Date().toISOString(),
        }),
      });
    } catch (err) {
      console.error('Mobile Analytics error:', err);
    }
  }, []);

  return { trackEvent };
}
