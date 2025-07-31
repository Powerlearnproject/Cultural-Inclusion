# 🚀 MongoDB Atlas Setup Guide

Quick setup guide for deploying HEVA Cultural Inclusion System with MongoDB Atlas.

## 📋 Quick Setup

### 1. Get MongoDB Atlas Connection String

1. Go to [MongoDB Atlas](https://cloud.mongodb.com)
2. Create free account and cluster
3. Create database user with read/write permissions
4. Get connection string from "Connect" button

### 2. Configure Environment

```bash
# Copy environment template
cp env.example .env

# Edit .env file with your connection string
MONGODB_ATLAS_URI=mongodb+srv://username:password@cluster.mongodb.net/heva-cultural-inclusion?retryWrites=true&w=majority
```

### 3. Test Connection

```bash
npm run setup-atlas
```

### 4. Create Admin User

```bash
npm run create-admin
```

### 5. Start Server

```bash
npm run dev
```

## 🔧 Production Deployment

### Environment Variables

```env
MONGODB_ATLAS_URI=your_atlas_connection_string
NODE_ENV=production
JWT_SECRET=your_secure_jwt_secret
PORT=5002
```

### Health Check

```bash
curl http://localhost:5002/api/health
```

## 🚨 Troubleshooting

- **Connection Issues**: Check network access in MongoDB Atlas
- **Authentication**: Verify username/password in connection string
- **Environment**: Ensure .env file is in backend directory

## 📞 Support

- MongoDB Atlas: https://docs.atlas.mongodb.com/
- Application: Check main README.md 