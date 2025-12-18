# Setup Guide

Complete setup instructions for Fitness Tracker on different platforms.

## Prerequisites

- Node.js v18 or higher
- npm v9 or higher
- MongoDB 7.0 or higher (local or Atlas)
- Git

## Quick Start

### 1. Clone Repository

```bash
git clone https://github.com/your-username/Fitness-Tracker-Workout-Planner.git
cd Fitness-Tracker-Workout-Planner
```

### 2. Backend Setup

```bash
cd backend
npm install
cp .env.example .env
# Edit .env with your configuration
npm run dev
```

### 3. Frontend Setup

```bash
cd frontend
npm install
npm start
```

## Detailed Setup

### Backend Configuration

1. **Install Dependencies**

```bash
cd backend
npm install
```

2. **Environment Variables**

Create `.env` file in `backend/` directory:

```env
NODE_ENV=development
PORT=5000
MONGODB_URI=mongodb://localhost:27017/fitness-tracker
JWT_SECRET=your-super-secret-jwt-key
JWT_REFRESH_SECRET=your-super-secret-refresh-key
CORS_ORIGIN=http://localhost:3000
```

3. **Start Development Server**

```bash
npm run dev
```

Server will start on `http://localhost:5000`

### Frontend Configuration

1. **Install Dependencies**

```bash
cd frontend
npm install
```

2. **Start Development Server**

```bash
npm start
```

Frontend will start on `http://localhost:3000`

### MongoDB Setup

#### Option 1: Local MongoDB

1. **Install MongoDB**

- **macOS**: `brew install mongodb-community`
- **Windows**: Download from [MongoDB Website](https://www.mongodb.com/try/download/community)
- **Linux**: `sudo apt-get install mongodb`

2. **Start MongoDB**

```bash
# macOS/Linux
mongod

# Windows
net start MongoDB
```

3. **Update .env**

```env
MONGODB_URI=mongodb://localhost:27017/fitness-tracker
```

#### Option 2: MongoDB Atlas (Cloud)

1. Create account at [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a new cluster
3. Get connection string
4. Update `.env`:

```env
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/fitness-tracker
```

## Platform-Specific Instructions

### macOS

1. **Install Homebrew** (if not installed)

```bash
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
```

2. **Install Node.js**

```bash
brew install node@18
```

3. **Install MongoDB**

```bash
brew tap mongodb/brew
brew install mongodb-community
brew services start mongodb-community
```

4. **Follow Quick Start steps**

### Windows

1. **Install Node.js**

- Download from [nodejs.org](https://nodejs.org/)
- Run installer and follow prompts

2. **Install MongoDB**

- Download from [MongoDB Website](https://www.mongodb.com/try/download/community)
- Run installer
- MongoDB will start as a Windows service

3. **Install Git** (if not installed)

- Download from [git-scm.com](https://git-scm.com/download/win)

4. **Follow Quick Start steps**

### Linux (Ubuntu/Debian)

1. **Install Node.js**

```bash
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs
```

2. **Install MongoDB**

```bash
wget -qO - https://www.mongodb.org/static/pgp/server-7.0.asc | sudo apt-key add -
echo "deb [ arch=amd64,arm64 ] https://repo.mongodb.org/apt/ubuntu focal/mongodb-org/7.0 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-7.0.list
sudo apt-get update
sudo apt-get install -y mongodb-org
sudo systemctl start mongod
sudo systemctl enable mongod
```

3. **Follow Quick Start steps**

## Docker Setup

### Using Docker Compose

1. **Create docker-compose.yml** (if not exists)

```yaml
version: '3.8'
services:
  backend:
    build: .
    ports:
      - "5000:5000"
    environment:
      - MONGODB_URI=mongodb://mongo:27017/fitness-tracker
      - JWT_SECRET=your-secret
    depends_on:
      - mongo
  
  mongo:
    image: mongo:7.0
    ports:
      - "27017:27017"
    volumes:
      - mongo-data:/data/db

volumes:
  mongo-data:
```

2. **Start Services**

```bash
docker-compose up -d
```

## Production Deployment

### Environment Variables

Set these in your production environment:

```env
NODE_ENV=production
PORT=5000
MONGODB_URI=your-production-mongodb-uri
JWT_SECRET=strong-random-secret
JWT_REFRESH_SECRET=strong-random-refresh-secret
CORS_ORIGIN=https://your-frontend-domain.com
LOG_LEVEL=info
```

### Security Checklist

- [ ] Change all default secrets
- [ ] Use strong JWT secrets (32+ characters)
- [ ] Enable HTTPS
- [ ] Configure CORS properly
- [ ] Set up rate limiting
- [ ] Enable database authentication
- [ ] Set up monitoring and logging
- [ ] Regular security updates

## Troubleshooting

### Port Already in Use

```bash
# Find process using port
lsof -i :5000  # macOS/Linux
netstat -ano | findstr :5000  # Windows

# Kill process
kill -9 <PID>  # macOS/Linux
taskkill /PID <PID> /F  # Windows
```

### MongoDB Connection Issues

1. Check MongoDB is running
2. Verify connection string in `.env`
3. Check firewall settings
4. For Atlas: Whitelist your IP address

### Module Not Found Errors

```bash
# Delete node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

### Permission Errors (Linux/macOS)

```bash
# Fix npm permissions
sudo chown -R $(whoami) ~/.npm
```

## Next Steps

- Read [API Documentation](./API.md)
- Review [Architecture](./architecture.md)
- Check [Contributing Guide](../CONTRIBUTING.md)
- Set up CI/CD pipeline
- Configure monitoring

## Support

For issues or questions:
- Open a GitHub Issue
- Check existing documentation
- Contact maintainers

