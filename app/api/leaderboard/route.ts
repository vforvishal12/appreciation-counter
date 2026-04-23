import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseKey) {
  throw new Error('Missing Supabase environment variables')
}

const supabase = createClient(supabaseUrl, supabaseKey)

interface LeaderboardEntry {
  person: string
  count: number
  appreciations: string[]
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const timeRange = searchParams.get('timeRange') || 'all'

  try {
    let query = supabase
      .from('submissions')
      .select('*')
      .eq('status', 'approved')
      .eq('deleted', false)

    // Filter by time range
    if (timeRange !== 'all') {
      const cutoffDate = new Date()
      if (timeRange === 'week') {
        cutoffDate.setDate(cutoffDate.getDate() - 7)
      } else if (timeRange === 'month') {
        cutoffDate.setMonth(cutoffDate.getMonth() - 1)
      } else if (timeRange === 'quarter') {
        cutoffDate.setMonth(cutoffDate.getMonth() - 3)
      }

      query = query.gte('approved_at', cutoffDate.toISOString())
    }

    const { data: submissions, error } = await query

    if (error) {
      console.error('Supabase error:', error)
      return Response.json({ error: 'Failed to fetch leaderboard' }, { status: 500 })
    }

    // Count appreciations per person
    const leaderboard: Record<string, LeaderboardEntry> = {}

    submissions?.forEach((submission: any) => {
      if (!leaderboard[submission.to_user]) {
        leaderboard[submission.to_user] = {
          person: submission.to_user,
          count: 0,
          appreciations: [],
        }
      }
      leaderboard[submission.to_user].count += 1
      leaderboard[submission.to_user].appreciations.push(submission.message)
    })

    // Sort by count (descending)
    const sorted = Object.values(leaderboard).sort((a, b) => b.count - a.count)

    return Response.json(sorted)
  } catch (error) {
    console.error('Error fetching leaderboard:', error)
    return Response.json({ error: 'Failed to fetch leaderboard' }, { status: 500 })
  }
}
