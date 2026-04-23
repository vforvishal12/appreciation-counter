'use client'

import { useState } from 'react'
import useSWR from 'swr'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'

interface LeaderboardEntry {
  person: string
  count: number
  appreciations: string[]
}

const fetcher = (url: string) => fetch(url).then((r) => r.json())

export function Leaderboard() {
  const [timeRange, setTimeRange] = useState('all')

  const { data: entries = [] } = useSWR(
    `/api/leaderboard?timeRange=${timeRange}`,
    fetcher
  )

  const timeRanges = [
    { value: 'all', label: 'All Time' },
    { value: 'week', label: 'This Week' },
    { value: 'month', label: 'This Month' },
    { value: 'quarter', label: 'This Quarter' },
  ]

  return (
    <div>
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-foreground mb-5">Leaderboard</h2>

        <div className="flex flex-wrap gap-3">
          {timeRanges.map((range) => (
            <Button
              key={range.value}
              onClick={() => setTimeRange(range.value)}
              className={`font-semibold transition-all ${
                timeRange === range.value
                  ? 'bg-primary text-primary-foreground shadow-md'
                  : 'bg-background border-2 border-border text-foreground hover:border-primary hover:text-primary'
              }`}
            >
              {range.label}
            </Button>
          ))}
        </div>
      </div>

      {entries.length === 0 ? (
        <Card className="p-10 bg-card border-2 border-border text-center">
          <p className="text-muted-foreground text-lg">No appreciations yet</p>
        </Card>
      ) : (
        <div className="grid gap-5">
          {entries.map((entry: LeaderboardEntry, index: number) => (
            <Card
              key={entry.person}
              className="p-6 bg-card border-2 border-border hover:border-primary transition-all hover:shadow-md"
            >
              <div className="flex items-start justify-between mb-4 pb-4 border-b border-border">
                <div className="flex items-baseline gap-4">
                  <div className={`text-4xl font-bold ${index === 0 ? 'text-primary' : 'text-foreground/60'}`}>
                    #{index + 1}
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-foreground">{entry.person}</h3>
                    <p className="text-sm text-muted-foreground">
                      {entry.count} appreciation{entry.count !== 1 ? 's' : ''}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-3xl font-bold text-primary">{entry.count}</div>
                </div>
              </div>

              <div className="space-y-3">
                {entry.appreciations.slice(0, 2).map((msg: string, i: number) => (
                  <p
                    key={i}
                    className="text-sm text-foreground/80 p-3 bg-secondary/15 border border-border rounded-md italic leading-relaxed"
                  >
                    &quot;{msg}&quot;
                  </p>
                ))}
                {entry.appreciations.length > 2 && (
                  <p className="text-xs text-muted-foreground pt-1 font-medium">
                    +{entry.appreciations.length - 2} more appreciation
                    {entry.appreciations.length - 2 !== 1 ? 's' : ''}
                  </p>
                )}
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
