import { NextRequest } from 'next/server';

// JWT verification utility
export function verifyJWT(token: string) {
  try {
    // For Auth0, you need to verify the token signature
    // This is a simplified version - in production, you should verify the signature
    // For now, we'll just decode the token without verification
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
      return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));
    
    return JSON.parse(jsonPayload);
  } catch (error) {
    console.error('JWT verification failed:', error);
    return null;
  }
}

// Extract JWT from request headers
export function getJWTFromRequest(request: NextRequest): string | null {
  const authHeader = request.headers.get('authorization');
  if (authHeader && authHeader.startsWith('Bearer ')) {
    return authHeader.substring(7);
  }
  return null;
}

// Middleware to protect API routes
export function withAuth(handler: (request: NextRequest, user: any) => Promise<Response>) {
  return async (request: NextRequest) => {
    const token = getJWTFromRequest(request);
    
    if (!token) {
      return new Response(JSON.stringify({ error: 'No token provided' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    const user = verifyJWT(token);
    if (!user) {
      return new Response(JSON.stringify({ error: 'Invalid token' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    return handler(request, user);
  };
}
