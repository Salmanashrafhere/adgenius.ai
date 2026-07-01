import { createClient as createSupabaseClient } from '@supabase/supabase-js'
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

// Static client for basic operations
let supabase = null
if (supabaseUrl && supabaseAnonKey) {
  supabase = createSupabaseClient(supabaseUrl, supabaseAnonKey)
}

// Admin client for privileged operations (server-side only)
let supabaseAdmin = null
if (typeof window === 'undefined' && supabaseUrl && process.env.SUPABASE_SERVICE_ROLE_KEY) {
  supabaseAdmin = createSupabaseClient(supabaseUrl, process.env.SUPABASE_SERVICE_ROLE_KEY)
}

/**
 * Creates a session-aware Supabase client for use in Server Components and API routes.
 */
export async function createClient() {
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

export { supabase, supabaseAdmin }
