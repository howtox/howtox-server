
/*
 * GET docker index.
 */

exports.index = function(req, res){
  res.render('index', { title: 'Docker' });
};

var resWrite = function(req, res, input){
  res.writeHead(200, {
    'Content-Type': 'application/json'
  });

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

var stopAll = function(){
  docker.listContainers(function(err, containers) {
    console.log('list', err, containers);
    containers.forEach(function(containerInfo) {
      docker.getContainer(containerInfo.Id).stop();
    });
  });
};

exports.create = function(req, res){
  //not working because async
  listContainers();
  createContainer();
  listContainers();

  resWrite(req, res, {key1: 'value1', key2: 'value2'});
};