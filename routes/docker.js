
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

exports.create = function(req, res){
  console.log('docker',docker);
  docker.listContainers(function(err, containers) {
    console.log('list', err, containers);
    containers.forEach(function(containerInfo) {
      docker.getContainer(containerInfo.Id).stop();
    });
  });
  resWrite(req, res, {key1: 'value1', key2: 'value2'});
};