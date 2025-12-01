# Quick Start Guide

## 1. Configure Environment Variables

Copy the template and fill in your Supabase credentials:

```bash
cp .env.example .env.local
```

Edit `.env.local` with your Supabase project details (from https://app.supabase.com):

```bash
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
DATABASE_URL=postgresql://postgres.[ref]:[password]@aws-0-ap-southeast-1.pooler.supabase.com:6543/postgres
```

> **Important**: Use the **Transaction pooler** connection string (port 6543)

## 2. Push Database Schema to Supabase

```bash
# Option 1: Push schema directly (recommended for development)
npx drizzle-kit push

# Option 2: Generate migration files first, then apply
npx drizzle-kit generate
npx drizzle-kit migrate
```

> **Tip**: Use `push` for rapid development. It applies schema changes directly without creating migration files.

## 3. Enable Google OAuth

1. Go to Supabase Dashboard → **Authentication** → **Providers**
2. Enable **Google** provider
3. Add your Google OAuth credentials
4. Add redirect URL: `https://your-project.supabase.co/auth/v1/callback`

## 4. Start Development Server

```bash
npm run dev
```

Visit `http://localhost:3000/login` to test authentication.

## Next Steps

- Create seed scripts for courses, units, and lessons
- Build the `/learn` dashboard
- Implement the SRS review system
- Add JLPT N5/N4 content (kanji, vocabulary)

See [walkthrough.md](file:///home/nuno/.gemini/antigravity/brain/1a81756a-3f24-46b7-8eaf-deb918b815dc/walkthrough.md) for detailed architecture information.
