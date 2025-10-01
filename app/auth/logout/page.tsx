'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function LogoutPage() {
  const router = useRouter();

  useEffect(() => {
    // Clear any local storage/session data
    localStorage.clear();
    sessionStorage.clear();
    
    // Redirect to Auth0 logout
    window.location.href = '/api/auth/logout';
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center text-white">
      <div className="text-center">
        <div className="w-16 h-16 border-4 border-white/30 border-t-white rounded-full animate-spin mx-auto mb-4"></div>
        <p className="text-xl">Logging out...</p>
      </div>
    </div>
  );
}
