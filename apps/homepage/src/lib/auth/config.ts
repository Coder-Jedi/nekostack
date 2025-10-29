import { NextAuthOptions } from 'next-auth'
import { SupabaseAdapter } from '@auth/supabase-adapter'
import GoogleProvider from 'next-auth/providers/google'
import GitHubProvider from 'next-auth/providers/github'
// Email provider requires nodemailer, skip for now (use Supabase Auth instead)
// import EmailProvider from 'next-auth/providers/email'

/**
 * NextAuth.js configuration with Supabase adapter
 * Handles authentication with multiple providers
 */
export const authOptions: NextAuthOptions = {
  adapter: SupabaseAdapter({
    url: process.env.NEXT_PUBLIC_SUPABASE_URL!,
    secret: process.env.SUPABASE_SERVICE_ROLE_KEY!,
  }),
  
  providers: [
    // Email provider disabled - using Supabase Auth for email/password
    // EmailProvider({
    //   server: {
    //     host: process.env.EMAIL_SERVER_HOST,
    //     port: process.env.EMAIL_SERVER_PORT,
    //     auth: {
    //       user: process.env.EMAIL_SERVER_USER,
    //       pass: process.env.EMAIL_SERVER_PASSWORD,
    //     },
    //   },
    //   from: process.env.EMAIL_FROM,
    // }),
    
    // Google OAuth
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      authorization: {
        params: {
          prompt: 'consent',
          access_type: 'offline',
          response_type: 'code',
        },
      },
    }),
    
    // GitHub OAuth
    GitHubProvider({
      clientId: process.env.GITHUB_CLIENT_ID!,
      clientSecret: process.env.GITHUB_CLIENT_SECRET!,
    }),
  ],
  
  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  
  pages: {
    signIn: '/auth/signin',
    signOut: '/auth/signout',
    error: '/auth/error',
    verifyRequest: '/auth/verify-request',
    newUser: '/welcome',
  },
  
  callbacks: {
    async session({ session, token }) {
      if (session.user && token.sub) {
        // Create a new session object with id
        return {
          ...session,
          user: {
            ...session.user,
            id: token.sub
          }
        }
      }
      return session
    },
    
    async jwt({ token, user, account }) {
      if (user) {
        token.sub = user.id
      }
      return token
    },
    
    async signIn({ user, account, profile }) {
      // Allow sign in
      return true
    },
    
    async redirect({ url, baseUrl }) {
      // Redirect to dashboard after sign in
      if (url.startsWith('/')) return `${baseUrl}${url}`
      else if (new URL(url).origin === baseUrl) return url
      return baseUrl
    },
  },
  
  events: {
    async signIn({ user, account, profile, isNewUser }) {
      console.log('User signed in:', user.email)
      // You can add custom logic here (e.g., send welcome email)
    },
    
    async signOut({ token, session }) {
      console.log('User signed out')
    },
    
    async createUser({ user }) {
      console.log('New user created:', user.email)
      // Profile is automatically created via Supabase trigger
    },
  },
  
  debug: process.env.NODE_ENV === 'development',
}
