'use client'

import { useState } from 'react'
import useSWR from 'swr'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'

interface Submission {
  id: string
  from: string
  to: string
  givenBy: string
  message: string
  status: 'pending' | 'approved' | 'rejected'
  createdAt: string
}

const fetcher = (url: string) => fetch(url).then((r) => r.json())

export function AdminPanel() {
  const { data: rawData, mutate, error: swrError } = useSWR('/api/submissions?status=pending', fetcher)
  const [loading, setLoading] = useState<string | null>(null)

  // Handle API errors and ensure data is always an array
  const submissions = Array.isArray(rawData) ? rawData : []
  const hasError = swrError || (rawData?.error)

  const handleApprove = async (id: string) => {
    setLoading(id)
    try {
      await fetch(`/api/submissions/${id}/approve`, { method: 'POST' })
      mutate()
    } catch (error) {
      console.error('Failed to approve:', error)
    } finally {
      setLoading(null)
    }
  }

  const handleReject = async (id: string) => {
    setLoading(id)
    try {
      await fetch(`/api/submissions/${id}/reject`, { method: 'POST' })
      mutate()
    } catch (error) {
      console.error('Failed to reject:', error)
    } finally {
      setLoading(null)
    }
  }

  const handleDelete = async (id: string) => {
    setLoading(id)
    try {
      await fetch(`/api/submissions/${id}/delete`, { method: 'POST' })
      mutate()
    } catch (error) {
      console.error('Failed to delete:', error)
    } finally {
      setLoading(null)
    }
  }

  return (
    <div>
      <h2 className="text-2xl font-bold text-foreground mb-6">Pending Appreciations</h2>

      {hasError && (
        <Card className="p-4 bg-destructive/10 border-2 border-destructive mb-6">
          <p className="text-destructive font-medium">
            {typeof rawData?.error === 'string' ? rawData.error : 'Failed to load pending appreciations'}
          </p>
        </Card>
      )}

      {submissions.length === 0 ? (
        <Card className="p-8 bg-card border-2 border-border text-center">
          <p className="text-muted-foreground">No pending appreciations</p>
        </Card>
      ) : (
        <div className="grid gap-5">
          {submissions.map((submission: Submission) => (
            <Card key={submission.id} className="p-6 bg-card border-2 border-border">
              <div className="mb-4 pb-4 border-b border-border">
                <p className="text-sm text-muted-foreground mb-2">
                  From: <span className="font-semibold text-foreground">{submission.from}</span>
                </p>
                <p className="text-sm text-muted-foreground mb-2">
                  To: <span className="font-semibold text-foreground">{submission.to}</span>
                </p>
                <p className="text-sm text-muted-foreground">
                  Given By: <span className="font-semibold text-foreground">{submission.givenBy}</span>
                </p>
              </div>

              <p className="text-foreground mb-5 p-4 bg-secondary/10 border border-border rounded-md leading-relaxed">
                {submission.message}
              </p>

              <div className="flex gap-2">
                <Button
                  onClick={() => handleApprove(submission.id)}
                  disabled={loading === submission.id}
                  className="flex-1 bg-green-600 text-white hover:bg-green-700 font-semibold"
                >
                  {loading === submission.id ? 'Approving...' : 'Approve'}
                </Button>
                <Button
                  onClick={() => handleReject(submission.id)}
                  disabled={loading === submission.id}
                  className="flex-1 bg-destructive text-destructive-foreground hover:bg-destructive/90 font-semibold"
                >
                  {loading === submission.id ? 'Rejecting...' : 'Reject'}
                </Button>
                <Button
                  onClick={() => handleDelete(submission.id)}
                  disabled={loading === submission.id}
                  className="flex-1 bg-foreground/80 text-white hover:bg-foreground font-semibold"
                >
                  {loading === submission.id ? 'Deleting...' : 'Delete'}
                </Button>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
