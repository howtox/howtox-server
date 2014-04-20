var redis = require('redis'),
  Q = require('q'),
  controller = module.exports = {};

controller.client = redis.createClient(10310,
  "pub-redis-10310.us-east-1-4.1.ec2.garantiadata.com");
controller.client.auth("8BnAVVcUwskP", function(){
  // console.log("regular client Connected!");
});

//please invoke only after 'ready'
controller.addImage = function(imageName){
  controller.client.sadd('imageSet', imageName);
};

//please invoke only after 'ready'
controller.checkImageExist = function(imageName){
  var dfd = Q.defer();
  controller.client.sismember('imageSet', imageName, function(error, reply){
    if(error){
      dfd.reject(error);
      return;
    }
    dfd.resolve(reply);
  });
  return dfd.promise;
};