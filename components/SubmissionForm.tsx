'use client'

import { useState } from 'react'
import useSWR from 'swr'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
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

export function SubmissionForm({ userName }: { userName: string }) {
  const [to, setTo] = useState('')
  const [givenBy, setGivenBy] = useState('')
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(false)
  const [successMsg, setSuccessMsg] = useState('')
  const [errorMsg, setErrorMsg] = useState('')

  const { mutate } = useSWR('/api/submissions', fetcher)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setErrorMsg('')
    setSuccessMsg('')

    if (!to || !givenBy || !message) {
      setErrorMsg('Please fill in all fields')
      setLoading(false)
      return
    }

    try {
      const res = await fetch('/api/submissions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ from: userName, to, givenBy, message }),
      })

      const data = await res.json()

      if (res.ok) {
        setSuccessMsg('Appreciation submitted! Waiting for admin approval.')
        setTo('')
        setGivenBy('')
        setMessage('')
        mutate()
      } else {
        setErrorMsg(data.error || 'Failed to submit appreciation')
      }
    } catch (error) {
      console.error('Submission error:', error)
      setErrorMsg('An error occurred')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-2xl">
      <Card className="p-8 bg-card border-2 border-border">
        <h2 className="text-2xl font-bold text-foreground mb-6">Add Appreciation</h2>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-2">
            <label className="text-sm font-semibold text-foreground">
              Appreciate someone...
            </label>
            <Input
              type="text"
              value={to}
              onChange={(e) => setTo(e.target.value)}
              placeholder="Who would you like to appreciate?"
              className="w-full border-2 border-border focus:border-primary"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-semibold text-foreground">
              Who have given the appreciation
            </label>
            <Input
              type="text"
              value={givenBy}
              onChange={(e) => setGivenBy(e.target.value)}
              placeholder="Your name or team"
              className="w-full border-2 border-border focus:border-primary"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-semibold text-foreground">Message</label>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Write something kind..."
              className="w-full px-3 py-2 border-2 border-border rounded-md bg-input text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
              rows={4}
            />
          </div>

          {errorMsg && <p className="text-destructive text-sm font-medium">{errorMsg}</p>}
          {successMsg && <p className="text-green-700 text-sm font-medium">{successMsg}</p>}

          <Button
            type="submit"
            disabled={loading}
            className="w-full bg-primary text-primary-foreground hover:bg-primary/90 font-semibold py-2.5 text-base"
          >
            {loading ? 'Submitting...' : 'Add Appreciation'}
          </Button>
        </form>
      </Card>
    </div>
  )
}
