var express = require('express'),
  http = require('http'),
  app  = express();

//some global objects
global._    = require('underscore');
global.Q    = require('q');
global.analytics = require('analytics-node');

require('./config/env.js')(app);  //has to go first
require('./config/db.js')(app);
require('./config/middleware.js')(app);
require('./routes')(app);

http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port') + ' in env: ' + app.get('env') );
});
