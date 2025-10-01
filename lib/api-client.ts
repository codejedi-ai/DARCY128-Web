import { useUser } from '@auth0/nextjs-auth0';

// API client for making authenticated requests
export class APIClient {
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

    // Add Authorization header if token is available
    if (this.token) {
      headers['Authorization'] = `Bearer ${this.token}`;
    }

    const response = await fetch(url, {
      ...options,
      headers,
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'API request failed');
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

// Hook to use API client with Auth0 token
export function useAPIClient() {
  const { user } = useUser();
  
  const client = new APIClient();
  
  // Set token from user object
  if (user?.accessToken) {
    client.setToken(user.accessToken);
  }

  return client;
}
