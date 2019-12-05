const redis = require('redis');
const adapter = require('socket.io-redis');

const {
  REDIS_HOST,
  REDIS_PORT,
  REDIS_PASSWORD
} = process.env;

const pub = redis.createClient(REDIS_PORT, REDIS_HOST, { auth_pass: REDIS_PASSWORD });
const sub = redis.createClient(REDIS_PORT, REDIS_HOST, { auth_pass: REDIS_PASSWORD });

module.exports = adapter({ pubClient: pub, subClient: sub });
