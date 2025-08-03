# Use Node.js 18 slim base image for minimal size
FROM node:18-slim

# Set working directory
WORKDIR /app

# Copy backend package.json and install dependencies
COPY backend/package.json .
RUN npm install

# Copy frontend package.json and install dependencies
COPY frontend/package.json ./frontend/
RUN cd frontend && npm install

# Copy all application code
COPY . .

# Build React frontend
RUN cd frontend && npm run build

# Expose port for Express server (default 5000)
EXPOSE 5000

# Set environment variables
ENV NODE_ENV=production
ENV PORT=5000

# Start the backend server
CMD ["node", "backend/index.js"]
