# Vercel Deployment Guide

## Required Environment Variables

To deploy this application on Vercel, you **must** set the following environment variables in your Vercel project settings:

### 1. Navigate to Vercel Project Settings

1. Go to your project on Vercel dashboard
2. Click on **Settings** tab
3. Click on **Environment Variables** in the left sidebar

### 2. Add Required Variables

Add these environment variables for **Production**, **Preview**, and **Development** environments:

| Variable Name | Value | Description |
|---------------|-------|-------------|
| `NEXT_PUBLIC_SUPABASE_URL` | `https://uqefhazkjasdhaasbrtd.supabase.co` | Your Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...` | Your Supabase anonymous key |
| `SUPABASE_SERVICE_ROLE_KEY` | `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...` | Your Supabase service role key (keep secret!) |

**Important:**
- The `NEXT_PUBLIC_*` variables are exposed to the browser
- The `SUPABASE_SERVICE_ROLE_KEY` should be kept private (only used server-side)
- All three environments (Production, Preview, Development) need these variables

### 3. Get Your Supabase Credentials

If you don't have these values:

1. Go to [Supabase Dashboard](https://app.supabase.com)
2. Select your project
3. Go to **Settings** → **API**
4. Copy:
   - **Project URL** → `NEXT_PUBLIC_SUPABASE_URL`
   - **anon public** key → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - **service_role** key → `SUPABASE_SERVICE_ROLE_KEY`

### 4. Redeploy

After adding the environment variables:

1. Go to **Deployments** tab
2. Click the three dots (`...`) on the latest deployment
3. Click **Redeploy**
4. Select **Use existing Build Cache** (optional)
5. Click **Redeploy**

## Troubleshooting

### MIDDLEWARE_INVOCATION_FAILED Error

This error typically means:
- ✗ Environment variables are not set in Vercel
- ✗ Environment variables are set for wrong environment (check all three)
- ✗ Supabase URL or keys are incorrect

**Solution:**
1. Verify all environment variables are set correctly
2. Check Vercel deployment logs for specific error messages
3. Try redeploying after setting variables

### Check Deployment Logs

To see detailed error logs:
1. Go to your deployment in Vercel
2. Click on **Functions** tab
3. Click on **middleware** function
4. View the logs for specific error messages

### Test Locally First

Before deploying, test locally:
```bash
# Make sure .env.local has all required variables
npm run build
npm run start
```

Visit `http://localhost:3000` and test authentication flows.

## Next Steps After Deployment

1. Test the login page: `https://your-domain.vercel.app/login`
2. Test registration: `https://your-domain.vercel.app/register`
3. Verify authentication redirects work correctly
4. Check Vercel function logs for any runtime errors

## Support

If issues persist:
- Check Vercel deployment logs
- Check Supabase logs in your Supabase dashboard
- Verify database tables exist and have correct permissions
