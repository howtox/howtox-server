var redis = require('redis'),
  redisCon = module.exports = {};

redisCon.subClient = redis.createClient();
redisCon.pubClient = redis.createClient();

redisCon.subClient.psubscribe('__keyevent@0__:expired');

redisCon.register = function(input){
  redisCon.pubClient.set(input, 'randomestring', 'EX', 900, redis.print);
  analytics.track({
    containerId: input,
    status: 'start',
    time: new Date()
  });
};

redisCon.stopCallback = function(cb){
  redisCon.subClient.on('pmessage', function(pattern, channel, expiredKey){
    console.log('key expired: ', expiredKey);
    analytics.track({
      containerId: expiredKey,
      status: 'stop',
      time: new Date()
    });    
    
    cb(expiredKey);
  });
};
