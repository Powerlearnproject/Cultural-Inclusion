# 🚀 Deployment Guide - HEVA Cultural Inclusion System

This guide will help you deploy the HEVA Cultural Inclusion Data Management System to production using MongoDB Atlas.

## 📋 Prerequisites

- Node.js 16+ installed
- MongoDB Atlas account (free tier available)
- Git repository access
- Deployment platform account (Heroku, Railway, Render, etc.)

## 🗄️ MongoDB Atlas Setup

### 1. Create MongoDB Atlas Account

1. Go to [MongoDB Atlas](https://cloud.mongodb.com)
2. Click "Try Free" or "Sign Up"
3. Create your account and verify your email

### 2. Create a Cluster

1. Click "Build a Database"
2. Choose "FREE" tier (M0)
3. Select your preferred cloud provider and region
4. Click "Create"

### 3. Set Up Database Access

1. Go to "Database Access" in the left sidebar
2. Click "Add New Database User"
3. Choose "Password" authentication
4. Create a username and strong password
5. Select "Read and write to any database"
6. Click "Add User"

### 4. Set Up Network Access

1. Go to "Network Access" in the left sidebar
2. Click "Add IP Address"
3. For development: Click "Allow Access from Anywhere" (0.0.0.0/0)
4. For production: Add your deployment platform's IP ranges
5. Click "Confirm"

### 5. Get Your Connection String

1. Go to "Database" in the left sidebar
2. Click "Connect"
3. Choose "Connect your application"
4. Copy the connection string
5. Replace `<password>` with your database user password
6. Replace `<database>` with your desired database name (e.g., `heva-cultural-inclusion`)

## 🔧 Local Development Setup

### 1. Clone and Install

```bash
git clone <your-repository-url>
cd Cultural-Inclusion/backend
npm install
```

### 2. Set Up Environment Variables

Create a `.env` file in the backend directory:

```bash
# Copy the example file
cp env.example .env
```

Edit `.env` with your MongoDB Atlas connection string:

```env
MONGODB_ATLAS_URI=mongodb+srv://yourusername:yourpassword@yourcluster.mongodb.net/heva-cultural-inclusion?retryWrites=true&w=majority
PORT=5002
NODE_ENV=development
JWT_SECRET=your-super-secure-jwt-secret-key
```

### 3. Test Connection

```bash
npm run setup-atlas
```

Or manually test:

```bash
npm run test-connection
```

### 4. Create Admin User

```bash
npm run create-admin
```

### 5. Start Development Server

```bash
npm run dev
```

## 🌐 Production Deployment

### Option 1: Heroku Deployment

#### 1. Install Heroku CLI

```bash
# macOS
brew install heroku/brew/heroku

# Windows
# Download from https://devcenter.heroku.com/articles/heroku-cli
```

#### 2. Login and Create App

```bash
heroku login
heroku create heva-cultural-inclusion
```

#### 3. Set Environment Variables

```bash
heroku config:set MONGODB_ATLAS_URI="your-mongodb-atlas-connection-string"
heroku config:set NODE_ENV="production"
heroku config:set JWT_SECRET="your-production-jwt-secret"
heroku config:set PORT="5002"
```

#### 4. Deploy

```bash
git add .
git commit -m "Deploy to Heroku"
git push heroku main
```

#### 5. Create Admin User

```bash
heroku run npm run create-admin
```

### Option 2: Railway Deployment

#### 1. Connect Repository

1. Go to [Railway](https://railway.app)
2. Connect your GitHub repository
3. Select the backend directory

#### 2. Set Environment Variables

In Railway dashboard:
- `MONGODB_ATLAS_URI`: Your MongoDB Atlas connection string
- `NODE_ENV`: production
- `JWT_SECRET`: Your production JWT secret
- `PORT`: 5002

#### 3. Deploy

Railway will automatically deploy when you push to your repository.

### Option 3: Render Deployment

#### 1. Connect Repository

1. Go to [Render](https://render.com)
2. Connect your GitHub repository
3. Create a new Web Service

#### 2. Configure Service

- **Name**: heva-cultural-inclusion-backend
- **Environment**: Node
- **Build Command**: `npm install`
- **Start Command**: `npm start`
- **Root Directory**: `backend`

#### 3. Set Environment Variables

- `MONGODB_ATLAS_URI`: Your MongoDB Atlas connection string
- `NODE_ENV`: production
- `JWT_SECRET`: Your production JWT secret
- `PORT`: 5002

## 🔒 Security Best Practices

### 1. Environment Variables

- Never commit `.env` files to version control
- Use strong, unique JWT secrets
- Rotate secrets regularly

### 2. MongoDB Atlas Security

- Use strong database passwords
- Enable MongoDB Atlas security features
- Restrict network access to deployment IPs
- Enable MongoDB Atlas monitoring

### 3. Application Security

- Enable CORS for your frontend domain only
- Use HTTPS in production
- Implement rate limiting
- Add security headers

## 📊 Monitoring and Maintenance

### 1. Health Checks

Your application includes a health check endpoint:

```bash
curl https://your-app-url/api/health
```

### 2. MongoDB Atlas Monitoring

- Monitor database performance in MongoDB Atlas dashboard
- Set up alerts for connection issues
- Monitor storage usage

### 3. Application Logs

Check your deployment platform's logs for:
- Application errors
- Database connection issues
- Performance problems

## 🚨 Troubleshooting

### Common Issues

#### 1. Connection String Issues

**Error**: `MongoParseError: Invalid connection string`

**Solution**: 
- Check your connection string format
- Ensure password is URL-encoded
- Verify database name is correct

#### 2. Network Access Issues

**Error**: `MongoServerSelectionError: connect ECONNREFUSED`

**Solution**:
- Add your deployment platform's IP to MongoDB Atlas Network Access
- For development, allow access from anywhere (0.0.0.0/0)

#### 3. Authentication Issues

**Error**: `MongoError: Authentication failed`

**Solution**:
- Check username and password
- Ensure database user has correct permissions
- Verify database name in connection string

#### 4. Environment Variable Issues

**Error**: `MONGODB_ATLAS_URI is not defined`

**Solution**:
- Check your `.env` file exists
- Verify environment variable names
- Ensure no spaces around `=` in `.env` file

## 📈 Performance Optimization

### 1. MongoDB Atlas Optimization

- Use appropriate cluster size for your needs
- Enable MongoDB Atlas performance advisor
- Monitor slow queries
- Use indexes for frequently queried fields

### 2. Application Optimization

- Implement connection pooling
- Use caching where appropriate
- Optimize database queries
- Monitor application performance

## 🔄 Backup and Recovery

### 1. MongoDB Atlas Backups

MongoDB Atlas provides automatic backups:
- Daily backups for M0 clusters
- Point-in-time recovery
- Automated backup scheduling

### 2. Application Data Backup

- Export data regularly using the export features
- Store backups in secure locations
- Test recovery procedures

## 📞 Support

For issues with:
- **MongoDB Atlas**: Check [MongoDB Atlas Documentation](https://docs.atlas.mongodb.com/)
- **Application**: Check the troubleshooting section above
- **Deployment**: Check your deployment platform's documentation

## 🎯 Next Steps

After successful deployment:

1. **Test all features** on the production environment
2. **Set up monitoring** and alerts
3. **Configure backups** and recovery procedures
4. **Document deployment** procedures for your team
5. **Plan scaling** strategies for growth

---

**🎉 Congratulations!** Your HEVA Cultural Inclusion System is now deployed and ready for production use. 