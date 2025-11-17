# 🚀 Complete Vercel Deployment Guide

## 📋 Deployment Order: Backend First, Then Frontend

### 1. 🔧 **Backend Deployment (Deploy First)**

#### **Method 1: Vercel Dashboard (Recommended)**
1. Go to [vercel.com/new](https://vercel.com/new)
2. **Import Repository**: `ankit227060/ChatApp`
3. **Configure Project**:
   - Project Name: `chatapp-backend`
   - Root Directory: `server`
   - Framework: Other
4. **Add Environment Variables**:
   ```bash
   MONGODB_URL=mongodb+srv://chatuser:User#258@chatcluster.khkba5o.mongodb.net/chatapp?retryWrites=true&w=majority&appName=ChatCluster
   CLIENT_BASE_URL=https://chatapp-frontend.vercel.app
   JWT_SECRET=3a9dfd5be35731bd1b1f7915255353bed563495391bce0667534f543799d59fc492eb36230ec826678e2f5876cdc143f407e59ab75860862bdb473bc2aac2b1e
   NODE_ENV=production
   ```
5. **Deploy**

#### **Method 2: Vercel CLI**
```bash
cd server
vercel login
vercel --prod
```

**Backend will be available at**: `https://chatapp-backend.vercel.app`

---

### 2. 🎨 **Frontend Deployment (Deploy Second)**

#### **Method 1: Vercel Dashboard (Recommended)**
1. Go to [vercel.com/new](https://vercel.com/new)
2. **Import Repository**: `ankit227060/ChatApp` (create new project)
3. **Configure Project**:
   - Project Name: `chatapp-frontend`
   - Root Directory: `client`
   - Framework: Vite (auto-detected)
4. **Add Environment Variables**:
   ```bash
   VITE_SERVER_BASE_URL=https://chatapp-backend.vercel.app
   NODE_ENV=production
   ```
5. **Deploy**

#### **Method 2: Vercel CLI**
```bash
cd client
vercel login
vercel --prod
```

**Frontend will be available at**: `https://chatapp-frontend.vercel.app`

---

### 3. 🔄 **Post-Deployment Configuration**

After both are deployed, update backend environment variables:

**In Backend Vercel Project Settings:**
```bash
CLIENT_BASE_URL=https://chatapp-frontend.vercel.app
SERVER_BASE_URL=https://chatapp-backend.vercel.app
```

**In Frontend Vercel Project Settings:**
```bash
VITE_SERVER_BASE_URL=https://chatapp-backend.vercel.app
```

---

## 📊 **Deployment Summary**

| Service | URL | Status |
|---------|-----|---------|
| Backend API | `https://chatapp-backend.vercel.app` | ✅ Ready |
| Frontend App | `https://chatapp-frontend.vercel.app` | ✅ Ready |
| Database | MongoDB Atlas | ✅ Ready |

---

## 🔐 **Environment Variables Checklist**

### **Backend Environment Variables:**
- ✅ `MONGODB_URL` - Database connection
- ✅ `CLIENT_BASE_URL` - Frontend URL for CORS
- ✅ `JWT_SECRET` - Authentication secret
- ✅ `NODE_ENV=production`
- ⚪ `GOOGLE_CLIENT_ID` (optional)
- ⚪ `GOOGLE_CLIENT_SECRET` (optional)
- ⚪ `GITHUB_CLIENT_ID` (optional)
- ⚪ `GITHUB_CLIENT_SECRET` (optional)

### **Frontend Environment Variables:**
- ✅ `VITE_SERVER_BASE_URL` - Backend API URL
- ✅ `NODE_ENV=production`

---

## 🧪 **Testing After Deployment**

1. **Backend Health Check**: Visit `https://chatapp-backend.vercel.app`
2. **Frontend Load Test**: Visit `https://chatapp-frontend.vercel.app`
3. **API Test**: `https://chatapp-backend.vercel.app/api/user`
4. **Database Connection**: Check logs in Vercel dashboard

---

## 🎯 **Quick Deploy Commands**

```bash
# Deploy Backend
cd server && vercel --prod

# Deploy Frontend  
cd client && vercel --prod
```

---

## ✅ **Deployment Status**

Both backend and frontend are now **production-ready** and configured for seamless Vercel deployment! 🎉

**Next Step**: Deploy backend first, get the URL, then deploy frontend with the backend URL.