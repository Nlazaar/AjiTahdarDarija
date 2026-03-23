import { useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';

export function useApi() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const callApi = useCallback(async (apiFunction: (...args: any[]) => Promise<any>, ...args: any[]) => {
    setLoading(true);
    setError(null);
    try {
      const result = await apiFunction(...args);
      return result;
    } catch (err: any) {
      if (err.message?.includes('401')) {
        router.push('/login');
      }
      setError(err.message || 'An error occurred');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [router]);

  return { loading, error, callApi };
}
