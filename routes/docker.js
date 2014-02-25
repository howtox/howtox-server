
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

exports.create = function(req, res){
  switch(req.params.id){
    case '0':
        console.log('0');
        pexec('docker run -d -p 8000:8000 -p 8001:3131 howtox/c9_ng_sup_step0 /usr/local/bin/supervisord');
        break;
    case '1':
        console.log('1');
        pexec('docker run -d -p 8010:8000 -p 8011:3131 howtox/c9_ng_sup_step1 /usr/local/bin/supervisord');
        break;        
    case '2':
        console.log('2');
        pexec('docker run -d -p 8020:8000 -p 8021:3131 howtox/c9_ng_sup_step2 /usr/local/bin/supervisord');
        break;        
    case '3':
        console.log('3');
        pexec('docker run -d -p 8030:8000 -p 8031:3131 howtox/c9_ng_sup_step3 /usr/local/bin/supervisord');
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

  resWrite(req, res, {key1: 'value1', key2: 'value2'});
};

exports.stop = function(req, res){
  stopAll(function(){
    resWrite(req, res, {msg:'Stop'});
  });
};
