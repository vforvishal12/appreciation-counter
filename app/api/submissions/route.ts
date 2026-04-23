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

async function ensureDataDir() {
  try {
    await fs.mkdir(DATA_DIR, { recursive: true })
  } catch (error) {
    // Directory might already exist
  }
}

async function readSubmissions(): Promise<Submission[]> {
  await ensureDataDir()
  try {
    const data = await fs.readFile(SUBMISSIONS_FILE, 'utf-8')
    return JSON.parse(data)
  } catch (error) {
    return []
  }
}

async function writeSubmissions(submissions: Submission[]) {
  await ensureDataDir()
  await fs.writeFile(SUBMISSIONS_FILE, JSON.stringify(submissions, null, 2))
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const status = searchParams.get('status')

  const submissions = await readSubmissions()
  const filtered = status ? submissions.filter((s) => s.status === status) : submissions

  return Response.json(filtered)
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

  const submissions = await readSubmissions()
  const newSubmission: Submission = {
    id: `sub-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    from,
    to,
    givenBy,
    message,
    status: 'pending',
    createdAt: new Date().toISOString(),
    statusHistory: [
      {
        status: 'pending',
        timestamp: new Date().toISOString(),
      },
    ],
  }

  submissions.push(newSubmission)
  await writeSubmissions(submissions)

  return Response.json(newSubmission, { status: 201 })
}
