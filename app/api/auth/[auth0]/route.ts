import { NextRequest, NextResponse } from 'next/server';
import { auth0 } from '@/lib/auth0';

export async function GET(request: NextRequest, { params }: { params: { auth0: string } }) {
  const { auth0: route } = params;
  
  try {
    switch (route) {
      case 'login':
        // Start interactive login with returnTo parameter
        return await auth0.startInteractiveLogin({
          returnTo: '/chat' // Redirect to chat after login
        });
      
      case 'logout':
        // Handle logout with returnTo parameter
        const logoutUrl = new URL(`${process.env.AUTH0_ISSUER_BASE_URL}/v2/logout`);
        logoutUrl.searchParams.set('client_id', process.env.AUTH0_CLIENT_ID!);
        logoutUrl.searchParams.set('returnTo', `${process.env.AUTH0_BASE_URL}/`); // Redirect to home after logout
        return NextResponse.redirect(logoutUrl.toString());
      
      case 'callback':
        // Handle Auth0 callback
        const url = new URL(request.url);
        const code = url.searchParams.get('code');
        if (!code) {
          return NextResponse.json({ error: 'No authorization code' }, { status: 400 });
        }
        
        // Exchange code for tokens
        const tokenResponse = await fetch(`${process.env.AUTH0_ISSUER_BASE_URL}/oauth/token`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          },
          body: new URLSearchParams({
            grant_type: 'authorization_code',
            client_id: process.env.AUTH0_CLIENT_ID!,
            client_secret: process.env.AUTH0_CLIENT_SECRET!,
            code,
            redirect_uri: `${process.env.AUTH0_BASE_URL}/api/auth/callback`,
          }),
        });
        
        const tokens = await tokenResponse.json();
        
        if (tokens.error) {
          return NextResponse.json({ error: tokens.error_description }, { status: 400 });
        }
        
        // Get user info
        const userResponse = await fetch(`${process.env.AUTH0_ISSUER_BASE_URL}/userinfo`, {
          headers: {
            Authorization: `Bearer ${tokens.access_token}`,
          },
        });
        
        const user = await userResponse.json();
        
        // Create response with redirect to chat
        const response = NextResponse.redirect(`${process.env.AUTH0_BASE_URL}/chat`);
        
        // Set session cookie (simplified - in production, use secure session management)
        response.cookies.set('auth0_session', JSON.stringify({ user, tokens }), {
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production',
          sameSite: 'lax',
          maxAge: 60 * 60 * 24 * 7, // 7 days
        });
        
        return response;
      
      case 'me':
        // Get current user from session
        const sessionCookie = request.cookies.get('auth0_session');
        if (!sessionCookie) {
          return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
        }
        
        const session = JSON.parse(sessionCookie.value);
        return NextResponse.json(session.user);
      
      default:
        return NextResponse.json({ error: 'Not found' }, { status: 404 });
    }
  } catch (error) {
    console.error('Auth0 error:', error);
    return NextResponse.json({ error: 'Authentication error' }, { status: 500 });
  }
}