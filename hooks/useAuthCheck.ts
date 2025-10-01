import { useUser } from '@auth0/nextjs-auth0';
import { useState, useEffect } from 'react';
import { cookieAPIClient } from '../lib/cookie-api-client';

export interface AuthCheckResult {
  isAuthenticated: boolean;
  isLoading: boolean;
  user: any;
  backendValid: boolean;
  error: string | null;
  lastChecked: Date | null;
}

export function useAuthCheck() {
  const { user, isLoading, error } = useUser();
  const [backendValid, setBackendValid] = useState(false);
  const [backendError, setBackendError] = useState<string | null>(null);
  const [lastChecked, setLastChecked] = useState<Date | null>(null);

  const checkBackendAuth = async () => {
    try {
      await cookieAPIClient.testAuth();
      setBackendValid(true);
      setBackendError(null);
    } catch (err) {
      setBackendValid(false);
      setBackendError(err instanceof Error ? err.message : 'Backend auth failed');
    }
    setLastChecked(new Date());
  };

  useEffect(() => {
    if (!isLoading && user) {
      checkBackendAuth();
    }
  }, [user, isLoading]);

  return {
    isAuthenticated: !!user && backendValid,
    isLoading,
    user,
    backendValid,
    error: error?.message || backendError,
    lastChecked,
    refreshAuth: checkBackendAuth
  };
}

// Simple hook for just checking if user is logged in
export function useIsLoggedIn() {
  const { user, isLoading } = useUser();
  return {
    isLoggedIn: !!user,
    isLoading,
    user
  };
}
