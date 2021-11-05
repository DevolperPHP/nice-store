const redis = require('redis');
const redisClinet = redis.createClient();
const getCacheByKey = (key) => {
    return new Promise((resolve, reject) => {
        redisClinet.get(key, (err, data) => {
            if (err) return null
            resolve(JSON.parse(data));
        });
    })
}
module.exports = getCacheByKey