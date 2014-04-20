var redis = require('redis'),
  redisCon = module.exports = {};

// redisCon.subClient = redis.createClient();
// redisCon.pubClient = redis.createClient();
//http://stackoverflow.com/questions/7290118/connecting-to-redistogo-through-node-js
redisCon.subClient = redis.createClient(10310,
  "pub-redis-10310.us-east-1-4.1.ec2.garantiadata.com");
redisCon.subClient.auth("8BnAVVcUwskP", function(){
  console.log("subClient Connected!");
});

redisCon.pubClient = redis.createClient(10310,
  "pub-redis-10310.us-east-1-4.1.ec2.garantiadata.com");
redisCon.pubClient.auth("8BnAVVcUwskP", function(){
  console.log("pubClient Connected!");
});

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
