var redis = require('redis');
var redisCon = {};

redisCon.subClient = redis.createClient();
redisCon.pubClient = redis.createClient();

redisCon.subClient.psubscribe('__keyevent@0__:expired');

redisCon.register = function(input){
  redisCon.pubClient.set(input, 'randomestring', 'EX', 10, redis.print);
};

redisCon.stopCallback = function(cb){
  redisCon.subClient.on('pmessage', function(pattern, channel, expiredKey){
    console.log('key expired: ', expiredKey);
    cb.call(expiredKey);
  });
};

module.exports = redisCon;