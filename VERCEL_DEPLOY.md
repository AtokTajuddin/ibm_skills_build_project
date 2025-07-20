# Virtual Hospital AI - Vercel Deployment Guide

## Quick Deploy to Vercel (5 minutes)

### Prerequisites
- Vercel account (free)
- Git repository

### Step 1: Prepare Environment Variables
Create `.env` file in root directory:
```env
# Database
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_super_secret_jwt_key_here
JWT_REFRESH_SECRET=your_refresh_secret_here

# Firebase (Optional)
FIREBASE_PROJECT_ID=your_firebase_project_id
FIREBASE_PRIVATE_KEY=your_firebase_private_key
FIREBASE_CLIENT_EMAIL=your_firebase_client_email

# Google OAuth (Optional)
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret

# Environment
NODE_ENV=production
```

### Step 2: Deploy via Vercel CLI
```bash
# Install Vercel CLI
npm i -g vercel

# Login to Vercel
vercel login

# Deploy
vercel --prod
```

### Step 3: Deploy via Vercel Dashboard
1. Go to https://vercel.com/dashboard
2. Click "New Project"
3. Import your GitHub repository
4. Framework Preset: "Other"
5. Root Directory: Leave blank
6. Build Command: `cd frontend && npm install && npm run build`
7. Output Directory: `frontend/build`
8. Install Command: `npm install`

### Step 4: Add Environment Variables in Vercel
1. Go to Project Settings > Environment Variables
2. Add all variables from your `.env` file
3. Set Environment to "Production"

### Step 5: Custom Domain (Optional)
1. Go to Project Settings > Domains
2. Add your custom domain
3. Follow DNS configuration instructions

## Security Features Enabled
- ✅ Anti-inspect protection (production only)
- ✅ Developer tools detection
- ✅ Right-click disabled
- ✅ Keyboard shortcuts blocked
- ✅ Text selection disabled
- ✅ Console obfuscation
- ✅ Automatic security logging

## Architecture
```
Root/
├── frontend/          # React app (served by Vercel)
├── backend/           # Node.js API (Vercel Functions)
├── vercel.json       # Vercel configuration
└── .env              # Environment variables
```

## Important Notes
1. MongoDB Atlas is recommended for database
2. Firebase setup is optional but recommended
3. Anti-inspect only activates in production
4. All API routes go through `/api/*`
5. Frontend routes are handled by React Router

## Troubleshooting
- If build fails, check Node.js version compatibility
- Ensure all dependencies are in package.json
- Check environment variables are properly set
- MongoDB connection string must be valid

## Post-Deploy Testing
1. Test user registration/login
2. Test AI virtual doctor chat
3. Test responsive design on mobile
4. Verify security features in production

---
**Deployment Time:** ~5 minutes
**Security Level:** Maximum
**Mobile Ready:** ✅
**Production Ready:** ✅
