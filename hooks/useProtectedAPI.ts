import { useState, useEffect } from 'react';
import { useAPIClient } from '@/lib/api-client';

export function useProtectedAPI() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const apiClient = useAPIClient();

  const fetchProtectedData = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const result = await apiClient.get('/protected');
      setData(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch data');
    } finally {
      setLoading(false);
    }
  };

  const sendData = async (payload: any) => {
    setLoading(true);
    setError(null);
    
    try {
      const result = await apiClient.post('/protected', payload);
      setData(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to send data');
    } finally {
      setLoading(false);
    }
  };

  return {
    data,
    loading,
    error,
    fetchProtectedData,
    sendData,
  };
}
