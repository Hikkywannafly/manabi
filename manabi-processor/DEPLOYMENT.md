# Railway Deployment Guide - Manabi Processor

## Step 1: Push to GitHub

```bash
cd d:\Manabi Project\manabi\manabi-processor

# Initialize git (if not already)
git init

# Add all files
git add .

# Commit
git commit -m "feat: add Python backend for quiz/flashcard generation"

# Create GitHub repo and push
# Option A: Create new repo on GitHub, then:
git remote add origin https://github.com/YOUR_USERNAME/manabi-processor.git
git push -u origin main

# Option B: Push as subfolder of main repo
# (move manabi-processor to separate repo recommended)
```

## Step 2: Deploy to Railway

1. Go to [railway.app](https://railway.app)
2. Click "New Project"
3. Select "Deploy from GitHub repo"
4. Choose your `manabi-processor` repository
5. Railway will auto-detect the Dockerfile

## Step 3: Set Environment Variables in Railway

In Railway dashboard > Your Project > Variables:

```
OPENROUTER_API_KEY=your_openrouter_api_key
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_KEY=your_supabase_service_role_key
API_SECRET_KEY=generate_a_random_secret_key
```

To generate a random secret key:
```bash
openssl rand -base64 32
```

## Step 4: Get Railway URL

After deployment:
1. Go to Settings > Networking
2. Generate a domain (e.g., `manabi-processor.up.railway.app`)
3. Copy the URL

## Step 5: Update Supabase Edge Functions

Add these environment variables in Supabase Dashboard > Edge Functions > Secrets:

```
PYTHON_BACKEND_URL=https://manabi-processor.up.railway.app
BACKEND_API_KEY=same_as_API_SECRET_KEY_above
```

## Step 6: Switch to Gateway Mode

Replace the Edge Function code:

### Option A: Manual (Supabase Dashboard)
1. Go to Edge Functions
2. Edit `generate-content`
3. Replace content with `index.gateway.ts`
4. Deploy

### Option B: CLI
```bash
# Rename files
cd supabase/functions/generate-content
mv index.ts index.legacy.ts
mv index.gateway.ts index.ts

# Deploy
supabase functions deploy generate-content

# Same for flashcards
cd ../generate-flashcards
mv index.ts index.legacy.ts
mv index.gateway.ts index.ts
supabase functions deploy generate-flashcards
```

## Step 7: Test

```bash
# Test Python backend health
curl https://manabi-processor.up.railway.app/health

# Test via frontend
# Upload a file and create quiz/flashcard
```

## Troubleshooting

### Railway build fails
- Check Dockerfile syntax
- Ensure requirements.txt is correct
- Check Railway build logs

### Backend returns 401
- Verify API_SECRET_KEY matches BACKEND_API_KEY

### Backend can't access Supabase
- Check SUPABASE_URL and SUPABASE_SERVICE_KEY
- Ensure service key has correct permissions

### YouTube transcript fails
- Some videos don't have transcripts
- Check if video is public
- Try different language codes

## Estimated Costs

| Service | Free Tier | Estimate |
|---------|-----------|----------|
| Railway | 500 hours/month | ~$5/month after |
| OpenRouter | Pay per use | ~$0.001/request |
| Total | ~$0-5/month | Depends on usage |
