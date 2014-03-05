var Docker = require('dockerode');
var docker = new Docker({socketPath: '/var/run/docker.sock'});
var pexec = require('../docker_util/pexec').pexec;
var doc = {};
var Q = require('q');
var _ = require('underscore');

var redisCon = require('./redis_con');

var createContainer = function(containerId){
  docker.run(containerId, [], process.stdout, function(err, data, container) {
    console.log(data.StatusCode);
  });
};

var listContainers = function(){
  docker.listContainers(function(err, containers) {
    console.log('list', err, containers);
  });
};

var stopAll = function(cb){
  docker.listContainers(function(err, containers) {
    //todo
    //handle error more gracefully
    if(err || containers.length === 0) {
      cb();
      return;
    }
    containers.forEach(function(containerInfo) {
      docker.getContainer(containerInfo.Id).stop(cb);
    });
  });
};

var stopOne = function(containerId){
  var command = 'docker stop ' + containerId;
  return pexec(command);
};

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

var getCommand = function(gitTag){
  var randomPort = getNewPort();
  var command = 'docker run -d '+
  ' -p ' + randomPort +':3131'+
  ' -p ' + (randomPort+1) +':8000 '+
  ' -e TAG=' + gitTag +
  ' 66cfb37f9cb4';

  return {
    command: command,
    port: randomPort
  };
};

var runContainer = function(externalPort){
  var cmd = 'docker run -d -p '+ externalPort  +':3131 howtox/c9_ng';
  pexec(cmd);
};

var createAngular = function(req, res){
  var dfd = Q.defer();

  var gitTag = req.body && req.body.tag;
  var commandObj;
  switch(gitTag){
    case 'step-0':
      commandObj = getCommand(gitTag);
      console.log('0', commandObj);
      pexec(commandObj.command)
        .then(function(data){
          redisCon.register(data);
          dfd.resolve(_.extend({containerId: data}, commandObj));
        });
      break;
    case 'step-1':
      commandObj = getCommand(gitTag);
      console.log('1', commandObj);
      pexec(commandObj.command)
        .then(function(data){
          redisCon.register(data);
          dfd.resolve(_.extend({containerId: data}, commandObj));
        });
      break;
    case 'step-2':
      commandObj = getCommand(gitTag);
      console.log('2', commandObj);
      pexec(commandObj.command)
        .then(function(data){
          redisCon.register(data);
          dfd.resolve(_.extend({containerId: data}, commandObj));
        });
      break;
    case 'step-3':
      commandObj = getCommand(gitTag);
      console.log('3', commandObj);
      pexec(commandObj.command)
        .then(function(data){
          redisCon.register(data);
          dfd.resolve(_.extend({containerId: data}, commandObj));
        });
      break;
    case '99':
      console.log('99');
      dfd.reject();
      break;
    default:
      console.log('default');
      dfd.reject();
      break;
  }

  return dfd.promise;
};


var getTtyCommand = function(cmd){
  var randomPort = getNewPort();
  var command = 'docker run -d '+
  ' -p ' + randomPort +':8000 '+
  ' howtox/tty.js ' + 
  ' node ' + cmd;

  return {
    command: command,
    port: randomPort
  };
};

var createTty = function(req, res){
  var dfd = Q.defer();
  var demoTag = req.body && req.body.demoTag;
  var cmd = req.body && req.body.cmd;

  var commandObj = getTtyCommand(cmd);
  console.log('tty', commandObj);
  pexec(commandObj.command)
    .then(function(data){
      redisCon.register(data);
      dfd.resolve(_.extend({containerId: data}, commandObj));
    });
        
  return dfd.promise;
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

module.exports = doc;
