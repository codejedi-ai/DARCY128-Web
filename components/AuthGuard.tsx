"use client";
import { useUser } from '@auth0/nextjs-auth0';
import { motion } from 'framer-motion';
import { Brain, LogIn } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ROUTES } from '@/lib/routes';

interface AuthGuardProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

export default function AuthGuard({ children, fallback }: AuthGuardProps) {
  const { user, isLoading } = useUser();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-white">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-white/30 border-t-white rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-xl">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    if (fallback) {
      return <>{fallback}</>;
    }

    return (
      <div className="min-h-screen flex items-center justify-center text-white">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center max-w-md mx-auto px-4"
        >
          <div className="w-24 h-24 bg-white/10 rounded-full flex items-center justify-center mx-auto mb-6 backdrop-blur-sm border border-white/20">
            <Brain className="w-12 h-12 text-white" />
          </div>
          
          <h1 className="text-3xl font-bold mb-4">Access Required</h1>
          <p className="text-lg text-gray-300 mb-8">
            Please log in to access this feature. Perceptr helps you master the art of small talk and build meaningful connections.
          </p>
          
          <Link href={ROUTES.LOGIN}>
            <Button className="bg-white text-black hover:bg-gray-200 px-8 py-3">
              <LogIn className="w-5 h-5 mr-2" />
              Login to Continue
            </Button>
          </Link>
          
          <div className="mt-8 text-sm text-gray-400">
            <p>New to Perceptr? Sign up to get started!</p>
          </div>
        </motion.div>
      </div>
    );
  }

  return <>{children}</>;
}
