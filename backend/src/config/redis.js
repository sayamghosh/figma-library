const { Redis } = require("@upstash/redis");

let redis = null;

function getRedisClient() {
  if (redis) return redis;

  const url = process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN;

  if (!url || !token) {
    return null;
  }

  try {
    redis = new Redis({ url, token });
  } catch (err) {
    console.warn("⚠️  Redis init failed:", err.message);
    redis = null;
  }

  return redis;
}

module.exports = { getRedisClient };
