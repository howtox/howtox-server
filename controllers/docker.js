var _ = require('underscore'),
  Q = require('q'),
  hbs = require('express-hbs'),
  analytics = require('analytics-node'),
  pexec = require('../docker_util/pexec').pexec,
  redisCon = require('./redis_con'),
  doc = module.exports = {};

redisCon.stopCallback(function(data){
  console.log('cb', data);
  stopOne(data).then(function(output){
    console.log('stop success', output);
  });
});

var getNewPort = function(){
  var maxPort = Math.pow(2,16); //http://stackoverflow.com/questions/113224/what-is-the-largest-tcp-ip-network-port-number-allowable-for-ipv4
  var minPort = 1024;
  var randomPort = Math.floor(Math.random() * (maxPort - minPort + 1)) + minPort;
  return randomPort;
};

var runContainer = function(externalPort){
  var cmd = 'docker run -d -p '+ externalPort  +':3131 howtox/c9_ng';
  pexec(cmd);
};

var getCommandFactory = function(repo, cmd){
  var randomPort = getNewPort();
  var command = 'docker run -d '+
  ' -p ' + randomPort +':8000 '+
  ' ' + repo + ' ' + 
  ' node ' + cmd;

  return {
    command: command,
    port: randomPort
  };
};

var createFactory = {};
createFactory['mikeal/request'] = function(req, res){
  var dfd = Q.defer();
  var repo = req.body && req.body.repo;
  var cmd = req.body && req.body.cmd;

  var commandObj = getCommandFactory(repo, cmd);
  pexec(commandObj.command)
    .then(function(data){
      redisCon.register(data);
      dfd.resolve(_.extend({containerId: data}, commandObj));
    });
        
  return dfd.promise;
};


doc.create = function(req, res){
  var repo = req.body && req.body.repo;
  var promise;
  switch(repo){
    case 'angular/angular-phonecat':
      console.log('angular');
      promise = createAngular(req, res);
      break;
    case 'chjj/tty.js':
      console.log('tty');
      promise = createTty(req, res);
      break;
    case 'mikeal/request':
      console.log(repo);
      promise = createFactory[repo](req, res);
      break;
    default:
      console.log('default repo');
      break;
  }
  return promise;
};

doc.stop = function(req, res){
  var dfd = Q.defer();
  stopAll(function(){
    dfd.resolve();
  });
  return dfd.promise;
};

doc.index = function(req, res){
  res.end('docker index');
};



///


// var resWrite = function(req, res, input){
//   if(typeof input !== 'string'){
//     input = JSON.stringify(input);
//   }

//   res.write(input);
//   res.end();
// };

// exports.index = function(req, res){
//   res.write({page:'index'});
// };

// exports.create = function(req, res){
//   dockerController
//     .create(req, res)
//     .then(function(data){
//       resWrite(req, res, data);
//     })
//     .catch(function(err){
//       resWrite(req, res, err);
//     });
// };

// exports.stop = function(req, res){
//   console.log('stop in routes');
//   dockerController
//     .stop(req, res)
//     .then(function(){
//       resWrite(req, res, {step:'stop'});
//     })
//     .catch(function(err){
//       resWrite(req, res, {data: err});
//     });
// };