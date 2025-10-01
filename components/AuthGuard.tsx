'use client';
import { useUser } from '@auth0/nextjs-auth0';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { motion } from 'framer-motion';
import { Shield, AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

interface AuthGuardProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
  redirectTo?: string;
  requireAuth?: boolean;
}

export default function AuthGuard({ 
  children, 
  fallback, 
  redirectTo = '/auth/login',
  requireAuth = true 
}: AuthGuardProps) {
  const { user, isLoading } = useUser();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading) {
      if (requireAuth && !user) {
        router.push(redirectTo);
      } else if (!requireAuth && user) {
        // If user is logged in but this page doesn't require auth, redirect to profile
        router.push('/profile');
      }
    }
  }, [user, isLoading, router, redirectTo, requireAuth]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen text-white">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-white/30 border-t-white rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-xl">Checking authentication...</p>
        </div>
      </div>
    );
  }

  // If authentication is required but user is not logged in
  if (requireAuth && !user) {
    if (fallback) {
      return <>{fallback}</>;
    }

    return (
      <div className="flex items-center justify-center min-h-screen text-white">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center max-w-md mx-auto"
        >
          <div className="w-20 h-20 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
            <Shield className="w-10 h-10 text-red-400" />
          </div>
          <h1 className="text-3xl font-bold mb-4">Access Denied</h1>
          <p className="text-xl text-white/80 mb-8">
            You need to be logged in to access this page.
          </p>
          <Link href={redirectTo}>
            <Button className="bg-white text-black hover:bg-gray-200 px-8 py-3">
              Go to Login
            </Button>
          </Link>
        </motion.div>
      </div>
    );
  }

  // If user is logged in but this page doesn't require auth
  if (!requireAuth && user) {
    return (
      <div className="flex items-center justify-center min-h-screen text-white">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center max-w-md mx-auto"
        >
          <div className="w-20 h-20 bg-blue-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
            <AlertTriangle className="w-10 h-10 text-blue-400" />
          </div>
          <h1 className="text-3xl font-bold mb-4">Already Logged In</h1>
          <p className="text-xl text-white/80 mb-8">
            You're already logged in. Redirecting to your profile...
          </p>
          <Link href="/profile">
            <Button className="bg-white text-black hover:bg-gray-200 px-8 py-3">
              Go to Profile
            </Button>
          </Link>
        </motion.div>
      </div>
    );
  }

  return <>{children}</>;
}