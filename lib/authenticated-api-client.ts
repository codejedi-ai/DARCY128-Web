import { useUser } from '@auth0/nextjs-auth0';

// API client for making authenticated requests to your existing endpoints
export class AuthenticatedAPIClient {
  private baseURL: string;
  private token: string | null = null;

  constructor(baseURL: string = '/api') {
    this.baseURL = baseURL;
  }

  // Set the JWT token
  setToken(token: string) {
    this.token = token;
  }

  // Make authenticated request
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

  // Check if a user exists
  async checkUser(userId: string) {
    return this.request(`/check-user?userId=${userId}`, { method: 'GET' });
  }

  // Fetch users data
  async fetchUsers(userId: string) {
    return this.request(`/fetch-users?userId=${userId}`, { method: 'GET' });
  }
}

// Hook to use authenticated API client
export function useAuthenticatedAPIClient() {
  const { user } = useUser();
  
  const client = new AuthenticatedAPIClient();
  
  // For now, we'll use a placeholder token
  // In a real implementation, you'd get the actual JWT token from Auth0
  if (user?.accessToken) {
    client.setToken(user.accessToken);
  }

  return client;
}
