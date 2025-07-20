# 🚀 Secure Vercel Deployment Guide
## Virtual Hospital Project

### ⚠️ SECURITY WARNING
**NEVER commit .env files to GitHub!** This guide ensures your API keys remain secure.

## 📋 Pre-Deployment Checklist

### 1. **Environment Variables Setup**
Before deploying, you need to add these environment variables in Vercel Dashboard:

```bash
# Required Environment Variables for Vercel:
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

### 2. **Database Setup (MongoDB Atlas)**
1. Go to [MongoDB Atlas](https://cloud.mongodb.com)
2. Create a free cluster
3. Get your connection string
4. Replace `MONGODB_URI` in Vercel environment variables

### 3. **Vercel Deployment Steps**

#### Option A: GitHub Integration (Recommended)
1. Push your code to GitHub (without .env files!)
2. Go to [Vercel Dashboard](https://vercel.com/dashboard)
3. Import your GitHub repository
4. Add environment variables in Vercel settings
5. Deploy!

#### Option B: Vercel CLI
```bash
# Install Vercel CLI
npm i -g vercel

# Login to Vercel
vercel login

# Deploy (from project root)
vercel

# Add environment variables
vercel env add LLM_API_KEY
vercel env add MONGODB_URI
# ... add all other variables

# Redeploy with environment variables
vercel --prod
```

### 4. **Environment Variables in Vercel Dashboard**
1. Go to your project in Vercel
2. Click "Settings" tab
3. Click "Environment Variables"
4. Add each variable:
   - **Name**: `LLM_API_KEY`
   - **Value**: `your_actual_api_key`
   - **Environment**: Production, Preview, Development

### 5. **Security Best Practices**
- ✅ Use MongoDB Atlas (cloud database)
- ✅ Enable Vercel Edge Functions
- ✅ Set up CORS properly
- ✅ Use HTTPS only
- ✅ Rotate API keys regularly
- ✅ Monitor usage and logs

### 6. **Post-Deployment**
1. Test all functionality
2. Update `FRONTEND_URL` in environment variables
3. Test API endpoints
4. Monitor Vercel function logs

### 🔧 **Build Scripts**
Make sure your `package.json` has proper build scripts:

```json
{
  "scripts": {
    "build": "npm run build:frontend",
    "build:frontend": "cd frontend && npm install && npm run build",
    "start": "node api/index.js"
  }
}
```

### 🚨 **Emergency: If API Keys Get Exposed**
1. Immediately rotate all API keys
2. Update environment variables in Vercel
3. Redeploy the application
4. Check logs for unauthorized usage

### 📞 **Support**
- Vercel Documentation: https://vercel.com/docs
- MongoDB Atlas: https://docs.atlas.mongodb.com
- Firebase: https://firebase.google.com/docs

### 🎯 **Production URL Structure**
- Frontend: `https://your-project.vercel.app`
- API: `https://your-project.vercel.app/api/`
- Health Check: `https://your-project.vercel.app/api/health`
