import { createClient as createSupabaseClient } from '@supabase/supabase-js'
import { createServerClient } from '@supabase/ssr'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

// Static client for client-side or simple use cases
export const supabase = (supabaseUrl && supabaseAnonKey)
  ? createSupabaseClient(supabaseUrl, supabaseAnonKey)
  : null

// Admin client for server-side elevated privileges
export const supabaseAdmin = (typeof window === 'undefined' && supabaseUrl && process.env.SUPABASE_SERVICE_ROLE_KEY)
  ? createSupabaseClient(supabaseUrl, process.env.SUPABASE_SERVICE_ROLE_KEY)
  : null

/**
 * Creates a Supabase client for use in Server Components, Route Handlers, and Server Actions.
 * It automatically handles session cookies using next/headers.
 */
export async function createClient() {
  if (typeof window !== 'undefined') {
    return supabase;
  }

  const { cookies } = await import('next/headers')
  const cookieStore = await cookies()

  return createServerClient(
    supabaseUrl,
    supabaseAnonKey,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll()
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            )
          } catch {
            // The `setAll` method was called from a Server Component.
            // This can be ignored if you have middleware refreshing
            // user sessions.
          }
        },
      },
    }
  )
}
