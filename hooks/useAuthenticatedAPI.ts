import { useState } from 'react';
import { useUser } from '@auth0/nextjs-auth0';

export function useAuthenticatedAPI() {
  const { user } = useUser();
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Test check-user endpoint
  const checkUser = async (userId: string) => {
    setLoading(true);
    setError(null);
    
    try {
      // For now, we'll use cookie-based auth since we don't have the actual JWT token
      // In a real implementation, you'd add the JWT token to the Authorization header
      const response = await fetch(`/api/check-user?userId=${userId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          // In a real implementation, you'd add: 'Authorization': `Bearer ${jwtToken}`
        },
        credentials: 'include', // Use cookies for now
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to check user');
      }

      const result = await response.json();
      setData(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to check user');
    } finally {
      setLoading(false);
    }
  };

  // Test fetch-users endpoint
  const fetchUsers = async (userId: string) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch(`/api/fetch-users?userId=${userId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          // In a real implementation, you'd add: 'Authorization': `Bearer ${jwtToken}`
        },
        credentials: 'include', // Use cookies for now
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to fetch users');
      }

      const result = await response.json();
      setData(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch users');
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
    user,
    checkUser,
    fetchUsers,
    clearResults,
  };
}
