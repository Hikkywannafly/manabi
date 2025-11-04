# Auth Architecture - Clean Code Structure

## 📁 Folder Structure

```
src/
├── app/
│   ├── api/
│   │   └── auth/
│   │       ├── actions.ts          # Server Actions (Service Layer)
│   │       └── callback/
│   │           └── route.ts        # OAuth Callback API Route
│   └── [locale]/
│       ├── login/
│       │   └── page.tsx            # Login UI
│       └── dashboard/
│           └── page.tsx            # Protected Page
├── lib/
│   ├── auth/
│   │   ├── utils.ts                # Auth Utilities (Repository Pattern)
│   │   └── index.ts                # Barrel Export
│   └── supabase/
│       ├── client.ts               # Browser Client
│       ├── server.ts               # Server Client
│       ├── middleware.ts           # Middleware Helper
│       └── index.ts                # Barrel Export
├── contexts/
│   └── auth-provider.tsx           # Client Auth Context (State Management)
├── components/
│   ├── auth/
│   │   └── login-form.tsx          # Login Form Component
│   └── dashboard/
│       └── dashboard-content.tsx   # Dashboard Component
└── types/
    └── auth.ts                     # Type Definitions
```

## 🏗️ Design Patterns Used

### 1. **Service Layer Pattern** (`src/app/api/auth/actions.ts`)
Server Actions act as service layer, handling business logic:
- `signInWithOAuth()` - OAuth authentication service
- `signInWithEmail()` - Email login service
- `signUp()` - User registration service
- `signOut()` - Logout service
- `resetPassword()` - Password reset service
- `updatePassword()` - Password update service

**Benefits:**
- ✅ Centralized business logic
- ✅ Reusable across components
- ✅ Type-safe with TypeScript
- ✅ Server-side execution (secure)

### 2. **Repository Pattern** (`src/lib/auth/utils.ts`)
Auth utilities act as repository for data access:
- `getUser()` - Fetch current user
- `getSession()` - Fetch current session
- `requireAuth()` - Guard for protected resources
- `hasRole()` - Role-based access control

**Benefits:**
- ✅ Abstraction over Supabase client
- ✅ Easy to swap authentication provider
- ✅ Consistent API across app
- ✅ Testable

### 3. **Provider Pattern** (`src/contexts/auth-provider.tsx`)
Context provider for global auth state:
- Manages user session state
- Listens to auth state changes
- Provides hooks: `useAuth()`, `useRequireAuth()`

**Benefits:**
- ✅ Single source of truth
- ✅ Automatic re-renders on auth changes
- ✅ Easy to access auth state anywhere
- ✅ Optimized with useMemo/useCallback

### 4. **Factory Pattern** (`src/lib/supabase/`)
Factory functions for creating Supabase clients:
- `createClient()` (client.ts) - Browser client
- `createClient()` (server.ts) - Server client
- `updateSession()` (middleware.ts) - Middleware helper

**Benefits:**
- ✅ Encapsulates client creation logic
- ✅ Handles cookies automatically
- ✅ SSR-safe
- ✅ Environment-aware

### 5. **API Route Handler Pattern** (`callback/route.ts`)
Standard Next.js API route for OAuth callback:
- Exchanges OAuth code for session
- Handles errors gracefully
- Redirects with locale awareness

**Benefits:**
- ✅ Follows Next.js conventions
- ✅ Handles OAuth flow securely
- ✅ Type-safe with Request/Response

## 🔄 Data Flow

### Login Flow:
```
1. User clicks "Login with Google" (login-form.tsx)
   ↓
2. Calls signInWithOAuth("google", locale) (actions.ts)
   ↓
3. Supabase redirects to Google OAuth
   ↓
4. User authenticates with Google
   ↓
5. Google redirects to /api/auth/callback?code=xxx&locale=en
   ↓
6. Callback exchanges code for session (route.ts)
   ↓
7. Redirects to /en/dashboard
   ↓
8. AuthProvider updates user state
   ↓
9. Dashboard shows user info
```

### Protected Route Flow:
```
1. User tries to access /dashboard (middleware - proxy.ts)
   ↓
2. Middleware checks auth state
   ↓
3a. If authenticated → Allow access
3b. If not → Redirect to /login
```

### Logout Flow:
```
1. User clicks "Sign Out" (dashboard-content.tsx)
   ↓
2. Calls signOut(locale) (actions.ts)
   ↓
3. Supabase clears session
   ↓
4. Redirects to homepage
   ↓
5. AuthProvider clears user state
```

## 📝 Code Organization Principles

### Separation of Concerns
- **UI Components**: Only handle presentation
- **Server Actions**: Handle business logic
- **Utilities**: Provide data access
- **Context**: Manage global state
- **Types**: Define contracts

### Single Responsibility
Each file has one clear purpose:
- `actions.ts`: Auth operations
- `utils.ts`: Auth queries
- `auth-provider.tsx`: State management
- `login-form.tsx`: Login UI
- `callback/route.ts`: OAuth callback

### DRY (Don't Repeat Yourself)
- Shared utilities in `lib/auth/`
- Reusable Supabase clients in `lib/supabase/`
- Common types in `types/auth.ts`

### SOLID Principles

**S - Single Responsibility**: Each function does one thing
**O - Open/Closed**: Easy to extend (add new providers)
**L - Liskov Substitution**: Can swap Supabase for other auth
**I - Interface Segregation**: Small, focused interfaces
**D - Dependency Inversion**: Depend on abstractions (utils), not concrete implementations

## 🔧 Configuration

### Environment Variables
```env
NEXT_PUBLIC_SUPABASE_URL=your-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-key
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

### Supabase Redirect URLs
Add to Supabase Dashboard → Authentication → URL Configuration:
```
http://localhost:3000/api/auth/callback
https://yourdomain.com/api/auth/callback
```

## 🧪 Testing Strategy

### Unit Tests (Recommended)
```typescript
// Test auth utilities
describe('getUser', () => {
  it('should return user when authenticated', async () => {
    const user = await getUser();
    expect(user).toBeDefined();
  });
});

// Test server actions
describe('signInWithOAuth', () => {
  it('should redirect to OAuth provider', async () => {
    const result = await signInWithOAuth('google', 'en');
    expect(result).toBeDefined();
  });
});
```

### Integration Tests
- Test OAuth flow end-to-end
- Test protected route access
- Test logout flow

## 🚀 Extension Points

### Adding New OAuth Provider
1. Update type in `actions.ts`: `"google" | "github" | "facebook"`
2. Enable in Supabase Dashboard
3. Add button in `login-form.tsx`

### Adding Custom Auth Logic
Create new service in `actions.ts`:
```typescript
export async function signInWithMagicLink(email: string, locale: string) {
  const supabase = await createClient();
  // Custom logic here
}
```

### Adding Role Guards
Use utilities in `utils.ts`:
```typescript
export async function requireAdmin() {
  const isAdmin = await hasRole('admin');
  if (!isAdmin) throw new Error('Forbidden');
}
```

## 📊 Benefits of This Architecture

✅ **Maintainable**: Clear structure, easy to find code
✅ **Scalable**: Easy to add features
✅ **Testable**: Separated concerns, mockable
✅ **Type-Safe**: Full TypeScript support
✅ **Secure**: Server-side auth, protected routes
✅ **Performance**: Optimized with React hooks
✅ **Developer-Friendly**: Intuitive API, good DX
✅ **Production-Ready**: Error handling, logging

## 🔐 Security Best Practices

1. **Never expose secrets**: Use environment variables
2. **Server-side validation**: All auth logic on server
3. **HTTPS only**: In production
4. **CSRF protection**: Built into Next.js
5. **Rate limiting**: Add to API routes (recommended)
6. **RLS in Supabase**: Protect database access

## 📚 References

- [Next.js App Router](https://nextjs.org/docs/app)
- [Supabase Auth](https://supabase.com/docs/guides/auth)
- [Clean Architecture](https://blog.cleancoder.com/uncle-bob/2012/08/13/the-clean-architecture.html)
- [Design Patterns](https://refactoring.guru/design-patterns)
