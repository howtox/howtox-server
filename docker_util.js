var Docker = require('dockerode'),
  docker = new Docker({socketPath: '/var/run/docker.sock'}),
  pexec = require('../docker_util/pexec').pexec,
  util = module.exports = {};

util.createContainer = function(containerId){
  docker.run(containerId, [], process.stdout, function(err, data, container) {
    console.log(data.StatusCode);
  });
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

util.stopOne = function(containerId){
  var command = 'docker stop ' + containerId;
  return pexec(command);
};