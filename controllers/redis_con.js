var redis = require('redis'),
  redisCon = module.exports = {};

redisCon.subClient = redis.createClient();
redisCon.pubClient = redis.createClient();

redisCon.subClient.psubscribe('__keyevent@0__:expired');

redisCon.register = function(input){
  redisCon.pubClient.set(input, 'randomestring', 'EX', 900, redis.print);
  analytics.track({
    userId: 'null',
    containerId: input,
    event: 'start',
    time: new Date()
  });
  console.log('redis register');
};

redisCon.stopCallback = function(cb){
  redisCon.subClient.on('pmessage', function(pattern, channel, expiredKey){
    console.log('key expired: ', expiredKey);
    analytics.track({
      userId: 'null',
      containerId: expiredKey,
      event: 'stop',
      time: new Date()
    });    
    console.log('redis stop');    
    cb(expiredKey);
  });
};
