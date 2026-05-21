# ============================================
# Multi-Stage Dockerfile für nextjs-supabase-shadcn-starter
# Standalone-Build (Next.js bündelt deps in .next/standalone)
# ============================================

# --- Stage 1: Build ---
FROM node:24-slim AS builder
WORKDIR /app

# pnpm via corepack — pinned (siehe package.json#packageManager) für reproducible builds.
RUN corepack enable
COPY package.json pnpm-lock.yaml ./
RUN corepack prepare $(node -p "require('./package.json').packageManager") --activate \
    && pnpm install --frozen-lockfile

COPY . .

ARG NEXT_PUBLIC_SUPABASE_URL
ARG NEXT_PUBLIC_SUPABASE_ANON_KEY
ARG NEXT_PUBLIC_APP_URL

ENV NEXT_PUBLIC_SUPABASE_URL=$NEXT_PUBLIC_SUPABASE_URL
ENV NEXT_PUBLIC_SUPABASE_ANON_KEY=$NEXT_PUBLIC_SUPABASE_ANON_KEY
ENV NEXT_PUBLIC_APP_URL=$NEXT_PUBLIC_APP_URL
ENV NEXT_TELEMETRY_DISABLED=1

# Fail fast wenn Pflicht-Env fehlt — sonst landen `undefined`-Werte im Server-Bundle.
RUN node scripts/check-env.mjs \
    && pnpm build

# --- Stage 2: Production Runner ---
FROM node:24-slim AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV PORT=3000
ENV HOSTNAME=0.0.0.0

RUN addgroup --system --gid 1001 nodejs \
    && adduser --system --uid 1001 nextjs

# Standalone-Output bringt alle deps mit — kein separater deps-Layer nötig.
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static
COPY --from=builder --chown=nextjs:nodejs /app/public ./public

USER nextjs

EXPOSE 3000

CMD ["node", "server.js"]
