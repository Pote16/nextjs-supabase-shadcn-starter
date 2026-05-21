import Redis from 'ioredis';

import { env, IS_PROD } from '@/lib/env';

export interface RateLimitConfig {
    limit: number;
    windowSeconds: number;
}

export interface RateLimitResult {
    success: boolean;
    remaining: number;
    resetAt: number;
    limited: boolean;
}

// ---------- In-Memory Store ----------

interface RateLimitEntry {
    count: number;
    resetAt: number;
}

const MEMORY_STORE_MAX_ENTRIES = 50_000;
const MEMORY_CLEANUP_INTERVAL_MS = 60_000;

const memoryStore = new Map<string, RateLimitEntry>();

function memoryCleanup() {
    const now = Date.now();
    for (const [key, entry] of memoryStore) {
        if (entry.resetAt < now) memoryStore.delete(key);
    }
    // LRU-Fallback: bei dauerhaftem Druck über dem Limit älteste Einträge kappen.
    if (memoryStore.size > MEMORY_STORE_MAX_ENTRIES) {
        const overflow = memoryStore.size - MEMORY_STORE_MAX_ENTRIES;
        const iterator = memoryStore.keys();
        for (let i = 0; i < overflow; i++) {
            const next = iterator.next();
            if (next.done) break;
            memoryStore.delete(next.value);
        }
    }
}

// .unref() — der Timer hält den Prozess nicht am Leben (wichtig für Tests / Build).
const memoryCleanupTimer = setInterval(memoryCleanup, MEMORY_CLEANUP_INTERVAL_MS);
if (typeof memoryCleanupTimer.unref === 'function') memoryCleanupTimer.unref();

function checkMemory(identifier: string, config: RateLimitConfig): RateLimitResult {
    const now = Date.now();
    const windowMs = config.windowSeconds * 1000;
    const key = `ratelimit:${identifier}`;

    const existing = memoryStore.get(key);
    if (!existing || existing.resetAt < now) {
        const entry: RateLimitEntry = { count: 1, resetAt: now + windowMs };
        memoryStore.set(key, entry);
        return {
            success: true,
            remaining: config.limit - 1,
            resetAt: entry.resetAt,
            limited: false,
        };
    }

    if (existing.count >= config.limit) {
        return { success: false, remaining: 0, resetAt: existing.resetAt, limited: true };
    }

    existing.count++;
    return {
        success: true,
        remaining: config.limit - existing.count,
        resetAt: existing.resetAt,
        limited: false,
    };
}

// ---------- Redis Store ----------

let redisClient: Redis | null = null;
let redisInitTried = false;

function getRedisClient(): Redis | null {
    if (redisClient) return redisClient;
    if (redisInitTried) return null;
    redisInitTried = true;

    const onError = (err: Error) => {
        console.error('[rate-limit] Redis error:', err.message);
    };

    try {
        if (env.REDIS_URL) {
            redisClient = new Redis(env.REDIS_URL, { maxRetriesPerRequest: 2, lazyConnect: false });
        } else if (env.REDIS_HOST) {
            redisClient = new Redis({
                host: env.REDIS_HOST,
                port: env.REDIS_PORT ? parseInt(env.REDIS_PORT, 10) : 6379,
                ...(env.REDIS_PASSWORD ? { password: env.REDIS_PASSWORD } : {}),
                maxRetriesPerRequest: 2,
            });
        } else {
            if (IS_PROD) {
                console.warn(
                    '[rate-limit] Production läuft ohne Redis — In-Memory-Fallback ist NICHT cluster-safe.',
                );
            }
            return null;
        }
        redisClient.on('error', onError);
        return redisClient;
    } catch (err) {
        console.error('[rate-limit] Redis init failed:', (err as Error).message);
        return null;
    }
}

const LUA_INCR_EXPIRE = `
  local c = redis.call('INCR', KEYS[1])
  if c == 1 then redis.call('EXPIRE', KEYS[1], ARGV[1]) end
  local ttl = redis.call('PTTL', KEYS[1])
  return {c, ttl}
`;

async function checkRedis(identifier: string, config: RateLimitConfig): Promise<RateLimitResult> {
    const redis = getRedisClient();
    if (!redis) return checkMemory(identifier, config);

    const key = `ratelimit:${identifier}`;
    try {
        const result = (await redis.eval(
            LUA_INCR_EXPIRE,
            1,
            key,
            String(config.windowSeconds),
        )) as [number, number];
        const count = Number(result[0]);
        const ttlMs = Number(result[1]);
        const resetAt = Date.now() + (ttlMs > 0 ? ttlMs : config.windowSeconds * 1000);
        const limited = count > config.limit;
        return {
            success: !limited,
            remaining: limited ? 0 : Math.max(0, config.limit - count),
            resetAt,
            limited,
        };
    } catch (err) {
        console.error(
            '[rate-limit] Redis check failed, falling back to memory:',
            (err as Error).message,
        );
        return checkMemory(identifier, config);
    }
}

// ---------- Public API ----------

export async function checkRateLimit(
    identifier: string,
    config: RateLimitConfig,
): Promise<RateLimitResult> {
    if (env.REDIS_URL || env.REDIS_HOST) {
        return checkRedis(identifier, config);
    }
    return checkMemory(identifier, config);
}

export const RATE_LIMITS = {
    webhook: { limit: 100, windowSeconds: 60 },
    api: { limit: 1000, windowSeconds: 60 },
    authPerIp: { limit: 10, windowSeconds: 60 },
    authPerIpExtended: { limit: 20, windowSeconds: 300 },
    authPerEmail: { limit: 5, windowSeconds: 300 },
} as const satisfies Record<string, RateLimitConfig>;
