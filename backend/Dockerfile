# Backend Dockerfile for Railway (Node.js + Express)
FROM node:20-alpine

WORKDIR /app

# Copy dependency manifests for better layer caching
COPY package.json package-lock.json* ./

# Install production dependencies only
RUN npm ci --omit=dev

# Copy application source
COPY . .

# Railway sets PORT; default for local
ENV NODE_ENV=production
EXPOSE 5001

CMD ["node", "src/index.js"]
