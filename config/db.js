// require db module
var Datastore = require('nedb'),
  path = require('path');

// Connect to db here
var db = new Datastore({
  filename: path.join(__dirname, '..' ,'/howtox.db'),
  autoload: true
});

// a singleton due to the caching nature of require
module.exports = db;