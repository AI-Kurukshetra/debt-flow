# Deployment Plan: Vercel

This plan outlines the steps for deploying the DebtFlow project to Vercel.

## Objective
Deploy the DebtFlow Next.js application to Vercel, ensuring all environment variables are correctly configured.

## Key Files & Context
- Project: Next.js (App Router)
- Backend: Supabase
- Environment: `.env.local`

## Implementation Steps

1. **Link Project to Vercel**
   - Execute `vercel link --yes` to initialize the Vercel project configuration.

2. **Configure Environment Variables**
   - Add the following variables to Vercel (Production and Preview scopes):
     - `NEXT_PUBLIC_SUPABASE_URL`: `https://nsazjmpesdkacjomholk.supabase.co`
     - `NEXT_PUBLIC_SUPABASE_ANON_KEY`: (from `.env.local`)
     - `SUPABASE_SERVICE_ROLE_KEY`: (from `.env.local`)
     - `SUPABASE_DB_PASSWORD`: (from `.env.local`)

3. **Deploy to Vercel**
   - Run `vercel --prod` to perform a production deployment.

## Verification & Testing
- Visit the Vercel deployment URL.
- Verify that the application loads and correctly connects to Supabase (e.g., check if data is fetched or login works).
- Review Vercel logs for any build or runtime errors.
