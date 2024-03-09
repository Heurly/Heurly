# Stage 1
FROM node:20-alpine AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app
COPY package.json pnpm-lock.yaml ./
COPY . .
RUN npm i -g pnpm
RUN pnpm install

# Stage 2
FROM node:20-alpine AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

ARG DATABASE_URL
ENV DATABASE_URL=${DATABASE_URL}
ARG NEXTAUTH_SECRET
ENV NEXTAUTH_SECRET=${NEXTAUTH_SECRET}
ARG NEXTAUTH_URL
ENV NEXTAUTH_URL=${NEXTAUTH_URL}
# Echo NEXTAUTH_URL
RUN echo $NEXTAUTH_URL
# put NextAuth URL in .env.production
RUN echo "NEXTAUTH_URL=$NEXTAUTH_URL" > .env.production

ARG DISCORD_CLIENT_ID
ENV DISCORD_CLIENT_ID=${DISCORD_CLIENT_ID}
ARG DISCORD_CLIENT_SECRET
ENV DISCORD_CLIENT_SECRET=${DISCORD_CLIENT_SECRET}
ARG GOOGLE_ID
ENV GOOGLE_ID=${GOOGLE_ID}
ARG GOOGLE_SECRET
ENV GOOGLE_SECRET=${GOOGLE_SECRET}
ARG BUCKET_KEY_ID
ENV BUCKET_KEY_ID=${BUCKET_KEY_ID}
ARG BUCKET_APP_KEY
ENV BUCKET_APP_KEY=${BUCKET_APP_KEY}
ARG BUCKET_NAME
ENV BUCKET_NAME=${BUCKET_NAME}
RUN NODE_ENV="production"
RUN pnpm add turbo --global
RUN turbo build && pnpm prune --production

# Stage 3
FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV production
RUN addgroup --system --gid 1001 nodejs && adduser --system --uid 1001 nextjs
COPY --from=builder /app/public ./public
RUN mkdir .next
RUN chown nextjs:nodejs .next
COPY --from=builder /app/next.config.mjs ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static
USER nextjs
ENV PORT 3003
ENV HOSTNAME "0.0.0.0"
ENV NEXT_TELEMETRY_DISABLED 1
CMD ["node", "server.js"]