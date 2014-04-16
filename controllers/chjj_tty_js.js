var pexec = require('../utils/command_line').pexec,
  getNewPort = require('./docker_admin').getNewPort,
  redisCon = require('./redis_con'),
  chjjTtyJs = module.exports = {};

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

chjjTtyJs.createTty = function(req, res){
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