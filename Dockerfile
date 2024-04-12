##### DEPENDENCIES

FROM node:20-alpine AS deps
RUN apk add --no-cache libc6-compat openssl
WORKDIR /app

# Install Prisma Client - remove if not using Prisma

COPY prisma ./

# Env Values
ARG TIPTAP_TOKEN
ENV TIPTAP_TOKEN=$TIPTAP_TOKEN

# Install dependencies based on the preferred package manager

COPY package.json yarn.lock* package-lock.json* pnpm-lock.yaml\* ./

RUN yarn global add pnpm
RUN pnpm config set "@tiptap-pro:registry" https://registry.tiptap.dev/ && pnpm config set "//registry.tiptap.dev/:_authToken" $TIPTAP_TOKEN && pnpm i

##### BUILDER

FROM node:20-alpine AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

ENV NEXT_TELEMETRY_DISABLED 1
RUN yarn global add pnpm
RUN SKIP_ENV_VALIDATION=1 pnpm run build

##### RUNNER

FROM gcr.io/distroless/nodejs20-debian12 AS runner
WORKDIR /app

ENV NODE_ENV production

COPY --from=builder /app/next.config.mjs ./
COPY --from=builder /app/public ./public
COPY --from=builder /app/package.json ./package.json

COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
COPY --from=builder /app/node_modules ./node_modules

EXPOSE 3000
ENV PORT 3000

CMD ["server.js"]