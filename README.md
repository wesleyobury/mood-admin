# MOOD Admin Dashboard

A Next.js admin dashboard for the MOOD Fitness app analytics.

## Tech Stack

- **Next.js 14** (App Router)
- **TypeScript**
- **Tailwind CSS** (dark mode)
- **Recharts** (charts)
- **shadcn/ui-inspired components**

## Features

### 1. Overview
- KPI cards with period comparison
- Time-series charts for DAU, new users, workouts, posts
- Popular mood categories

### 2. Funnels
- Main user funnel (app open → workout completed → post created)
- Workout builder funnel
- Featured workouts funnel
- Step-by-step conversion rates

### 3. Retention
- Cohort retention analysis (daily/weekly/monthly)
- D1/D7/D14/D28 retention rates
- Heatmap visualization

### 4. Features & Content
- Mood selection breakdown
- Equipment usage stats
- Difficulty distribution
- Top exercises completed

### 5. Social
- Posts, likes, comments, follows metrics
- Top engagers (likers, commenters)

### 6. User Explorer
- Search by username/email/user_id
- Activity timeline per user
- Login history and active sessions

### 7. Ops Tools
- Environment info (staging/prod, git SHA)
- Seed featured workouts
- Grant admin access

## Environment Variables

```env
NEXT_PUBLIC_API_BASE_URL=https://mood-fitness-tracker-ai.stage-preview.emergentagent.com/api
NEXT_PUBLIC_ENV_NAME=STAGING
```

For production:
```env
NEXT_PUBLIC_API_BASE_URL=https://your-production-api.com/api
NEXT_PUBLIC_ENV_NAME=PRODUCTION
```

## Development

```bash
# Install dependencies
yarn install

# Run development server
yarn dev

# Build for production
yarn build
```

## Deployment (Vercel)

1. Push this folder to a GitHub repository
2. Connect to Vercel
3. Set environment variables in Vercel dashboard
4. Deploy

## Authentication

Uses the same JWT authentication as the main MOOD app.
Only users in the admin allowlist can access the dashboard.

## CSV Export

Most tables support CSV export with applied filters in the filename.
Max export range: 90 days to avoid large payloads.
