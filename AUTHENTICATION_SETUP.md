# Authentication Setup with Clerk and Convex

This project now includes authentication using Clerk and Convex. Here's how to complete the setup:

## 1. Clerk Setup

1. Go to [Clerk Dashboard](https://dashboard.clerk.com/)
2. Create a new application or use an existing one
3. Copy your publishable key and secret key
4. Update your `.env.local` file with the actual keys:

```env
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_your_actual_key_here
CLERK_SECRET_KEY=sk_test_your_actual_secret_key_here
```

## 2. Convex Setup

The Convex deployment is already configured. The environment variables are set to:
- `CONVEX_DEPLOYMENT=https://rare-robin-292.convex.cloud`
- `NEXT_PUBLIC_CONVEX_URL=https://rare-robin-292.convex.cloud`

## 3. Features Implemented

### Authentication Pages
- **Sign In**: `/sign-in` - Clean sign-in page with Clerk components
- **Sign Up**: `/sign-up` - Registration page with Clerk components

### Protected Routes
- **Builder**: `/builder` - Form builder (requires authentication)
- **Profile**: `/profile` - User profile page (requires authentication)

### Header Integration
- Sign In/Sign Up buttons for unauthenticated users
- User avatar and profile access for authenticated users
- Mobile-responsive navigation with authentication

### Components Created
- `ProtectedRoute` - Wrapper component for protected pages
- `useAuthState` - Custom hook for authentication state
- `ConvexClientProvider` - Convex provider wrapper

## 4. Usage

### For Users
1. Visit the homepage
2. Click "Sign Up" to create an account or "Sign In" to access existing account
3. Once authenticated, access the form builder at `/builder`
4. View profile at `/profile`

### For Developers
```tsx
import { useAuthState } from "@/hooks/use-auth";
import { ProtectedRoute } from "@/components/auth/protected-route";

// Use authentication state
const { isSignedIn, user, isLoading } = useAuthState();

// Protect a page
<ProtectedRoute>
  <YourProtectedContent />
</ProtectedRoute>
```

## 5. Environment Variables Required

```env
# Clerk Authentication
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key_here
CLERK_SECRET_KEY=your_clerk_secret_key_here

# Convex
CONVEX_DEPLOYMENT=https://rare-robin-292.convex.cloud
NEXT_PUBLIC_CONVEX_URL=https://rare-robin-292.convex.cloud

# Clerk URLs (for development)
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/
```

## 6. Next Steps

1. Update the Clerk keys in `.env.local`
2. Run `yarn dev` to start the development server
3. Test the authentication flow
4. Customize the UI components as needed

The authentication system is now fully integrated and ready to use!
