import NextAuth from 'next-auth'
import { authOptions } from '@/lib/auth/config'

/**
 * NextAuth.js API route handler
 * Handles all authentication requests
 * 
 * Routes:
 * - GET  /api/auth/signin - Sign in page
 * - POST /api/auth/signin/:provider - Sign in with provider
 * - GET  /api/auth/signout - Sign out page
 * - POST /api/auth/signout - Sign out
 * - GET  /api/auth/session - Get session
 * - GET  /api/auth/csrf - Get CSRF token
 * - GET  /api/auth/providers - Get providers
 * - POST /api/auth/callback/:provider - OAuth callback
 */
const handler = NextAuth(authOptions)

export { handler as GET, handler as POST }
