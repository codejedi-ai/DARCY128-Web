# Auth0 Configuration - DO NOT MODIFY

## ⚠️ CRITICAL WARNING
**DO NOT TOUCH THE AUTH0 CONFIGURATION ANYMORE**

This document serves as a comprehensive guide to the Auth0 setup. Any modifications to the Auth0 configuration may break the authentication system and require extensive debugging.

## Current Auth0 Configuration

### Environment Variables (`.env.local`)
```bash
AUTH0_SECRET=9057877462b877c419c1c15a4c7d0544f9a6df8359c8a2634e5802670778a77e
AUTH0_BASE_URL=http://localhost:3000
AUTH0_ISSUER_BASE_URL=https://d273liu.ca.auth0.com
AUTH0_CLIENT_ID=G3cUNE1TJgDRlxR5bVbZAOeTss2sAjTT
AUTH0_CLIENT_SECRET=mMFu61vM38UmXkx8_EENNxeY8f6WVC316i_1MdE50_1G7LnzQvp3rRApTU5e5mbY

# Optional if calling your API with access tokens
AUTH0_AUDIENCE=your_auth_api_identifier
AUTH0_SCOPE=openid profile email read:shows
```

### Auth0 Dashboard Settings
- **Domain**: `d273liu.ca.auth0.com`
- **Client ID**: `G3cUNE1TJgDRlxR5bVbZAOeTss2sAjTT`
- **Client Secret**: `mMFu61vM38UmXkx8_EENNxeY8f6WVC316i_1MdE50_1G7LnzQvp3rRApTU5e5mbY`

### Allowed URLs in Auth0 Dashboard
- **Allowed Callback URLs**: `http://localhost:3000/api/auth/callback`
- **Allowed Logout URLs**: `http://localhost:3000/`
- **Allowed Web Origins**: `http://localhost:3000`

## File Structure

### Auth0 Route Handler
**File**: `app/api/auth/[auth0]/route.ts`
- Handles all Auth0 authentication flows
- **DO NOT MODIFY** - Contains custom Auth0 implementation
- Manages login, logout, callback, and user info endpoints

### Middleware
**File**: `middleware.ts`
- Protects routes that require authentication
- **DO NOT MODIFY** - Current configuration works correctly

### Components Using Auth0
- `components/Sidebar.tsx` - Uses `useUser()` hook
- `components/sidebar/SidebarProfile.tsx` - Displays user info
- `components/LogoutButton.tsx` - Handles logout functionality
- `app/profile/page.tsx` - Shows user profile data
- `app/page.tsx` - Redirects logged-in users to profile

## Authentication Flow

### Login Process
1. User clicks "Login" button in navbar
2. Redirects to `/api/auth/login`
3. Auth0 handles authentication
4. User returns to `/api/auth/callback`
5. Session is created and user is redirected to `/chat`

### Logout Process
1. User clicks "Logout" button in sidebar
2. Redirects to `/api/auth/logout`
3. Auth0 clears session
4. User is redirected to home page

### Protected Routes
- `/profile` - User profile page
- `/chat` - AI conversation page
- `/survey` - Survey page
- `/home` - Home page (if implemented)

## User Data Available

### From Auth0 User Object
```typescript
{
  name: string,           // User's display name
  email: string,          // User's email address
  picture: string,        // User's profile picture URL
  email_verified: boolean, // Email verification status
  sub: string,            // Unique user identifier
  // ... other Auth0 properties
}
```

## Common Issues and Solutions

### Issue: "Module not found: Can't resolve '@auth0/nextjs-auth0/client'"
**Solution**: Do not modify Auth0 imports. Current setup uses correct imports.

### Issue: "Export handleAuth doesn't exist"
**Solution**: Do not modify the Auth0 route handler. Current implementation works.

### Issue: Login button not working
**Solution**: Check that `.env.local` file exists with correct variables.

### Issue: Sidebar not showing user info
**Solution**: Ensure Auth0 environment variables are properly set.

## Security Considerations

### Environment Variables
- **NEVER** commit `.env.local` to version control
- **NEVER** share Auth0 credentials in chat/email
- **ROTATE** client secret if accidentally exposed

### Session Management
- Sessions are handled automatically by Auth0
- Cookies are set securely with proper flags
- Sessions expire after 7 days

## Testing Authentication

### To Test Login
1. Visit `http://localhost:3000`
2. Click "Login" button
3. Complete Auth0 login flow
4. Should redirect to profile page

### To Test Logout
1. While logged in, click "Logout" in sidebar
2. Should redirect to home page
3. Should show "Login" button again

### To Test Protected Routes
1. Try accessing `/profile` without login
2. Should redirect to login page
3. After login, should show profile page

## Troubleshooting

### If Authentication Stops Working
1. **Check environment variables** in `.env.local`
2. **Restart development server** (`npm run dev`)
3. **Clear browser cookies** and try again
4. **Check Auth0 dashboard** for any changes

### If You Must Modify Auth0
1. **Document all changes** in this file
2. **Test thoroughly** before deploying
3. **Update this documentation** with new configuration
4. **Notify team members** of changes

## Contact Information

If Auth0 issues arise that require modification:
- **Document the problem** thoroughly
- **Test changes** in development environment
- **Update this file** with any modifications
- **Coordinate with team** before making changes

---

## ⚠️ FINAL WARNING

**DO NOT MODIFY AUTH0 CONFIGURATION WITHOUT PROPER DOCUMENTATION AND TESTING**

The current setup is working correctly. Any modifications may break the authentication system and require extensive debugging to restore functionality.

**Last Updated**: $(date)
**Configuration Status**: WORKING - DO NOT MODIFY
