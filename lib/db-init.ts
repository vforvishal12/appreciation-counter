import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY

let initialized = false

export async function initializeDatabase() {
  if (initialized) return

  if (!supabaseUrl || !supabaseKey) {
    console.error('Missing Supabase environment variables')
    return
  }

  const supabase = createClient(supabaseUrl, supabaseKey)

  try {
    // Try to check if table exists by querying it
    const { error } = await supabase.from('submissions').select('count(*)', { count: 'exact', head: true })

    if (error) {
      // Table doesn't exist, but we can't create it via JS client
      // User needs to create table manually via Supabase SQL editor
      console.error('submissions table does not exist. Please run the SQL from scripts/01-create-tables.sql in your Supabase SQL editor.')
      return
    }

    initialized = true
    console.log('[v0] Database initialized successfully')
  } catch (error) {
    console.error('[v0] Database initialization error:', error)
  }
}
