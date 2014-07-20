var Docker = require('dockerode'),
  Q = require('q'),
  docker = new Docker({socketPath: '/var/run/docker.sock'}),
  pexec = require('../utils/command_line').pexec,
  util = module.exports = {};

util.runContainer = function(externalPort){
  var cmd = 'docker run -d -p '+ externalPort  +':3131 howtox/c9_ng';
  pexec(cmd);
};

util.createContainer = function(containerId, cb){
  docker.run(containerId, [], process.stdout, function(err, data, container) {
    console.log(data.StatusCode);
    cb();
  });
};

util.createContainerPro = function(containerId){
  var dfd = Q.defer();
  util.createContainer(containerId, function(){
    dfd.resolve();
  });
  return dfd.promise;
};

util.listContainers = function(){
  docker.listContainers(function(err, containers) {
    console.log('list', err, containers);
  });
};

util.stopAll = function(cb){
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

util.stopAllPro = function(cb){
  var dfd = Q.defer();
  util.stopAll(function(cb){
    dfd.resolve();
  });
  return dfd.promise;
};

util.stopOne = function(containerId){
  var command = 'docker stop ' + containerId;
  return pexec(command);
};

util.getNewPort = function(){
  var maxPort = Math.pow(2,16); //http://stackoverflow.com/questions/113224/what-is-the-largest-tcp-ip-network-port-number-allowable-for-ipv4
  var minPort = 1024;
  var randomPort = Math.floor(Math.random() * (maxPort - minPort + 1)) + minPort;
  return randomPort;
};