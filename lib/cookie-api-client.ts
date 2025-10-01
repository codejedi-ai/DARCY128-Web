// API client for cookie-based authentication
export class CookieAPIClient {
  private baseURL: string;

  constructor(baseURL: string = '/api') {
    this.baseURL = baseURL;
  }

  // Make request with cookies (automatic with fetch)
  async request(endpoint: string, options: RequestInit = {}) {
    const url = `${this.baseURL}${endpoint}`;
    
    const headers = {
      'Content-Type': 'application/json',
      ...options.headers,
    };

    const response = await fetch(url, {
      ...options,
      headers,
      credentials: 'include', // Important: include cookies
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

  // Test authentication status
  async testAuth() {
    try {
      return await this.get('/auth/me');
    } catch (error) {
      throw new Error('Authentication test failed');
    }
  }
}

// Create a singleton instance
export const cookieAPIClient = new CookieAPIClient();
