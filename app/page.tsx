'use client'

import { useState, useEffect } from 'react'
import { AuthProvider, useAuth } from '@/app/context/AuthContext'
import { AuthModal } from '@/components/AuthModal'
import { SubmissionForm } from '@/components/SubmissionForm'
import { AdminPanel } from '@/components/AdminPanel'
import { Leaderboard } from '@/components/Leaderboard'
import { DatabaseSetup } from '@/components/DatabaseSetup'
import { Button } from '@/components/ui/button'

function PageContent() {
  const { isAuthenticated, isAdmin, userName, logout } = useAuth()
  const [activeTab, setActiveTab] = useState<'submit' | 'leaderboard' | 'admin'>('submit')
  const [dbError, setDbError] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Check if database is initialized
    const checkDB = async () => {
      try {
        const res = await fetch('/api/submissions')
        if (res.status === 503) {
          const data = await res.json()
          setDbError(data.error)
        }
      } catch (error) {
        console.error('DB check error:', error)
      } finally {
        setLoading(false)
      }
    }

    if (isAuthenticated) {
      checkDB()
    } else {
      setLoading(false)
    }
  }, [isAuthenticated])

  if (!isAuthenticated) {
    return <AuthModal />
  }

  if (dbError) {
    return <DatabaseSetup />
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-muted-foreground">Loading...</p>
      </div>
    )
  }

  return (
    <main className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-card border-b-2 border-primary sticky top-0 z-50 shadow-sm">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <img src="https://www.publicissapient.com/etc.clientlibs/ps-redesign/clientlibs/clientlib-site/resources/images/PS-Logo-Positive.svg" alt="Publicis Sapient" className="h-10 w-auto object-contain" />
              <div>
                <h1 className="text-3xl font-bold text-foreground">H&M Account</h1>
                <p className="text-xs text-primary font-semibold tracking-wider uppercase">Celebrate your success</p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="text-right">
                <p className="text-sm font-medium text-foreground">{userName}</p>
                {isAdmin && (
                  <p className="text-xs text-accent font-semibold">Admin</p>
                )}
              </div>
              <Button
                onClick={logout}
                variant="outline"
                className="border-border text-foreground hover:bg-secondary/20"
              >
                Logout
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Navigation */}
      <div className="bg-background border-b border-border sticky top-16 z-40">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex gap-0">
            <button
              onClick={() => setActiveTab('submit')}
              className={`px-6 py-4 text-sm font-semibold border-b-2 transition-colors ${activeTab === 'submit'
                  ? 'border-primary text-primary bg-primary/5'
                  : 'border-transparent text-foreground/60 hover:text-foreground'
                }`}
            >
              Add Appreciation
            </button>
            <button
              onClick={() => setActiveTab('leaderboard')}
              className={`px-6 py-4 text-sm font-semibold border-b-2 transition-colors ${activeTab === 'leaderboard'
                  ? 'border-primary text-primary bg-primary/5'
                  : 'border-transparent text-foreground/60 hover:text-foreground'
                }`}
            >
              Leaderboard
            </button>
            {isAdmin && (
              <button
                onClick={() => setActiveTab('admin')}
                className={`px-6 py-4 text-sm font-semibold border-b-2 transition-colors ${activeTab === 'admin'
                    ? 'border-primary text-primary bg-primary/5'
                    : 'border-transparent text-foreground/60 hover:text-foreground'
                  }`}
              >
                Approve Appreciations
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {activeTab === 'submit' && <SubmissionForm userName={userName || 'User'} />}
        {activeTab === 'leaderboard' && <Leaderboard />}
        {activeTab === 'admin' && isAdmin && <AdminPanel />}
      </div>
    </main>
  )
}

export default function Home() {
  return (
    <AuthProvider>
      <PageContent />
    </AuthProvider>
  )
}
