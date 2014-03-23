var pexec = require('../utils/command_line').pexec,
  getNewPort = require('./docker_admin').getNewPort,
  redisCon = require('./redis_con'),
  repoFactory = module.exports = {};

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

var getCommandFactoryPorts = function(repo, cmd){
  var randomPort = getNewPort();
  var command = 'docker run -d '+
  ' -p ' + randomPort +':3131 '+  //editor
  ' -p ' + (randomPort+1) +':3132 '+  //web server
  ' -p ' + (randomPort+2) +':3133 '+  //terminal
  ' ' + repo;

  return {
    command: command,
    port: randomPort
  };
};

repoFactory.createFactory = {};
repoFactory.createFactory['mikeal/request'] = function(req, res){
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

repoFactory.createFactory['daviferreira/medium-editor'] = function(req, res){
  var dfd = Q.defer();
  var repo = req.body && req.body.repo;
  var cmd = req.body && req.body.cmd;

  var commandObj = getCommandFactoryPorts(repo, cmd);
  pexec(commandObj.command)
    .then(function(data){
      redisCon.register(data);
      dfd.resolve(_.extend({containerId: data}, commandObj));
    });

  return dfd.promise;
};
