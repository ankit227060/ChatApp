# 🚀 Frontend Vercel Deployment Guide

## 📋 Vercel Configuration

### Build Settings:
- **Framework Preset**: Vite
- **Root Directory**: `client`
- **Build Command**: `npm run build`
- **Output Directory**: `dist`
- **Install Command**: `npm install`
- **Development Command**: `npm run dev`

## 🔐 Environment Variables

Set these in Vercel Dashboard:

```bash
# Backend API URL (replace with your actual backend URL)
VITE_SERVER_BASE_URL=https://your-backend-name.vercel.app

# Environment
NODE_ENV=production
```

## 🚀 Deployment Methods

### Method 1: Vercel Dashboard (Recommended)

1. **Go to [vercel.com/new](https://vercel.com/new)**
2. **Import Repository**: `ankit227060/ChatApp`
3. **Configure Project**:
   - Project Name: `chat-frontend`
   - Framework: Vite
   - Root Directory: `client`
4. **Add Environment Variables**
5. **Deploy**

### Method 2: Vercel CLI

```bash
# Navigate to client directory
cd client

# Login to Vercel
vercel login

# Deploy
vercel

# Deploy to production
vercel --prod
```

## ✅ After Deployment

1. **Get frontend URL**: `https://chat-frontend-xxx.vercel.app`
2. **Update backend CORS**: Add frontend URL to `CLIENT_BASE_URL`
3. **Test the application**

## 🔄 Update Backend Environment

After frontend deployment, update your backend environment variables:

```bash
CLIENT_BASE_URL=https://your-frontend-name.vercel.app
```

Your frontend is now deployment-ready! 🎉