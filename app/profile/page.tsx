'use client';
import { useUser } from "@auth0/nextjs-auth0";
import { motion } from 'framer-motion';
import { User, Mail, Calendar, Settings, Key, Copy, Check, Shield, Send, Cookie, CheckCircle } from 'lucide-react';
import Link from 'next/link';
import { Button } from "@/components/ui/button";
import LogoutButton from '@/components/LogoutButton';
import { useState, useEffect } from 'react';
import { useProtectedAPI } from '@/hooks/useProtectedAPI';
import { useCookieAuth } from '@/hooks/useCookieAuth';
import { useJWTAuth } from '@/hooks/useJWTAuth';
import { useAuthenticatedAPI } from '@/hooks/useAuthenticatedAPI';
import AuthStatus from '@/components/AuthStatus';
import ScrollToTop from '@/components/ScrollToTop';

export default function ProfilePage() {
  const { user, isLoading } = useUser();
  const [copiedToken, setCopiedToken] = useState(false);
  const { data: apiData, loading: apiLoading, error: apiError, fetchProtectedData, sendData } = useProtectedAPI();
  const { 
    data: cookieData, 
    loading: cookieLoading, 
    error: cookieError, 
    testAuth, 
    testProtectedGET, 
    testProtectedPOST, 
    clearResults 
  } = useCookieAuth();
  const { 
    data: jwtData, 
    loading: jwtLoading, 
    error: jwtError, 
    testUserData, 
    testAdminEndpoint, 
    sendDataToProtected, 
    clearResults: clearJWTResults 
  } = useJWTAuth();
  const { 
    data: authData, 
    loading: authLoading, 
    error: authError, 
    checkUser, 
    fetchUsers, 
    clearResults: clearAuthResults 
  } = useAuthenticatedAPI();

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

          {/* Authentication Status */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="mb-8"
          >
            <AuthStatus />
          </motion.div>

          {/* Protected Route Status */}
          <ProtectedRouteStatus />

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

          {/* JWT Token Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20 mb-8"
          >
            <h3 className="text-xl font-semibold mb-4 flex items-center">
              <Key className="w-5 h-5 mr-2" />
              JWT Token Information
            </h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-white mb-2">Access Token</label>
                <div className="relative">
                  <textarea
                    value={user?.accessToken || 'No token available'}
                    readOnly
                    className="w-full p-3 bg-black/20 border border-white/20 rounded text-white text-xs font-mono resize-none h-24 overflow-auto focus:outline-none focus:ring-2 focus:ring-white/20"
                    placeholder="JWT Token will appear here..."
                  />
                  <Button
                    onClick={() => {
                      if (user?.accessToken) {
                        navigator.clipboard.writeText(user.accessToken);
                        setCopiedToken(true);
                        setTimeout(() => setCopiedToken(false), 2000);
                      }
                    }}
                    variant="outline"
                    size="sm"
                    className="absolute top-2 right-2 text-white border-white/30 hover:bg-white/10"
                  >
                    {copiedToken ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                  </Button>
                </div>
              </div>
              
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-white mb-2">Token Type</label>
                  <div className="p-2 bg-black/20 border border-white/20 rounded text-white/80 text-sm">
                    {user?.tokenType || 'Bearer'}
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-white mb-2">Expires At</label>
                  <div className="p-2 bg-black/20 border border-white/20 rounded text-white/80 text-sm">
                    {user?.expiresAt ? new Date(user.expiresAt).toLocaleString() : 'Unknown'}
                  </div>
                </div>
              </div>

              <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-4">
                <p className="text-yellow-200 text-sm">
                  <strong>Note:</strong> This token is sensitive information. Keep it secure and don't share it with unauthorized parties.
                </p>
              </div>
            </div>
          </motion.div>

          {/* Cookie Authentication Testing Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.7 }}
            className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20 mb-8"
          >
            <h3 className="text-xl font-semibold mb-4 flex items-center">
              <Cookie className="w-5 h-5 mr-2" />
              Cookie Authentication Testing
            </h3>
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Button
                  onClick={testAuth}
                  disabled={cookieLoading}
                  className="bg-purple-600 hover:bg-purple-700 text-white"
                >
                  {cookieLoading ? 'Loading...' : 'Test Auth Status'}
                </Button>
                <Button
                  onClick={testProtectedGET}
                  disabled={cookieLoading}
                  className="bg-blue-600 hover:bg-blue-700 text-white"
                >
                  {cookieLoading ? 'Loading...' : 'Test Protected GET'}
                </Button>
                <Button
                  onClick={testProtectedPOST}
                  disabled={cookieLoading}
                  className="bg-green-600 hover:bg-green-700 text-white"
                >
                  <Send className="w-4 h-4 mr-2" />
                  {cookieLoading ? 'Loading...' : 'Test Protected POST'}
                </Button>
              </div>

              <div className="flex justify-between items-center">
                <div className="text-sm text-white/60">
                  Test your cookie-based authentication with the backend
                </div>
                <Button
                  onClick={clearResults}
                  variant="outline"
                  size="sm"
                  className="text-white border-white/30 hover:bg-white/10"
                >
                  Clear Results
                </Button>
              </div>

              {cookieError && (
                <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-4">
                  <p className="text-red-200 text-sm">
                    <strong>Error:</strong> {cookieError}
                  </p>
                </div>
              )}

              {cookieData && (
                <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-4">
                  <h4 className="text-green-200 font-medium mb-2">Cookie Auth Response:</h4>
                  <pre className="text-green-200 text-xs overflow-auto max-h-64">
                    {JSON.stringify(cookieData, null, 2)}
                  </pre>
                </div>
              )}

              <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4">
                <p className="text-blue-200 text-sm">
                  <strong>How Cookie Auth Works:</strong> Your browser automatically sends the <code>auth0_session</code> cookie 
                  with each request. The backend verifies this cookie to authenticate you. No manual token handling needed!
                </p>
              </div>
            </div>
          </motion.div>

          {/* JWT Authentication Testing Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.8 }}
            className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20 mb-8"
          >
            <h3 className="text-xl font-semibold mb-4 flex items-center">
              <Key className="w-5 h-5 mr-2" />
              JWT Authentication Testing
            </h3>
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Button
                  onClick={testUserData}
                  disabled={jwtLoading}
                  className="bg-purple-600 hover:bg-purple-700 text-white"
                >
                  {jwtLoading ? 'Loading...' : 'Test User Data'}
                </Button>
                <Button
                  onClick={testAdminEndpoint}
                  disabled={jwtLoading}
                  className="bg-red-600 hover:bg-red-700 text-white"
                >
                  {jwtLoading ? 'Loading...' : 'Test Admin Access'}
                </Button>
                <Button
                  onClick={() => sendDataToProtected({ 
                    message: 'Hello from JWT auth!', 
                    timestamp: new Date().toISOString(),
                    userId: user?.sub 
                  })}
                  disabled={jwtLoading}
                  className="bg-green-600 hover:bg-green-700 text-white"
                >
                  <Send className="w-4 h-4 mr-2" />
                  {jwtLoading ? 'Loading...' : 'Send Data'}
                </Button>
              </div>

              <div className="flex justify-between items-center">
                <div className="text-sm text-white/60">
                  Test JWT-based authentication with Auth0 verification
                </div>
                <Button
                  onClick={clearJWTResults}
                  variant="outline"
                  size="sm"
                  className="text-white border-white/30 hover:bg-white/10"
                >
                  Clear Results
                </Button>
              </div>

              {jwtError && (
                <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-4">
                  <p className="text-red-200 text-sm">
                    <strong>Error:</strong> {jwtError}
                  </p>
                </div>
              )}

              {jwtData && (
                <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-4">
                  <h4 className="text-green-200 font-medium mb-2">JWT Auth Response:</h4>
                  <pre className="text-green-200 text-xs overflow-auto max-h-64">
                    {JSON.stringify(jwtData, null, 2)}
                  </pre>
                </div>
              )}

              <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4">
                <p className="text-blue-200 text-sm">
                  <strong>JWT Authentication:</strong> These endpoints require a valid Auth0 JWT token in the Authorization header. 
                  The backend verifies the token signature and extracts user information for secure access control.
                </p>
              </div>
            </div>
          </motion.div>

          {/* Authenticated API Testing Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.9 }}
            className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20 mb-8"
          >
            <h3 className="text-xl font-semibold mb-4 flex items-center">
              <Shield className="w-5 h-5 mr-2" />
              Authenticated API Testing
            </h3>
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Button
                  onClick={() => checkUser('test-user-123')}
                  disabled={authLoading}
                  className="bg-blue-600 hover:bg-blue-700 text-white"
                >
                  {authLoading ? 'Loading...' : 'Check User'}
                </Button>
                <Button
                  onClick={() => fetchUsers('test-user-123')}
                  disabled={authLoading}
                  className="bg-green-600 hover:bg-green-700 text-white"
                >
                  {authLoading ? 'Loading...' : 'Fetch Users'}
                </Button>
              </div>

              <div className="flex justify-between items-center">
                <div className="text-sm text-white/60">
                  Test your existing API endpoints with JWT authentication
                </div>
                <Button
                  onClick={clearAuthResults}
                  variant="outline"
                  size="sm"
                  className="text-white border-white/30 hover:bg-white/10"
                >
                  Clear Results
                </Button>
              </div>

              {authError && (
                <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-4">
                  <p className="text-red-200 text-sm">
                    <strong>Error:</strong> {authError}
                  </p>
                </div>
              )}

              {authData && (
                <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-4">
                  <h4 className="text-green-200 font-medium mb-2">Authenticated API Response:</h4>
                  <pre className="text-green-200 text-xs overflow-auto max-h-64">
                    {JSON.stringify(authData, null, 2)}
                  </pre>
                </div>
              )}

              <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4">
                <p className="text-blue-200 text-sm">
                  <strong>Your API Endpoints:</strong> These are your existing <code>/api/check-user</code> and 
                  <code>/api/fetch-users</code> endpoints, now protected with JWT authentication. 
                  The backend verifies the Auth0 token before processing requests.
                </p>
              </div>
            </div>
          </motion.div>

          {/* API Testing Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.8 }}
            className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20 mb-8"
          >
            <h3 className="text-xl font-semibold mb-4 flex items-center">
              <Shield className="w-5 h-5 mr-2" />
              Test Protected API
            </h3>
            <div className="space-y-4">
              <div className="flex space-x-4">
                <Button
                  onClick={fetchProtectedData}
                  disabled={apiLoading}
                  className="bg-blue-600 hover:bg-blue-700 text-white"
                >
                  {apiLoading ? 'Loading...' : 'Test GET Request'}
                </Button>
                <Button
                  onClick={() => sendData({ message: 'Hello from frontend!', timestamp: new Date().toISOString() })}
                  disabled={apiLoading}
                  className="bg-green-600 hover:bg-green-700 text-white"
                >
                  <Send className="w-4 h-4 mr-2" />
                  Test POST Request
                </Button>
              </div>

              {apiError && (
                <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-4">
                  <p className="text-red-200 text-sm">
                    <strong>Error:</strong> {apiError}
                  </p>
                </div>
              )}

              {apiData && (
                <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-4">
                  <h4 className="text-green-200 font-medium mb-2">API Response:</h4>
                  <pre className="text-green-200 text-xs overflow-auto">
                    {JSON.stringify(apiData, null, 2)}
                  </pre>
                </div>
              )}

              <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4">
                <p className="text-blue-200 text-sm">
                  <strong>How it works:</strong> These buttons test your JWT token by making authenticated requests to protected API endpoints. 
                  The token from your Auth0 session is automatically included in the Authorization header.
                </p>
              </div>
            </div>
          </motion.div>

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
      <ScrollToTop />
    </div>
  );
}

// Protected Route Status Component
function ProtectedRouteStatus() {
  const [status, setStatus] = useState<{
    protected: boolean;
    apiProtected: boolean;
    loading: boolean;
  }>({
    protected: false,
    apiProtected: false,
    loading: true
  });

  useEffect(() => {
    const checkProtectedRoutes = async () => {
      try {
        // Test protected API route
        const response = await fetch('/api/protected');
        const apiProtected = response.ok;
        
        setStatus({
          protected: true, // If we're on this page, the route is protected
          apiProtected,
          loading: false
        });
      } catch (error) {
        setStatus({
          protected: true,
          apiProtected: false,
          loading: false
        });
      }
    };

    checkProtectedRoutes();
  }, []);

  if (status.loading) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="bg-green-500/10 backdrop-blur-sm rounded-2xl p-6 border border-green-500/20 mb-8"
      >
        <div className="flex items-center justify-center">
          <div className="w-6 h-6 border-2 border-green-500 border-t-transparent rounded-full animate-spin mr-3"></div>
          <span className="text-green-400">Checking protected routes...</span>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.2 }}
      className="bg-green-500/10 backdrop-blur-sm rounded-2xl p-6 border border-green-500/20 mb-8"
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <Shield className="w-6 h-6 text-green-400" />
          <div>
            <h3 className="text-lg font-semibold text-green-400">Protected Routes Status</h3>
            <p className="text-sm text-green-300/80">Authentication verification complete</p>
          </div>
        </div>
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <CheckCircle className="w-5 h-5 text-green-400" />
            <span className="text-sm text-green-300">Route Protected</span>
          </div>
          <div className="flex items-center space-x-2">
            {status.apiProtected ? (
              <>
                <CheckCircle className="w-5 h-5 text-green-400" />
                <span className="text-sm text-green-300">API Secured</span>
              </>
            ) : (
              <>
                <div className="w-5 h-5 border-2 border-red-400 rounded-full"></div>
                <span className="text-sm text-red-300">API Error</span>
              </>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
}