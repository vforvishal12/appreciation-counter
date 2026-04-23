import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseKey) {
  throw new Error('Missing Supabase environment variables')
}

const supabase = createClient(supabaseUrl, supabaseKey)

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const status = searchParams.get('status')

  try {
    let query = supabase.from('submissions').select('*').eq('deleted', false)

    if (status) {
      query = query.eq('status', status)
    }

    const { data, error } = await query

    if (error) {
      console.error('Supabase error:', error)
      // Check if it's a table not found error
      if (error.message?.includes('relation') || error.code === 'PGRST116') {
        return Response.json(
          { error: 'Database not initialized. Please run the SQL setup from SQL_SETUP.md' },
          { status: 503 }
        )
      }
      return Response.json({ error: 'Failed to fetch submissions' }, { status: 500 })
    }

    return Response.json(data || [])
  } catch (error) {
    console.error('Error fetching submissions:', error)
    return Response.json({ error: 'Failed to fetch submissions' }, { status: 500 })
  }
}

export async function POST(request: Request) {
  const body = await request.json()
  const { from, to, givenBy, message } = body

  if (!from || !to || !givenBy || !message) {
    return Response.json(
      { error: 'Missing required fields' },
      { status: 400 }
    )
  }

  try {
    const { data, error } = await supabase
      .from('submissions')
      .insert([
        {
          id: `sub-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          from_user: from,
          to_user: to,
          given_by: givenBy,
          message,
          status: 'pending',
        },
      ])
      .select()

    if (error) {
      console.error('Supabase error:', error)
      // Check if it's a table not found error
      if (error.message?.includes('relation') || error.code === 'PGRST116') {
        return Response.json(
          { error: 'Database not initialized. Please run the SQL setup from SQL_SETUP.md' },
          { status: 503 }
        )
      }
      return Response.json({ error: 'Failed to create submission' }, { status: 500 })
    }

    return Response.json(data?.[0], { status: 201 })
  } catch (error) {
    console.error('Error creating submission:', error)
    return Response.json({ error: 'Failed to create submission' }, { status: 500 })
  }
}
