var getNewPort = require('./docker_admin').getNewPort,
  pexec = require('../utils/command_line').pexec,
  getNewPort = require('./docker_admin').getNewPort,
  redisCon = require('./redis_con'),
  phaser = module.exports = {};

var getCommand = function(){
  var randomPort = getNewPort();
  var command = 'docker run -d '+
  ' -p ' + randomPort +':3131'+
  ' -p ' + (randomPort+1) +':8000 '+
  ' -p ' + (randomPort+2) +':8001 '+
  ' shaohua/phaser-101';

  return {
    command: command,
    port: randomPort
  };
};

phaser.create = function(req, res){
  var dfd = Q.defer();
  var commandObj = getCommand();
  pexec(commandObj.command)
    .then(function(data){
      redisCon.register(data);
      dfd.resolve(_.extend({containerId: data}, commandObj));
    });

  return dfd.promise;
};