'use client';
import { useUser } from "@auth0/nextjs-auth0";
import { motion } from 'framer-motion';
import { User, Mail, Calendar, Settings } from 'lucide-react';
import Link from 'next/link';
import { Button } from "@/components/ui/button";
import LogoutButton from '@/components/LogoutButton';

export default function ProfilePage() {
  const { user, isLoading } = useUser();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen text-white">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-white/30 border-t-white rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-xl">Loading your profile...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen text-white">
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-4">Access Denied</h1>
          <p className="text-xl mb-8">Please log in to view your profile</p>
          <Link href="/auth/login">
            <Button className="bg-white text-black hover:bg-gray-200">
              Login
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen text-white pt-8 px-4">
        <div className="max-w-4xl mx-auto">
          {/* Profile Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <div className="w-32 h-32 bg-white/10 rounded-full flex items-center justify-center mx-auto mb-6 backdrop-blur-sm border border-white/20 overflow-hidden">
              {user.picture ? (
                <img 
                  src={user.picture} 
                  alt="Profile" 
                  className="w-full h-full object-cover"
                />
              ) : (
                <User className="w-16 h-16 text-white" />
              )}
            </div>
            <h1 className="text-4xl font-bold mb-2">{user.name || 'User'}</h1>
            <p className="text-xl text-white/80">{user.email}</p>
          </motion.div>

          {/* Profile Cards */}
          <div className="grid md:grid-cols-2 gap-6 mb-8">
            {/* Personal Info Card */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20"
            >
              <h3 className="text-xl font-semibold mb-4 flex items-center">
                <User className="w-5 h-5 mr-2" />
                Personal Information
              </h3>
              <div className="space-y-3">
                <div className="flex items-center">
                  <Mail className="w-4 h-4 mr-3 text-white/60" />
                  <span className="text-white/80">{user.email}</span>
                </div>
                {user.name && (
                  <div className="flex items-center">
                    <User className="w-4 h-4 mr-3 text-white/60" />
                    <span className="text-white/80">{user.name}</span>
                  </div>
                )}
                {user.email_verified && (
                  <div className="flex items-center">
                    <Calendar className="w-4 h-4 mr-3 text-white/60" />
                    <span className="text-white/80">Email Verified</span>
                  </div>
                )}
              </div>
            </motion.div>

            {/* Account Actions Card */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20"
            >
              <h3 className="text-xl font-semibold mb-4 flex items-center">
                <Settings className="w-5 h-5 mr-2" />
                Account Actions
              </h3>
              <div className="space-y-3">
                <Link href="/chat">
                  <Button className="w-full bg-white/20 text-white border border-white/30 hover:bg-white/30">
                    Start AI Conversation
                  </Button>
                </Link>
                <Link href="/survey">
                  <Button variant="outline" className="w-full text-white border-white/30 hover:bg-white/10">
                    Take Survey
                  </Button>
                </Link>
                <LogoutButton />
              </div>
            </motion.div>
          </div>

          {/* Debug Info (only in development) */}
          {process.env.NODE_ENV === 'development' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
              className="bg-black/20 backdrop-blur-sm rounded-2xl p-6 border border-white/20"
            >
              <h3 className="text-xl font-semibold mb-4">Debug Information</h3>
              <pre className="text-sm text-white/60 overflow-auto">
                {JSON.stringify(user, null, 2)}
              </pre>
            </motion.div>
          )}
        </div>
      </div>
  );
}