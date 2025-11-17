# 🚀 Backend Deployment Guide

## 📋 Pre-deployment Checklist
- [x] Updated package.json for production
- [x] Created .env.example with required variables
- [x] Updated .gitignore for security
- [x] Created Procfile for Heroku
- [x] Generated secure JWT secret

## 🔐 Environment Variables to Set

Copy these to your hosting platform's environment variables:

```bash
# Database (Required)
MONGODB_URL=mongodb+srv://username:password@cluster.mongodb.net/chatapp

# CORS and Client (Required)
CLIENT_BASE_URL=https://your-frontend-domain.vercel.app

# Security (Required)
JWT_SECRET=3a9dfd5be35731bd1b1f7915255353bed563495391bce0667534f543799d59fc492eb36230ec826678e2f5876cdc143f407e59ab75860862bdb473bc2aac2b1e

# Server (Required)
PORT=3000

# OAuth (Optional - for Google/GitHub login)
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
GITHUB_CLIENT_ID=your_github_client_id
GITHUB_CLIENT_SECRET=your_github_client_secret
```

## 🌐 Deployment Commands

### Heroku
```bash
# 1. Install Heroku CLI and login
heroku login

# 2. Create app
heroku create your-chat-app-backend

# 3. Set environment variables
heroku config:set MONGODB_URL=your_mongodb_connection_string
heroku config:set CLIENT_BASE_URL=https://your-frontend-domain.com
heroku config:set JWT_SECRET=3a9dfd5be35731bd1b1f7915255353bed563495391bce0667534f543799d59fc492eb36230ec826678e2f5876cdc143f407e59ab75860862bdb473bc2aac2b1e

# 4. Deploy
git add .
git commit -m "Prepare backend for production"
git push heroku main
```

### Railway
```bash
# 1. Install Railway CLI
npm install -g @railway/cli

# 2. Login and create project
railway login
railway new

# 3. Deploy
railway up

# 4. Set environment variables in Railway dashboard
```

### Render
```bash
# 1. Connect your GitHub repo to Render
# 2. Create new Web Service
# 3. Set:
#    - Build Command: npm install
#    - Start Command: npm start
#    - Add environment variables in dashboard
```

## ✅ After Deployment

1. **Get your backend URL** (e.g., https://your-app.herokuapp.com)
2. **Update client/.env** with your backend URL:
   ```
   VITE_SERVER_BASE_URL="https://your-app.herokuapp.com"
   ```
3. **Test API endpoints** to ensure everything works
4. **Deploy your frontend** next

## 🔧 Local Development

To run locally with the new configuration:

```bash
# Development mode (uses nodemon)
npm run dev

# Production mode (uses node)
npm start
```

## 🔑 Security Notes

- ✅ JWT Secret is 128 characters (512-bit)
- ✅ Environment variables are not committed to git
- ✅ CORS is configured for specific origins
- ✅ Rate limiting is enabled
- ✅ Helmet security headers are applied

Your backend is now production-ready! 🎉