// Redis caching disabled as per user request to fix intermittent issues
const TTL_LIST   = 60;
const TTL_SINGLE = 300;
const TTL_MY     = 30;

async function cacheGet(key) {
  return null;
}

async function cacheSet(key, data, ttl) {
  // Do nothing
}

async function cacheInvalidate(...keys) {
  // Do nothing
}

async function bumpListVersion() {
  return 0;
}

async function getListVersion() {
  return 0;
}

async function listKey(version, q, tag, page, limit, includeData, designType = "", pricingType = "", skip = 0) {
  return `components:list:v${version}:q=${q}:tag=${tag}:p=${page}:l=${limit}:s=${skip}:d=${includeData}:design=${designType}:price=${pricingType}`;
}

function componentKey(id) {
  return `components:id:${id}`;
}

async function myListKey(version, userId, q, tag, page, limit, skip = 0) {
  return `components:my:v${version}:u=${userId}:q=${q}:tag=${tag}:p=${page}:l=${limit}:s=${skip}`;
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
