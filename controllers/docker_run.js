var pexec = require('../utils/command_line').pexec,
  getNewPort = require('./docker_utils').getNewPort,
  TrackContainers = require('./track_containers');

var getCommandAndPorts = function(repo){
  var randomPort = getNewPort();
  var command = 'docker run -d '+
  ' -p ' + randomPort +':3131 '+  //editor
  ' -p ' + (randomPort+1) +':3132 '+  //web server
  ' -p ' + (randomPort+2) +':3133 '+  //terminal
  ' ' + repo +
  ' /usr/local/bin/supervisord ';

  return {
    command: command,
    port: randomPort
  };
};

module.exports = function(req, res){
  var dfd = Q.defer();
  var repo = req.body && req.body.repo;

  var commandObj = getCommandAndPorts(repo);
  pexec(commandObj.command)
    .then(function(data){
      TrackContainers.register(data);
      dfd.resolve(_.extend({containerId: data}, commandObj));
    });

  return dfd.promise;
};