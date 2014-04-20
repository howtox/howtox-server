var _ = require('underscore'),
  pexec = require('../utils/command_line').pexec,
  templates = require('./docker_templates');

var controllers = module.exports = {};

var build = function(){
  pexec('docker build .');
};

controllers.buildImage = function(imageName){
  templates.node();
  build();
};