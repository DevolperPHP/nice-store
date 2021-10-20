const redis = require('redis');
const redisClinet = redis.createClient();
const getOrSetCach = (key, exprieDate, cb) => {
    return new Promise((resolve, reject) => {
        redisClinet.get(key, async (err, data) => {;
            if (err) return reject(err);
            if (data != null) return resolve(JSON.parse(data));
            const newData = await cb();
            if (!newData) return null;
            
            redisClinet.setex(key, exprieDate ,JSON.stringify(newData));
            resolve(newData)
        })
    })
}
module.exports = getOrSetCach