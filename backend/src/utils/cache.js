const { getRedisClient } = require("../config/redis");

// ─── TTLs (seconds) ──────────────────────────────────────────────────────────
const TTL_LIST   = Number(process.env.CACHE_TTL_LIST)   || 60;   // public component list
const TTL_SINGLE = Number(process.env.CACHE_TTL_SINGLE) || 300;  // individual component
const TTL_MY     = Number(process.env.CACHE_TTL_MY)     || 30;   // per-user component list

// ─── Version-stamp key ───────────────────────────────────────────────────────
// Bumping this counter makes ALL old list cache keys stale without scanning.
const LIST_VERSION_KEY = "components:list:version";

// ─── Public helpers ───────────────────────────────────────────────────────────

/**
 * Read a cached value. Returns the parsed object or null on miss/error.
 * @param {string} key
 * @returns {Promise<any|null>}
 */
async function cacheGet(key) {
  const client = getRedisClient();
  if (!client) return null;
  try {
    const raw = await client.get(key);
    if (raw === null || raw === undefined) return null;
    // Upstash already deserialises JSON for us when stored via set()
    return raw;
  } catch (err) {
    console.warn(`[cache] GET error for key "${key}":`, err.message);
    return null;
  }
}

/**
 * Store a value in cache.
 * @param {string} key
 * @param {any} data
 * @param {number} ttl  seconds
 */
async function cacheSet(key, data, ttl) {
  const client = getRedisClient();
  if (!client) return;
  try {
    await client.set(key, data, { ex: ttl });
  } catch (err) {
    console.warn(`[cache] SET error for key "${key}":`, err.message);
  }
}

/**
 * Delete one or more exact cache keys.
 * @param {...string} keys
 */
async function cacheInvalidate(...keys) {
  const client = getRedisClient();
  if (!client) return;
  try {
    await Promise.all(keys.map((k) => client.del(k)));
  } catch (err) {
    console.warn("[cache] DEL error:", err.message);
  }
}

/**
 * Increment the list-version counter so all existing list cache entries
 * become unreachable (they embed the old version number in their key).
 * @returns {Promise<number>} new version number
 */
async function bumpListVersion() {
  const client = getRedisClient();
  if (!client) return 0;
  try {
    return await client.incr(LIST_VERSION_KEY);
  } catch (err) {
    console.warn("[cache] INCR error:", err.message);
    return 0;
  }
}

/**
 * Read the current list-version counter (defaults to 0).
 * @returns {Promise<number>}
 */
async function getListVersion() {
  const client = getRedisClient();
  if (!client) return 0;
  try {
    const v = await client.get(LIST_VERSION_KEY);
    return Number(v) || 0;
  } catch (err) {
    console.warn("[cache] version GET error:", err.message);
    return 0;
  }
}

// ─── Key builders ─────────────────────────────────────────────────────────────

/**
 * Build a versioned cache key for the public component list.
 */
async function listKey(version, q, tag, page, limit, includeData) {
  return `components:list:v${version}:q=${q}:tag=${tag}:p=${page}:l=${limit}:d=${includeData}`;
}

/**
 * Build a cache key for a single component by MongoDB ID.
 */
function componentKey(id) {
  return `components:id:${id}`;
}

/**
 * Build a versioned cache key for a user's own component list.
 */
async function myListKey(version, userId, q, tag, page, limit) {
  return `components:my:v${version}:u=${userId}:q=${q}:tag=${tag}:p=${page}:l=${limit}`;
}

module.exports = {
  cacheGet,
  cacheSet,
  cacheInvalidate,
  bumpListVersion,
  getListVersion,
  listKey,
  componentKey,
  myListKey,
  TTL_LIST,
  TTL_SINGLE,
  TTL_MY,
};
