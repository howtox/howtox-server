
/**
 * Module dependencies.
 */

var express = require('express');
var routes = require('./routes');
var user = require('./routes/user');
var dockerRoutes = require('./routes/docker');
var http = require('http');
var path = require('path');

var app = express();

var redis = require('redis');
var client = redis.createClient();

client.on('error', function(err){
  console.log('error', err);
});

client.set('string key', 'sval', redis.print);
client.hset('hash key', 'hk1', 'hv1', redis.print);
client.hset(['hash key', 'hk2', 'hv2'], redis.print);
client.hkeys('hash key', function(err, replies){
  console.log(replies.length + ' replies:');
  replies.forEach(function(reply, i){
    console.log(' ' + i + ': ' + reply);
  });
  client.quit();
});

// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.json());
app.use(express.urlencoded());
app.use(express.methodOverride());
app.use(express.cookieParser('your secret here'));
app.use(express.session());
app.use(app.router);
app.use(require('stylus').middleware(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'public')));

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

//http://stackoverflow.com/questions/7067966/how-to-allow-cors-in-express-nodejs
app.all('/*', function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "X-Requested-With");
  next();
});

app.get('/', routes.index);
app.get('/users', user.list);

app.get('/docker', dockerRoutes.index);
app.get('/docker/', dockerRoutes.index);
// app.get('/docker/containers/create/:id', dockerRoutes.create);
app.post('/docker/containers/create/', dockerRoutes.create);
app.get('/docker/containers/stop', dockerRoutes.stop);

http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});
