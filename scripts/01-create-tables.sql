-- Create submissions table
CREATE TABLE IF NOT EXISTS submissions (
  id TEXT PRIMARY KEY,
  from_name TEXT NOT NULL,
  to_name TEXT NOT NULL,
  given_by TEXT NOT NULL,
  message TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected', 'deleted')),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
  approved_at TIMESTAMP WITH TIME ZONE,
  deleted_at TIMESTAMP WITH TIME ZONE,
  status_history JSONB NOT NULL DEFAULT '[]'::jsonb,
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_submissions_status ON submissions(status);
CREATE INDEX IF NOT EXISTS idx_submissions_created_at ON submissions(created_at);
CREATE INDEX IF NOT EXISTS idx_submissions_to_name ON submissions(to_name);

-- Enable RLS
ALTER TABLE submissions ENABLE ROW LEVEL SECURITY;

-- Create policy to allow all reads
CREATE POLICY "Allow public read" ON submissions
  FOR SELECT USING (true);

-- Create policy to allow all inserts
CREATE POLICY "Allow public insert" ON submissions
  FOR INSERT WITH CHECK (true);

-- Create policy to allow updates
CREATE POLICY "Allow public update" ON submissions
  FOR UPDATE USING (true) WITH CHECK (true);

-- Create policy to allow deletes
CREATE POLICY "Allow public delete" ON submissions
  FOR DELETE USING (true);
