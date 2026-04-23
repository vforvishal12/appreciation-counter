# Appreciation Counter - Setup Instructions

This is an H&M appreciation counter app built with Next.js and Supabase.

## What Changed

The app was previously using file-based storage which doesn't work in production (read-only filesystem). It now uses **Supabase** as the database.

## Quick Start

### 1. Your Supabase Project is Connected ✓
Supabase environment variables are already set up in your project.

### 2. Create the Database Table

The app will show a setup screen when you first load it. Follow these steps:

#### Option A: Use the In-App Setup Guide (Easiest)
1. Open your app
2. Sign in with credentials (HM or admin)
3. You'll see the "Database Setup Required" screen with copy-paste instructions
4. Go to your Supabase dashboard → SQL Editor
5. Create a new query and paste the SQL
6. Click "Run"
7. Refresh the app page

#### Option B: Manual Setup
1. Go to your Supabase project dashboard
2. Click "SQL Editor" in the left sidebar
3. Click "New Query"
4. Copy the SQL from `SQL_SETUP.md` in this project
5. Paste it into the SQL editor and click "Run"
6. Refresh your app

### 3. That's It!
Once the table is created, your app will be fully functional.

## Test Credentials

- **Regular User**: Name: `HM`, Password: (any password)
- **Admin**: Name: `Meditate123@`, Password: (any password)

## How It Works

- **Submissions**: Users can submit appreciations for team members
- **Admin Approval**: Admins review and approve/reject/delete submissions
- **Leaderboard**: View rankings of most appreciated team members with time filters
- **Branding**: Uses Publicis Sapient's official logo and brand colors

## Data is Now Persistent

All appreciations are stored securely in Supabase and persist across app restarts.

## Need Help?

If you see a "Database not initialized" error:
1. Check that you ran the SQL from the setup screen
2. Verify the `submissions` table exists in Supabase
3. Make sure Row Level Security (RLS) policies are created (the setup SQL includes this)
