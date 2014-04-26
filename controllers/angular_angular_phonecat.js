var getNewPort = require('./docker_utils').getNewPort,
  pexec = require('../utils/command_line').pexec,
  redisCon = require('./redis_con'),
  angularPhonecat = module.exports = {};

var getCommand = function(gitTag){
  console.log('get command');
  var randomPort = getNewPort();
  var command = 'docker run -d '+
  ' -p ' + randomPort +':3131'+
  ' -p ' + (randomPort+1) +':8000 '+
  ' -p ' + (randomPort+2) +':8001 '+
  ' -e TAG=' + gitTag +
  ' angular/angular-phonecat';

  return {
    command: command,
    port: randomPort
  };
};

angularPhonecat.createAngular = function(req, res){
  var dfd = Q.defer();

  var gitTag = req.body && req.body.tag;
  var commandObj;

  var expected = ['step-0', 'step-1', 'step-2', 'step-3',
  'step-4', 'step-5', 'step-6', 'step-7',
  'step-8', 'step-9', 'step-10'];

  if(_(expected).contains(gitTag)){
      commandObj = getCommand(gitTag);
      pexec(commandObj.command)
        .then(function(data){
          redisCon.register(data);
          dfd.resolve(_.extend({containerId: data}, commandObj));
        });
  } else {
    dfd.reject();
  }

  return dfd.promise;
};