import { useState } from 'react';
import { useUser } from '@auth0/nextjs-auth0';

export function useJWTAuth() {
  const { user } = useUser();
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Test JWT authentication with user data endpoint
  const testUserData = async () => {
    setLoading(true);
    setError(null);
    
    try {
      // For now, we'll use the cookie-based auth since we don't have the actual JWT token
      // In a real implementation, you'd get the JWT token from Auth0
      const response = await fetch('/api/protected/user-data', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          // In a real implementation, you'd add: 'Authorization': `Bearer ${jwtToken}`
        },
        credentials: 'include', // Use cookies for now
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Authentication failed');
      }

      const result = await response.json();
      setData(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'JWT authentication test failed');
    } finally {
      setLoading(false);
    }
  };

  // Test admin endpoint
  const testAdminEndpoint = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch('/api/protected/admin', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          // In a real implementation, you'd add: 'Authorization': `Bearer ${jwtToken}`
        },
        credentials: 'include', // Use cookies for now
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Admin access denied');
      }

      const result = await response.json();
      setData(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Admin endpoint test failed');
    } finally {
      setLoading(false);
    }
  };

  // Send data to protected endpoint
  const sendDataToProtected = async (payload: any) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch('/api/protected/user-data', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          // In a real implementation, you'd add: 'Authorization': `Bearer ${jwtToken}`
        },
        credentials: 'include', // Use cookies for now
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to send data');
      }

      const result = await response.json();
      setData(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to send data to protected endpoint');
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
    testUserData,
    testAdminEndpoint,
    sendDataToProtected,
    clearResults,
  };
}
