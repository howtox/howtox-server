
/*
 * GET docker index.
 */

exports.index = function(req, res){
  res.render('index', { title: 'Docker' });
};

var resWrite = function(req, res, input){
  // res.writeHead(200, {
  //   'Content-Type': 'application/json'
  // });

  if(typeof input !== 'string'){
    input = JSON.stringify(input);
  }

  res.write(input);
  res.end();
};

//docker
//todo
//refactor to a different file
var Docker = require('dockerode');
var docker = new Docker({socketPath: '/var/run/docker.sock'});
var pexec = require('../docker_util/pexec').pexec;

var createContainer = function(){
  docker.run('2947c9301082', [], process.stdout, function(err, data, container) {
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
    // console.log('list', err, containers);
    containers.forEach(function(containerInfo) {
      docker.getContainer(containerInfo.Id).stop(cb);
    });
  });
};


var runContainer = function(externalPort){
  var cmd = 'docker run -d -p '+ externalPort  +':3131 howtox/c9_ng'
  pexec(cmd);
};

var getCommand = function(gitTag){
    var maxPort = Math.pow(2,16); //http://stackoverflow.com/questions/113224/what-is-the-largest-tcp-ip-network-port-number-allowable-for-ipv4
    var minPort = 1024;
    var randomPort = Math.floor(Math.random() * (maxPort - minPort + 1)) + minPort;

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

exports.create = function(req, res){
  var gitTag = req.body && req.body.tag;
  var commandObj;
  switch(gitTag){
    case 'step-0':
        console.log('0');
        commandObj = getCommand(gitTag);
        pexec(commandObj.command).then(function(){
            resWrite(req, res, {port:commandObj.port});
        });
        break;
    case 'step-1':
        console.log('1');
        commandObj = getCommand(gitTag);
        pexec(commandObj.command).then(function(){
            resWrite(req, res, {port:commandObj.port});
        });
        break;        
    case 'step-2':
        console.log('2');
        commandObj = getCommand(gitTag);
        pexec(commandObj.command).then(function(){
            resWrite(req, res, {port:commandObj.port});
        });
        break;        
    case 'step-3':
        console.log('3');
        commandObj = getCommand(gitTag);
        pexec(commandObj.command).then(function(){
            resWrite(req, res, {port:commandObj.port});
        });
        break;      
    case '99':
        console.log('99');
        stopAll(function(){
            console.log('STOP ALL');
        });
        break;
    default:
        console.log('default');
        break;
  }
//   runContainer(9877);

//   resWrite(req, res, {msg:200});
};

exports.stop = function(req, res){
  stopAll(function(){
    resWrite(req, res, {msg:'Stop'});
  });
};
