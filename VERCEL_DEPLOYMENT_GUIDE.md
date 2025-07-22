# Vercel Deployment Guide

This guide will help you deploy your Virtual Hospital project to Vercel with both frontend and serverless backend.

## Prerequisites

1. A Vercel account (sign up at [vercel.com](https://vercel.com))
2. GitHub repository with your code
3. Environment variables ready (see below)

## Step 1: Push Your Code to GitHub

Make sure all your code is committed and pushed to GitHub.

```bash
git add .
git commit -m "Prepare for Vercel deployment"
git push origin master
```

## Step 2: Connect Your Repository in Vercel

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Click "New Project"
3. Import your GitHub repository
4. Configure the project:
   - Framework Preset: Leave as "Other"
   - Root Directory: `./` (default)
   - Build Command: `npm run vercel-build`
   - Output Directory: `frontend/build`

## Step 3: Add Environment Variables

Add the following environment variables:

```
LLM_API_KEY=your_actual_openrouter_api_key
MONGODB_URI=your_mongodb_atlas_connection_string
JWT_SECRET=your_secure_jwt_secret
FIREBASE_API_KEY=your_firebase_api_key
FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
FIREBASE_PROJECT_ID=your-firebase-project-id
FIREBASE_STORAGE_BUCKET=your-project.firebasestorage.app
FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
FIREBASE_APP_ID=your_app_id
GOOGLE_CLIENT_ID=your_google_client_id
FRONTEND_URL=https://your-project-name.vercel.app
```

## Step 4: Deploy

Click "Deploy" and wait for the build to complete.

## Step 5: Verify Deployment

1. Test the frontend: Visit your deployment URL
2. Test the API: Visit `your-deployment-url/api/health`

## Troubleshooting

If you encounter issues:

1. Check the build logs in Vercel
2. Make sure all environment variables are set correctly
3. Try redeploying after making any fixes

## Additional Resources

- [Vercel Documentation](https://vercel.com/docs)
- [Next.js on Vercel](https://vercel.com/docs/frameworks/nextjs)
- [Environment Variables in Vercel](https://vercel.com/docs/concepts/projects/environment-variables)
