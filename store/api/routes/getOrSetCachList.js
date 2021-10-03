const redis = require('redis');
const redisClinet = redis.createClient();
const getOrSetCachList = (key, exprieDate, cb) => {
    return new Promise((resolve, reject) => {
        redisClinet.lrange(key, 0, -1, async (err, data) => {;
            if (err) return reject(err);
            if (data != null && data.length > 0) return resolve(JSON.parse(...data));
            const newData = await cb();
            if (!newData) return null;
            redisClinet.rpush(key, JSON.stringify(newData));
            resolve(newData)

        })
    })
}
module.exports = getOrSetCachList