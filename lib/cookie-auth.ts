import { NextRequest } from 'next/server';

// Cookie-based authentication utilities
export interface AuthSession {
  user: any;
  tokens: any;
}

// Extract and verify session from cookie
export function getSessionFromCookie(request: NextRequest): AuthSession | null {
  try {
    const sessionCookie = request.cookies.get('auth0_session');
    
    if (!sessionCookie) {
      return null;
    }

    const session = JSON.parse(sessionCookie.value) as AuthSession;
    
    // Basic validation
    if (!session.user || !session.tokens) {
      return null;
    }

    return session;
  } catch (error) {
    console.error('Error parsing session cookie:', error);
    return null;
  }
}

// Middleware to protect API routes with cookie authentication
export function withCookieAuth(handler: (request: NextRequest, session: AuthSession) => Promise<Response>) {
  return async (request: NextRequest) => {
    const session = getSessionFromCookie(request);
    
    if (!session) {
      return new Response(JSON.stringify({ 
        error: 'Not authenticated',
        message: 'Please log in to access this resource'
      }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    return handler(request, session);
  };
}

// Check if user is authenticated (for middleware)
export function isAuthenticated(request: NextRequest): boolean {
  return getSessionFromCookie(request) !== null;
}

// Get user info from session
export function getUserFromSession(request: NextRequest) {
  const session = getSessionFromCookie(request);
  return session?.user || null;
}
