var path = require('path'),
  _ = require('underscore'),
  TrackContainers = module.exports = {},
  dockerUtils = require('./docker_utils'),
  db = require('../config/db').containers; //cached

//kills container after 15 minutes
var stopAll = function(docs){
  _.each(docs, function(doc){
    //   analytics.track({
    //     userId: 'null',
    //     containerId: expiredKey,
    //     event: 'stop',
    //     time: new Date()
    //   });
    dockerUtils.stopOne(doc.containerId).then(function(output){
      console.log('Container stop success', output);
      db.remove(doc, {}, function (err, numRemoved) {
        // console.log('numRemoved', numRemoved);
      });
    });
  });
};

var findExpired = function(){
  var lifespan = 1000 * APP_CONFIG.containerLifespan; //in ms
  var cutoffTime = (new Date().getTime()) - lifespan;

  // find containers that are older than allowed time and then kill them
  db.find({ "createdAt": {$lt: cutoffTime} }, function (err, docs) {
    stopAll(docs);
  });
};

TrackContainers.register = function(input){
  db.insert({
    createdAt: new Date().getTime(),
    containerId: input
  }, function(error, newDoc){
    if(error) {
      return console.log('Error in db insertion', error);
    }
    // analytics.track({
    //   userId: 'null',
    //   containerId: input,
    //   event: 'start',
    //   time: new Date()
    // });
    console.log('TrackContainers register', newDoc);
    findExpired();
  });
};
