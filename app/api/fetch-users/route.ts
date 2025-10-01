import { NextRequest } from 'next/server';
import { withAuth0Auth } from '@/lib/auth0-verification';

export const GET = withAuth0Auth(async (request: NextRequest, user) => {
  const { searchParams } = new URL(request.url);
  const userId = searchParams.get('userId');
  
  console.log("Authenticated user:", user.email, "requesting data for userId:", userId);
  
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
    // Fetch embeddings data
    const embeddingsResponse = await fetch(`https://7503-199-7-156-226.ngrok-free.app/query?userId=${userId}`);
    const embeddingsData = await embeddingsResponse.json();
    console.log('Embeddings data received:', embeddingsData);
    
    const transformedData = await Promise.all(
      embeddingsData.labels.map(async (label: string, index: number) => {
        try {
          const userResponse = await fetch(`https://7503-199-7-156-226.ngrok-free.app/find_document?userId=${label}`);
          const userDetails = await userResponse.json();
          const userData = userDetails.results[label];
    
          if (!userData) {
            console.error(`No user data found for label: ${label}`);
            return {
              x: embeddingsData.embeddings_2d[index][0],
              y: embeddingsData.embeddings_2d[index][1],
              name: 'Unknown User',
              email: '',
              instagram: '',
              discord: '',
            };
          }
    
          return {
            x: embeddingsData.embeddings_2d[index][0],
            y: embeddingsData.embeddings_2d[index][1],
            name: userData.name || 'Unknown',
            email: userData.email || '',
            instagram: userData.social1 || '',
            discord: userData.social2 || '',
          };
        } catch (error) {
          console.error(`Error fetching user data for ${label}:`, error);
          return {
            x: embeddingsData.embeddings_2d[index][0],
            y: embeddingsData.embeddings_2d[index][1],
            name: 'Error Loading User',
            email: '',
            instagram: '',
            discord: '',
          };
        }
      })
    );

    return new Response(JSON.stringify({
      message: 'Users fetched successfully',
      authenticatedUser: {
        id: user.sub,
        email: user.email,
        name: user.name
      },
      requestedUserId: userId,
      userCount: transformedData.length,
      users: transformedData,
      timestamp: new Date().toISOString()
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error('Error fetching data:', error);
    return new Response(JSON.stringify({
      error: 'Failed to fetch data',
      message: 'External service error',
      authenticatedUser: {
        id: user.sub,
        email: user.email,
        name: user.name
      }
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
});
