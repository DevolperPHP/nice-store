const redis = require('redis');
const redisClinet = redis.createClient();
const getOrsetCachList = (key, exprieDate, cb) => {
    return new Promise((resolve, reject) => {
        redisClinet.lrange(key, 0, -1, async (err, data) => {
            if (err) return reject(err);
            console.log(JSON.parse(...data).length)
            if (data != null && data.length >0) return resolve(JSON.parse(...data));
            const newData = await cb();
            if (!newData) return null;
            redisClinet.rpush(key, JSON.stringify(newData));
            redisClinet.expire(key, exprieDate)
            resolve(newData)
        })
    })
}
module.exports = getOrsetCachList