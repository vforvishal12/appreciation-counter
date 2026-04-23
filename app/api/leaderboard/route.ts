import fs from 'fs/promises'
import path from 'path'

const DATA_DIR = path.join(process.cwd(), 'data')
const SUBMISSIONS_FILE = path.join(DATA_DIR, 'submissions.json')

interface Submission {
  id: string
  from: string
  to: string
  givenBy: string
  message: string
  status: 'pending' | 'approved' | 'rejected'
  createdAt: string
  approvedAt?: string
  deletedAt?: string
  statusHistory: Array<{
    status: 'pending' | 'approved' | 'rejected' | 'deleted'
    timestamp: string
  }>
}

interface LeaderboardEntry {
  person: string
  count: number
  appreciations: string[]
}

async function readSubmissions(): Promise<Submission[]> {
  try {
    const data = await fs.readFile(SUBMISSIONS_FILE, 'utf-8')
    return JSON.parse(data)
  } catch (error) {
    return []
  }
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const timeRange = searchParams.get('timeRange') || 'all'

  const submissions = await readSubmissions()
  const now = new Date()
  let filtered = submissions.filter((s) => s.status === 'approved')

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

    filtered = filtered.filter((s) => new Date(s.approvedAt || s.createdAt) > cutoffDate)
  }

  // Count appreciations per person
  const leaderboard: Record<string, LeaderboardEntry> = {}

  filtered.forEach((submission) => {
    if (!leaderboard[submission.to]) {
      leaderboard[submission.to] = {
        person: submission.to,
        count: 0,
        appreciations: [],
      }
    }
    leaderboard[submission.to].count += 1
    leaderboard[submission.to].appreciations.push(submission.message)
  })

  // Sort by count (descending)
  const sorted = Object.values(leaderboard).sort((a, b) => b.count - a.count)

  return Response.json(sorted)
}
