import { NextRequest } from 'next/server';
import { withAuth0Auth } from '@/lib/auth0-verification';

export const GET = withAuth0Auth(async (request: NextRequest, user) => {
  const { searchParams } = new URL(request.url);
  const userId = searchParams.get('userId');

  if (!userId) {
    return new Response(JSON.stringify({ 
      error: 'User ID is required',
      message: 'Please provide a userId parameter'
    }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' }
    });
  }

  try {
    const response = await fetch(`https://7503-199-7-156-226.ngrok-free.app/find_document?userId=${userId}`);
    const data = await response.json();
    
    return new Response(JSON.stringify({
      message: 'User check completed successfully',
      authenticatedUser: {
        id: user.sub,
        email: user.email,
        name: user.name
      },
      requestedUser: {
        exists: Object.keys(data).length > 0,
        data
      },
      timestamp: new Date().toISOString()
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    console.error('Error checking user:', error);
    return new Response(JSON.stringify({ 
      error: 'Failed to check user',
      message: 'External service error'
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
});
