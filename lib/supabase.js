import { createClient } from '@supabase/supabase-js' 
 
 const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL 
 const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY 
 
 let supabase = null 
 let supabaseAdmin = null 
 
 if (supabaseUrl && supabaseAnonKey) { 
   supabase = createClient(supabaseUrl, supabaseAnonKey) 
 } 
 
 if (typeof window === 'undefined' && supabaseUrl && process.env.SUPABASE_SERVICE_ROLE_KEY) { 
   const { createClient: createAdminClient } = require('@supabase/supabase-js') 
   supabaseAdmin = createAdminClient(supabaseUrl, process.env.SUPABASE_SERVICE_ROLE_KEY) 
 } 
 
 export { supabase, supabaseAdmin } 
