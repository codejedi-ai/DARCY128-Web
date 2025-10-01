'use client';
import { useUser } from '@auth0/nextjs-auth0';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  CheckCircle, 
  XCircle, 
  Clock, 
  User, 
  Mail, 
  Calendar,
  RefreshCw,
  AlertTriangle
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cookieAPIClient } from '@/lib/cookie-api-client';

interface AuthStatusData {
  frontendAuth: boolean;
  backendAuth: boolean;
  userInfo: any;
  sessionInfo: any;
  lastChecked: string;
  errors: string[];
}

export default function AuthStatus() {
  const { user, isLoading, error } = useUser();
  const [statusData, setStatusData] = useState<AuthStatusData | null>(null);
  const [checking, setChecking] = useState(false);

  const checkAuthStatus = async () => {
    setChecking(true);
    const errors: string[] = [];
    let backendAuth = false;
    let sessionInfo = null;

    try {
      // Test backend authentication
      const backendResponse = await cookieAPIClient.testAuth();
      backendAuth = true;
      sessionInfo = backendResponse;
    } catch (err) {
      backendAuth = false;
      errors.push(`Backend auth failed: ${err instanceof Error ? err.message : 'Unknown error'}`);
    }

    setStatusData({
      frontendAuth: !!user,
      backendAuth,
      userInfo: user,
      sessionInfo,
      lastChecked: new Date().toLocaleString(),
      errors
    });
    setChecking(false);
  };

  useEffect(() => {
    if (!isLoading) {
      checkAuthStatus();
    }
  }, [user, isLoading]);

  if (isLoading) {
    return (
      <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
        <div className="flex items-center space-x-3">
          <RefreshCw className="w-5 h-5 animate-spin text-blue-400" />
          <span className="text-white">Checking authentication status...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-semibold text-white flex items-center">
          <User className="w-5 h-5 mr-2" />
          Authentication Status
        </h3>
        <Button
          onClick={checkAuthStatus}
          disabled={checking}
          variant="outline"
          size="sm"
          className="text-white border-white/30 hover:bg-white/10"
        >
          <RefreshCw className={`w-4 h-4 mr-2 ${checking ? 'animate-spin' : ''}`} />
          {checking ? 'Checking...' : 'Refresh'}
        </Button>
      </div>

      <div className="space-y-4">
        {/* Frontend Auth Status */}
        <div className="flex items-center justify-between p-4 bg-black/20 rounded-lg border border-white/10">
          <div className="flex items-center space-x-3">
            {user ? (
              <CheckCircle className="w-6 h-6 text-green-400" />
            ) : (
              <XCircle className="w-6 h-6 text-red-400" />
            )}
            <div>
              <p className="text-white font-medium">Frontend Authentication</p>
              <p className="text-white/60 text-sm">
                {user ? 'Logged in via Auth0' : 'Not logged in'}
              </p>
            </div>
          </div>
          <div className="text-right">
            <p className={`text-sm font-medium ${user ? 'text-green-400' : 'text-red-400'}`}>
              {user ? 'AUTHENTICATED' : 'NOT AUTHENTICATED'}
            </p>
          </div>
        </div>

        {/* Backend Auth Status */}
        <div className="flex items-center justify-between p-4 bg-black/20 rounded-lg border border-white/10">
          <div className="flex items-center space-x-3">
            {statusData?.backendAuth ? (
              <CheckCircle className="w-6 h-6 text-green-400" />
            ) : (
              <XCircle className="w-6 h-6 text-red-400" />
            )}
            <div>
              <p className="text-white font-medium">Backend Authentication</p>
              <p className="text-white/60 text-sm">
                {statusData?.backendAuth ? 'Cookie validated by backend' : 'Cookie validation failed'}
              </p>
            </div>
          </div>
          <div className="text-right">
            <p className={`text-sm font-medium ${statusData?.backendAuth ? 'text-green-400' : 'text-red-400'}`}>
              {statusData?.backendAuth ? 'VALIDATED' : 'INVALID'}
            </p>
          </div>
        </div>

        {/* User Information */}
        {user && (
          <div className="p-4 bg-black/20 rounded-lg border border-white/10">
            <h4 className="text-white font-medium mb-3 flex items-center">
              <User className="w-4 h-4 mr-2" />
              User Information
            </h4>
            <div className="space-y-2">
              <div className="flex items-center space-x-3">
                <Mail className="w-4 h-4 text-white/60" />
                <span className="text-white/80">{user.email}</span>
              </div>
              {user.name && (
                <div className="flex items-center space-x-3">
                  <User className="w-4 h-4 text-white/60" />
                  <span className="text-white/80">{user.name}</span>
                </div>
              )}
              <div className="flex items-center space-x-3">
                <Calendar className="w-4 h-4 text-white/60" />
                <span className="text-white/80">
                  Last checked: {statusData?.lastChecked || 'Never'}
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Session Information */}
        {statusData?.sessionInfo && (
          <div className="p-4 bg-black/20 rounded-lg border border-white/10">
            <h4 className="text-white font-medium mb-3 flex items-center">
              <Clock className="w-4 h-4 mr-2" />
              Session Information
            </h4>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-white/60">User ID:</span>
                <span className="text-white/80 font-mono text-xs">{statusData.sessionInfo.sub}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-white/60">Email Verified:</span>
                <span className={`${statusData.sessionInfo.email_verified ? 'text-green-400' : 'text-red-400'}`}>
                  {statusData.sessionInfo.email_verified ? 'Yes' : 'No'}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-white/60">Auth0 ID:</span>
                <span className="text-white/80 font-mono text-xs">{statusData.sessionInfo.sub}</span>
              </div>
            </div>
          </div>
        )}

        {/* Errors */}
        {statusData?.errors && statusData.errors.length > 0 && (
          <div className="p-4 bg-red-500/10 border border-red-500/30 rounded-lg">
            <h4 className="text-red-200 font-medium mb-2 flex items-center">
              <AlertTriangle className="w-4 h-4 mr-2" />
              Authentication Errors
            </h4>
            <ul className="space-y-1">
              {statusData.errors.map((error, index) => (
                <li key={index} className="text-red-200 text-sm">• {error}</li>
              ))}
            </ul>
          </div>
        )}

        {/* Auth0 Error */}
        {error && (
          <div className="p-4 bg-red-500/10 border border-red-500/30 rounded-lg">
            <h4 className="text-red-200 font-medium mb-2 flex items-center">
              <AlertTriangle className="w-4 h-4 mr-2" />
              Auth0 Error
            </h4>
            <p className="text-red-200 text-sm">{error.message}</p>
          </div>
        )}

        {/* Overall Status */}
        <div className={`p-4 rounded-lg border ${
          user && statusData?.backendAuth 
            ? 'bg-green-500/10 border-green-500/30' 
            : 'bg-yellow-500/10 border-yellow-500/30'
        }`}>
          <div className="flex items-center space-x-3">
            {user && statusData?.backendAuth ? (
              <CheckCircle className="w-6 h-6 text-green-400" />
            ) : (
              <AlertTriangle className="w-6 h-6 text-yellow-400" />
            )}
            <div>
              <p className={`font-medium ${user && statusData?.backendAuth ? 'text-green-200' : 'text-yellow-200'}`}>
                {user && statusData?.backendAuth 
                  ? 'Fully Authenticated' 
                  : 'Authentication Issues Detected'
                }
              </p>
              <p className={`text-sm ${user && statusData?.backendAuth ? 'text-green-300' : 'text-yellow-300'}`}>
                {user && statusData?.backendAuth 
                  ? 'Both frontend and backend authentication are working correctly.' 
                  : 'Check the details above to identify authentication issues.'
                }
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
