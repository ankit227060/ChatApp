# 🚀 Vercel Backend Deployment Guide

## 📋 Quick Setup for Vercel

### 1. Install Vercel CLI
```bash
npm install -g vercel
```

### 2. Login to Vercel
```bash
vercel login
```

### 3. Deploy to Vercel
```bash
# Navigate to server directory
cd server

# Deploy (first time)
vercel

# Follow prompts:
# - Set up and deploy? Y
# - Which scope? (select your account)
# - Link to existing project? N
# - Project name: your-chat-backend (or any name)
# - Directory: ./ 
# - Override settings? N
```

### 4. Set Environment Variables
After deployment, add these environment variables in Vercel Dashboard:

Go to: **Vercel Dashboard → Your Project → Settings → Environment Variables**

```bash
# Required Variables
MONGODB_URL=mongodb+srv://username:password@cluster.mongodb.net/chatapp
CLIENT_BASE_URL=https://your-frontend.vercel.app
JWT_SECRET=3a9dfd5be35731bd1b1f7915255353bed563495391bce0667534f543799d59fc492eb36230ec826678e2f5876cdc143f407e59ab75860862bdb473bc2aac2b1e

# Optional OAuth Variables
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
GITHUB_CLIENT_ID=your_github_client_id
GITHUB_CLIENT_SECRET=your_github_client_secret
```

### 5. Redeploy with Environment Variables
```bash
vercel --prod
```

## 🌐 Your Backend URLs
- **Development**: `https://your-project-name.vercel.app`
- **Production**: `https://your-project-name.vercel.app`

## 🔄 Update Client Configuration

After deployment, update your client `.env`:
```bash
VITE_SERVER_BASE_URL="https://your-backend-name.vercel.app"
```

## 🚀 Quick Deploy Commands

```bash
# Deploy to preview
vercel

# Deploy to production
vercel --prod

# Check deployment status
vercel ls

# View logs
vercel logs
```

## ⚠️ Important Notes for Vercel

1. **Serverless Functions**: Vercel treats each API route as a serverless function
2. **Cold Starts**: First request might be slower (cold start)
3. **Timeout**: Functions have 30-second timeout limit
4. **File System**: Limited persistent storage (use MongoDB for data)
5. **WebSocket**: Socket.io works with some limitations on serverless

## 🔧 Alternative for Real-time Features

If you encounter WebSocket issues with Vercel, consider:
- **Railway** (better for Socket.io)
- **Render** (persistent servers)
- **Heroku** (traditional hosting)

## ✅ Verification Steps

1. Visit your backend URL
2. Test API endpoints: `https://your-app.vercel.app/api/user`
3. Check logs in Vercel Dashboard
4. Update client with new backend URL
5. Test real-time features

Your backend is ready for Vercel! 🎉