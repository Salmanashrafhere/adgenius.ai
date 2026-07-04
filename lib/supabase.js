import { createClient as createSupabaseClient } from '@supabase/supabase-js'
import { createServerClient } from '@supabase/ssr'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

let supabase = null
let supabaseAdmin = null

if (supabaseUrl && supabaseAnonKey) {
  supabase = createSupabaseClient(supabaseUrl, supabaseAnonKey)
}

if (typeof window === 'undefined' && supabaseUrl && process.env.SUPABASE_SERVICE_ROLE_KEY) {
  supabaseAdmin = createSupabaseClient(supabaseUrl, process.env.SUPABASE_SERVICE_ROLE_KEY)
}

export async function createClient() {
  const { cookies } = await import('next/headers')
  const cookieStore = await cookies()

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
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
