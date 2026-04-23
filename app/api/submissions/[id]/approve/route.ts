import fs from 'fs/promises'
import path from 'path'

const DATA_DIR = path.join(process.cwd(), 'data')
const SUBMISSIONS_FILE = path.join(DATA_DIR, 'submissions.json')

interface Submission {
  id: string
  from: string
  to: string
  message: string
  status: 'pending' | 'approved' | 'rejected'
  createdAt: string
  approvedAt?: string
  statusHistory: Array<{
    status: 'pending' | 'approved' | 'rejected'
    timestamp: string
  }>
}

async function readSubmissions(): Promise<Submission[]> {
  try {
    const data = await fs.readFile(SUBMISSIONS_FILE, 'utf-8')
    return JSON.parse(data)
  } catch (error) {
    return []
  }
}

async function writeSubmissions(submissions: Submission[]) {
  await fs.writeFile(SUBMISSIONS_FILE, JSON.stringify(submissions, null, 2))
}

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  const submissions = await readSubmissions()
  const submission = submissions.find((s) => s.id === id)

  if (!submission) {
    return Response.json({ error: 'Submission not found' }, { status: 404 })
  }

  submission.status = 'approved'
  submission.approvedAt = new Date().toISOString()
  submission.statusHistory.push({
    status: 'approved',
    timestamp: new Date().toISOString(),
  })

  await writeSubmissions(submissions)

  return Response.json(submission)
}
