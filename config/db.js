// require db module
var Datastore = require('nedb'),
  _ = require('underscore'),
  path = require('path');

// Connect to db here

//a temporary db to track which containers are running
//not saved in git
var containers = new Datastore({
  filename: path.join(__dirname, '/howtox_containers.db'),
  autoload: true
});

//a permanent db to track which images we have on this machine
//not saved in git
var images = new Datastore({
  filename: path.join(__dirname,'/howtox_images.db'),
  autoload: true
});


//todo
//asyn might cause problems when init

//init images
var initImages = APP_CONFIG.whitelistedImages;

var query;
_.each(initImages, function(item){
  query = {
    imageName: item + ''
  };
  // db.update(query, update, options, callback)
  images.update(query,
    { $set: query },
    { upsert: true },
    function (err, numReplaced, newDoc) {
      //
    });

});

// a singleton due to the caching nature of require
module.exports = {
  containers: containers,
  images: images
};
