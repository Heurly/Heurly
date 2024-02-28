# Stage 1
FROM node:20-alpine AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app
COPY package.json package-lock.json ./
COPY . .
RUN npm install

# Stage 2
FROM node:20-alpine AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
ARG SUPABASE_URL
ENV SUPABASE_URL=${SUPABASE_URL}
RUN NODE_ENV=production npm run build && npm prune --production

# Stage 3
FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV production
RUN addgroup --system --gid 1001 nodejs && adduser --system --uid 1001 nextjs
COPY --from=builder /app/public ./public
RUN mkdir .next
RUN chown nextjs:nodejs .next
COPY --from=builder /app/next.config.js ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static
USER nextjs
ENV PORT 3003
ENV HOSTNAME "0.0.0.0"
ENV NEXT_TELEMETRY_DISABLED 1
CMD ["node", "server.js"]