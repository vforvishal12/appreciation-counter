import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseKey) {
  throw new Error('Missing Supabase environment variables')
}

const supabase = createClient(supabaseUrl, supabaseKey)

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params

  try {
    const { data, error } = await supabase
      .from('submissions')
      .update({ status: 'approved', approved_at: new Date().toISOString() })
      .eq('id', id)
      .select()

    if (error || !data || data.length === 0) {
      return Response.json({ error: 'Submission not found' }, { status: 404 })
    }

    return Response.json(data[0])
  } catch (error) {
    console.error('Error approving submission:', error)
    return Response.json({ error: 'Failed to approve submission' }, { status: 500 })
  }
}
