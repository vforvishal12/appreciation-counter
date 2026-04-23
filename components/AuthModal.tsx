'use client'

import { useState } from 'react'
import { useAuth } from '@/app/context/AuthContext'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card } from '@/components/ui/card'

export function AuthModal() {
  const { login } = useAuth()
  const [name, setName] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (!name || !password) {
      setError('Please fill in all fields')
      return
    }

    const success = login(name, password)
    if (!success) {
      setError('Invalid credentials')
    }
  }

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center p-4">
      <Card className="w-full max-w-md p-10 bg-card border-2 border-primary shadow-lg">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">Welcome</h1>
          <p className="text-sm text-muted-foreground font-medium">Sign in to your account</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-2">
            <label className="text-sm font-semibold text-foreground">Name</label>
            <Input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter your name"
              className="w-full border-2 border-border focus:border-primary"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-semibold text-foreground">Password</label>
            <Input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter password"
              className="w-full border-2 border-border focus:border-primary"
            />
          </div>

          {error && <p className="text-destructive text-sm font-medium bg-destructive/10 p-3 rounded-md">{error}</p>}

          <Button type="submit" className="w-full bg-primary text-primary-foreground hover:bg-primary/90 font-semibold py-2.5 text-base mt-2">
            Sign In
          </Button>
        </form>
      </Card>
    </div>
  )
}
