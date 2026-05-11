# ---------- Build Stage ----------
FROM node:20-alpine AS builder

WORKDIR /app

# Copy package files first for better caching
COPY package*.json ./

# Install dependencies
RUN npm ci

# Copy source code
COPY . .

# Build Next.js app
RUN npm run build

# ---------- Production Stage ----------
FROM node:20-alpine AS runner

WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

# Copy package files
COPY --from=builder /app/package*.json ./

# Install production dependencies only
RUN npm ci --omit=dev

# Copy built app
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public

# If using App Router, Next.js may also need these files
COPY --from=builder /app/next.config.* ./
COPY --from=builder /app/package.json ./

EXPOSE 3000

CMD ["npm", "start"]