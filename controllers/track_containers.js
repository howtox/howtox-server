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
    // dockerUtils.stopOne(doc.id).then(function(output){
    //   console.log('stop success', output);
    // });
    db.remove(doc, {}, function (err, numRemoved) {
      console.log('numRemoved', numRemoved);
    });
  });
};

var findOld = function(){
  var durationAllowed = 1000 * 1;
  var oldestTime = (new Date().getTime()) - durationAllowed;

  // find containers that are older than allowed time and then kill them
  db.find({ "createdAt": {$lt: oldestTime} }, function (err, docs) {
    console.log('expired docs', docs);
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
    console.log('redis register', newDoc);
    findOld();
  });
};
