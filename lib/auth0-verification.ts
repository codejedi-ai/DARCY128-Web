import { NextRequest } from 'next/server';
import jwt from 'jsonwebtoken';
import jwksClient from 'jwks-rsa';

// Auth0 configuration
const AUTH0_DOMAIN = process.env.AUTH0_ISSUER_BASE_URL?.replace('https://', '') || '';
const AUTH0_AUDIENCE = process.env.AUTH0_AUDIENCE || '';

// JWKS client for fetching Auth0's public keys
const client = jwksClient({
  jwksUri: `https://${AUTH0_DOMAIN}/.well-known/jwks.json`,
  cache: true,
  cacheMaxAge: 86400000, // 24 hours
});

// Get signing key from Auth0
function getKey(header: any, callback: any) {
  client.getSigningKey(header.kid, (err, key) => {
    if (err) {
      callback(err);
      return;
    }
    const signingKey = key?.getPublicKey();
    callback(null, signingKey);
  });
}

// Verify Auth0 JWT token
export async function verifyAuth0Token(token: string): Promise<any> {
  return new Promise((resolve, reject) => {
    jwt.verify(
      token,
      getKey,
      {
        audience: AUTH0_AUDIENCE,
        issuer: `https://${AUTH0_DOMAIN}/`,
        algorithms: ['RS256']
      },
      (err, decoded) => {
        if (err) {
          reject(err);
          return;
        }
        resolve(decoded);
      }
    );
  });
}

// Extract Bearer token from request headers
export function extractBearerToken(request: NextRequest): string | null {
  const authHeader = request.headers.get('authorization');
  if (authHeader && authHeader.startsWith('Bearer ')) {
    return authHeader.substring(7);
  }
  return null;
}

// Middleware to protect API routes with Auth0 JWT verification
export function withAuth0Auth(handler: (request: NextRequest, user: any) => Promise<Response>) {
  return async (request: NextRequest) => {
    try {
      // Extract token from Authorization header
      const token = extractBearerToken(request);
      
      if (!token) {
        return new Response(JSON.stringify({ 
          error: 'No token provided',
          message: 'Authorization header with Bearer token is required'
        }), {
          status: 401,
          headers: { 'Content-Type': 'application/json' }
        });
      }

      // Verify the token with Auth0
      const user = await verifyAuth0Token(token);
      
      // Call the protected handler with verified user
      return handler(request, user);
      
    } catch (error) {
      console.error('Auth0 verification error:', error);
      
      let errorMessage = 'Invalid token';
      if (error instanceof jwt.TokenExpiredError) {
        errorMessage = 'Token has expired';
      } else if (error instanceof jwt.JsonWebTokenError) {
        errorMessage = 'Invalid token format';
      }
      
      return new Response(JSON.stringify({ 
        error: errorMessage,
        message: 'Authentication failed'
      }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' }
      });
    }
  };
}

// Alternative: Cookie-based Auth0 verification (for your existing setup)
export function withAuth0CookieAuth(handler: (request: NextRequest, user: any) => Promise<Response>) {
  return async (request: NextRequest) => {
    try {
      // Get session from cookie
      const sessionCookie = request.cookies.get('auth0_session');
      
      if (!sessionCookie) {
        return new Response(JSON.stringify({ 
          error: 'Not authenticated',
          message: 'Please log in to access this resource'
        }), {
          status: 401,
          headers: { 'Content-Type': 'application/json' }
        });
      }

      const session = JSON.parse(sessionCookie.value);
      
      if (!session.user) {
        return new Response(JSON.stringify({ 
          error: 'Invalid session',
          message: 'Session does not contain user data'
        }), {
          status: 401,
          headers: { 'Content-Type': 'application/json' }
        });
      }

      // Call the protected handler with user from session
      return handler(request, session.user);
      
    } catch (error) {
      console.error('Cookie auth verification error:', error);
      
      return new Response(JSON.stringify({ 
        error: 'Authentication failed',
        message: 'Invalid session data'
      }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' }
      });
    }
  };
}
