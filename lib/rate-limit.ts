import Redis from 'ioredis'

export interface RateLimitConfig {
    limit: number
    windowSeconds: number
}

export interface RateLimitResult {
    success: boolean
    remaining: number
    resetAt: number
    limited: boolean
}

// In-Memory Fallback
interface RateLimitEntry {
    count: number
    resetAt: number
}
const rateLimitStore = new Map<string, RateLimitEntry>()

setInterval(() => {
    const now = Date.now()
    for (const [key, entry] of rateLimitStore.entries()) {
        if (entry.resetAt < now) rateLimitStore.delete(key)
    }
}, 5 * 60 * 1000)

function checkRateLimitMemory(identifier: string, config: RateLimitConfig): RateLimitResult {
    const now = Date.now()
    const windowMs = config.windowSeconds * 1000
    const key = `ratelimit:${identifier}`

    let entry = rateLimitStore.get(key)
    if (!entry || entry.resetAt < now) {
        entry = { count: 1, resetAt: now + windowMs }
        rateLimitStore.set(key, entry)
        return { success: true, remaining: config.limit - 1, resetAt: entry.resetAt, limited: false }
    }

    if (entry.count >= config.limit) {
        return { success: false, remaining: 0, resetAt: entry.resetAt, limited: true }
    }

    entry.count++
    rateLimitStore.set(key, entry)
    return { success: true, remaining: config.limit - entry.count, resetAt: entry.resetAt, limited: false }
}

let redisClient: Redis | null = null

function getRedisClient(): Redis | null {
    if (redisClient) return redisClient
    const url = process.env.REDIS_URL
    if (url) {
        try {
            redisClient = new Redis(url, { maxRetriesPerRequest: 2 })
            redisClient.on('error', () => { })
            return redisClient
        } catch {
            return null
        }
    }
    const host = process.env.REDIS_HOST
    const password = process.env.REDIS_PASSWORD
    if (!host) return null
    const port = parseInt(process.env.REDIS_PORT ?? '6379', 10)
    try {
        redisClient = new Redis({
            host,
            port: Number.isNaN(port) ? 6379 : port,
            ...(password ? { password } : {}),
            maxRetriesPerRequest: 2,
        })
        redisClient.on('error', () => { })
        return redisClient
    } catch {
        return null
    }
}

const LUA_INCR_EXPIRE = `
  local c = redis.call('INCR', KEYS[1])
  if c == 1 then redis.call('EXPIRE', KEYS[1], ARGV[1]) end
  local ttl = redis.call('PTTL', KEYS[1])
  return {c, ttl}
`

async function checkRateLimitRedis(identifier: string, config: RateLimitConfig): Promise<RateLimitResult> {
    const redis = getRedisClient()
    if (!redis) return checkRateLimitMemory(identifier, config)

    const key = `ratelimit:${identifier}`
    try {
        const res = (await redis.eval(LUA_INCR_EXPIRE, 1, key, String(config.windowSeconds))) as [number, number]
        const count = Number(res[0])
        const ttlMs = Number(res[1])
        const resetAt = Date.now() + (ttlMs > 0 ? ttlMs : config.windowSeconds * 1000)
        const limited = count > config.limit
        return { success: !limited, remaining: limited ? 0 : Math.max(0, config.limit - count), resetAt, limited }
    } catch {
        return checkRateLimitMemory(identifier, config)
    }
}

export async function checkRateLimit(identifier: string, config: RateLimitConfig): Promise<RateLimitResult> {
    if (getRedisClient()) return checkRateLimitRedis(identifier, config)
    return Promise.resolve(checkRateLimitMemory(identifier, config))
}

export const RATE_LIMITS = {
    webhook: { limit: 100, windowSeconds: 60 } as RateLimitConfig,
    api: { limit: 1000, windowSeconds: 60 } as RateLimitConfig,
    auth: { limit: 10, windowSeconds: 60 } as RateLimitConfig,
    authPerEmail: { limit: 5, windowSeconds: 300 } as RateLimitConfig,
    authPerIp: { limit: 20, windowSeconds: 300 } as RateLimitConfig,
} as const
