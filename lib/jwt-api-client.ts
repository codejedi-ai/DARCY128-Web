import { useUser } from '@auth0/nextjs-auth0';

// JWT-based API client for Auth0 authentication
export class JWTApiClient {
  private baseURL: string;
  private token: string | null = null;

  constructor(baseURL: string = '/api') {
    this.baseURL = baseURL;
  }

  // Set the JWT token
  setToken(token: string) {
    this.token = token;
  }

  // Make authenticated request with JWT token
  async request(endpoint: string, options: RequestInit = {}) {
    const url = `${this.baseURL}${endpoint}`;
    
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...(options.headers as Record<string, string>),
    };

    // Add Authorization header with Bearer token
    if (this.token) {
      headers['Authorization'] = `Bearer ${this.token}`;
    } else {
      throw new Error('No JWT token available. Please log in.');
    }

    const response = await fetch(url, {
      ...options,
      headers,
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || `API request failed: ${response.status}`);
    }

    return response.json();
  }

  // GET request
  async get(endpoint: string) {
    return this.request(endpoint, { method: 'GET' });
  }

  // POST request
  async post(endpoint: string, data: any) {
    return this.request(endpoint, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  // PUT request
  async put(endpoint: string, data: any) {
    return this.request(endpoint, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  // DELETE request
  async delete(endpoint: string) {
    return this.request(endpoint, { method: 'DELETE' });
  }
}

// Hook to use JWT API client with Auth0 token
export function useJWTApiClient() {
  const { user } = useUser();
  
  const client = new JWTApiClient();
  
  // Set token from user object (you'll need to get the actual JWT token)
  // This is a placeholder - you'll need to implement getting the actual JWT token
  if (user?.accessToken) {
    client.setToken(user.accessToken);
  }

  return client;
}

// Alternative: Get JWT token from Auth0
export async function getAuth0Token(): Promise<string | null> {
  try {
    const response = await fetch('/api/auth/me');
    if (response.ok) {
      const user = await response.json();
      // You'll need to implement getting the actual JWT token here
      // This might require calling Auth0's token endpoint
      return user.accessToken || null;
    }
    return null;
  } catch (error) {
    console.error('Failed to get Auth0 token:', error);
    return null;
  }
}
