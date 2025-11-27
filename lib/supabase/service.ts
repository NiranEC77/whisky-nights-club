import { createClient } from '@supabase/supabase-js'

// Service client for server-side operations that don't need user context
// This bypasses cookie/session handling and avoids crypto errors
export function createServiceClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    {
      auth: {
        autoRefreshToken: false,
        persistSession: false
      }
    }
  )
}

