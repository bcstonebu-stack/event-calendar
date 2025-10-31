# Use Node.js 20 LTS as base image
FROM node:20-alpine

# Install OpenSSL for Prisma
RUN apk add --no-cache openssl

# Set working directory inside container
WORKDIR /app

# Copy package files first (for better caching)
COPY package*.json ./
COPY prisma ./prisma/

# Install dependencies
RUN npm ci

# Generate Prisma Client
RUN npm run prisma:generate

# Copy the rest of the application
COPY . .

# Expose port 3001
EXPOSE 3001

# Start the server
CMD ["npm", "start"]
