import { useState } from 'react';
import { cookieAPIClient } from '@/lib/cookie-api-client';

export function useCookieAuth() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const testAuth = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const result = await cookieAPIClient.testAuth();
      setData(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Authentication test failed');
    } finally {
      setLoading(false);
    }
  };

  const testProtectedGET = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const result = await cookieAPIClient.get('/protected-cookie');
      setData(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Protected GET request failed');
    } finally {
      setLoading(false);
    }
  };

  const testProtectedPOST = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const result = await cookieAPIClient.post('/protected-cookie', {
        message: 'Hello from frontend!',
        timestamp: new Date().toISOString(),
        testData: {
          userId: 'test-user',
          action: 'cookie-auth-test'
        }
      });
      setData(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Protected POST request failed');
    } finally {
      setLoading(false);
    }
  };

  const clearResults = () => {
    setData(null);
    setError(null);
  };

  return {
    data,
    loading,
    error,
    testAuth,
    testProtectedGET,
    testProtectedPOST,
    clearResults,
  };
}
