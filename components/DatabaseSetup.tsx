'use client'

import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

export function DatabaseSetup() {
  const sqlCode = `CREATE TABLE IF NOT EXISTS submissions (
  id TEXT PRIMARY KEY,
  from_user TEXT NOT NULL,
  to_user TEXT NOT NULL,
  given_by TEXT NOT NULL,
  message TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  deleted BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
  approved_at TIMESTAMP WITH TIME ZONE,
  deleted_at TIMESTAMP WITH TIME ZONE,
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_submissions_status ON submissions(status);
CREATE INDEX IF NOT EXISTS idx_submissions_deleted ON submissions(deleted);
CREATE INDEX IF NOT EXISTS idx_submissions_created_at ON submissions(created_at);
CREATE INDEX IF NOT EXISTS idx_submissions_to_user ON submissions(to_user);

ALTER TABLE submissions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow all operations" ON submissions
  FOR ALL
  USING (true)
  WITH CHECK (true);`

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <Card className="max-w-2xl w-full p-8 border-2 border-primary">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-foreground mb-2">Database Setup Required</h1>
          <p className="text-muted-foreground">
            The appreciation counter app needs a database table to store appreciations.
          </p>
        </div>

        <div className="space-y-6">
          <div className="bg-secondary/10 p-6 rounded-lg border border-border">
            <h2 className="text-xl font-semibold text-foreground mb-4">Step 1: Open Supabase SQL Editor</h2>
            <ol className="list-decimal list-inside space-y-2 text-foreground/80">
              <li>Go to your Supabase project dashboard</li>
              <li>Click "SQL Editor" in the left sidebar</li>
              <li>Click "New Query"</li>
            </ol>
          </div>

          <div className="bg-secondary/10 p-6 rounded-lg border border-border">
            <h2 className="text-xl font-semibold text-foreground mb-4">Step 2: Copy and Run the SQL</h2>
            <p className="text-foreground/80 mb-3">Copy the SQL code below and paste it into the Supabase SQL Editor:</p>
            <div className="bg-card p-4 rounded-md border border-border overflow-x-auto">
              <pre className="text-sm font-mono text-foreground whitespace-pre-wrap break-words">
                {sqlCode}
              </pre>
            </div>
            <Button
              onClick={() => navigator.clipboard.writeText(sqlCode)}
              className="mt-3 bg-primary text-primary-foreground hover:bg-primary/90"
            >
              Copy SQL
            </Button>
          </div>

          <div className="bg-green-50 dark:bg-green-950 p-6 rounded-lg border border-green-200 dark:border-green-800">
            <h2 className="text-xl font-semibold text-green-900 dark:text-green-100 mb-2">Step 3: That&apos;s it!</h2>
            <p className="text-green-800 dark:text-green-200">
              Once you run the SQL, refresh this page and the app will be ready to use.
            </p>
          </div>

          <Button
            onClick={() => window.location.reload()}
            className="w-full bg-primary text-primary-foreground hover:bg-primary/90 font-semibold py-3 text-base"
          >
            Refresh Page
          </Button>
        </div>
      </Card>
    </div>
  )
}
