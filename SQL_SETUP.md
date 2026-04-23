# Database Setup Instructions

## How to Create the Submissions Table

Since the file system is read-only in production, we're using Supabase for data storage. You need to manually create the `submissions` table.

### Step 1: Go to Supabase Dashboard
1. Open your Supabase project dashboard
2. Click on "SQL Editor" in the left sidebar

### Step 2: Run the Following SQL

Copy and paste this SQL into the Supabase SQL Editor and click "Run":

```sql
-- Create submissions table
CREATE TABLE IF NOT EXISTS submissions (
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

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_submissions_status ON submissions(status);
CREATE INDEX IF NOT EXISTS idx_submissions_deleted ON submissions(deleted);
CREATE INDEX IF NOT EXISTS idx_submissions_created_at ON submissions(created_at);
CREATE INDEX IF NOT EXISTS idx_submissions_to_user ON submissions(to_user);

-- Enable RLS (Row Level Security) - optional but recommended
ALTER TABLE submissions ENABLE ROW LEVEL SECURITY;

-- Create policies to allow all operations (you can restrict this later)
CREATE POLICY "Allow all operations" ON submissions
  FOR ALL
  USING (true)
  WITH CHECK (true);
```

### Step 3: That's it!
Once you run this SQL, your app will be able to create and manage appreciations.

## Verification

After running the SQL, you should see the `submissions` table in your Supabase "Tables" view.
