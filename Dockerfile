# Multi-stage Dockerfile for web-nami Next.js monorepo
# Stage 1: Dependencies
FROM node:18-alpine AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app

# Copy package files from monorepo
COPY package*.json ./
COPY turbo.json ./
COPY apps/web-nami/package*.json ./apps/web-nami/
COPY packages/shared/package*.json ./packages/shared/
COPY packages/ui/package*.json ./packages/ui/
COPY packages/bff-core/package*.json ./packages/bff-core/

# Install dependencies
RUN npm ci

# Stage 2: Builder
FROM node:18-alpine AS builder
WORKDIR /app

# Copy dependencies from deps stage
COPY --from=deps /app/node_modules ./node_modules
COPY --from=deps /app/package*.json ./

# Copy all source code
COPY . .

# Build all packages
ENV NEXT_TELEMETRY_DISABLED 1
RUN npx turbo run build --filter=web-nami

# Stage 3: Runner
FROM node:18-alpine AS runner
WORKDIR /app

ENV NODE_ENV production
ENV NEXT_TELEMETRY_DISABLED 1

# Create non-root user
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Copy necessary files from builder
COPY --from=builder /app/apps/web-nami/public ./apps/web-nami/public
COPY --from=builder /app/apps/web-nami/.next ./apps/web-nami/.next
COPY --from=builder /app/apps/web-nami/next.config.js ./apps/web-nami/
COPY --from=builder /app/apps/web-nami/package.json ./apps/web-nami/

# Copy shared packages
COPY --from=builder /app/packages ./packages
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./

# Change ownership to nextjs user
RUN chown -R nextjs:nodejs /app

USER nextjs

EXPOSE 3000

ENV PORT 3000
ENV HOSTNAME "0.0.0.0"

# Start the Next.js application
CMD ["node_modules/.bin/next", "start", "-p", "3000", "apps/web-nami"]
