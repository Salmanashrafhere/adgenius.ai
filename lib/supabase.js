import { createClient as createSupabaseClient } from '@supabase/supabase-js'
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

let supabase = null
let supabaseAdmin = null

if (supabaseUrl && supabaseAnonKey) {
  supabase = createSupabaseClient(supabaseUrl, supabaseAnonKey)
}

if (typeof window === 'undefined' && supabaseUrl && process.env.SUPABASE_SERVICE_ROLE_KEY) {
  const { createClient: createAdminClient } = require('@supabase/supabase-js')
  supabaseAdmin = createAdminClient(supabaseUrl, process.env.SUPABASE_SERVICE_ROLE_KEY)
}

/**
 * Creates a server-side Supabase client with cookie support.
 * Useful for authentication and accessing user sessions in API routes and Server Components.
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
