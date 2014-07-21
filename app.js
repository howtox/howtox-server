var express = require('express'),
  http = require('http'),
  app  = express();

//some global objects
if(process.env.p_analytics_secret){
  var Analytics = require('analytics-node');
  global.analytics = new Analytics(process.env.p_analytics_secret);
}

global.APP_CONFIG = {
  domain: 'azat.howtox.com',
  containerLifespan: 600, //in seconds
  whitelistedImages: ["howtox/yc_base", "howtox/azat-express", "howtox/express"]
};

require('./config/env.js')(app);  //has to go first
require('./config/util.js')(app);
require('./config/db.js');
require('./config/middleware.js')(app);
require('./routes')(app);

var server = http.createServer(app);
server.listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port') + ' in env: ' + app.get('env') );
});

var io = require("socket.io").listen(server);
io.set('log level', 1); // reduce logging
io.sockets.on('connection', require('./controllers/sockets_con'));
