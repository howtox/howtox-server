var _ = require('underscore'),
  pexec = require('../utils/command_line').pexec,
  templates = require('./docker_templates');

var DockerCon = module.exports = {};

var build = function(){
  pexec('docker build .');
};

DockerCon.buildImage = function(imageName){
  templates.node();
  build();
};