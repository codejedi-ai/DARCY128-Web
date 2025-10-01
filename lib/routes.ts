// Authentication routes configuration
export const AUTH_ROUTES = {
  LOGIN: '/auth/login',
  LOGOUT: '/auth/logout',
  CALLBACK: '/auth/callback',
  PROFILE: '/auth/me'
} as const;

// App routes
export const APP_ROUTES = {
  HOME: '/',
  PROFILE: '/profile',
  CHAT: '/chat',
  SURVEY: '/survey'
} as const;

// Export all routes
export const ROUTES = {
  ...AUTH_ROUTES,
  ...APP_ROUTES
} as const;
