import { createBrowserClient } from '@supabase/ssr'

/**
 * Create a Supabase client for use in the browser (client components)
 * This client is used for client-side operations like auth state management
 */
export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
}
