var _ = require('underscore'),
  pexec = require('../utils/command_line').pexec,
  path = require('path'),
  templates = require('./docker_templates');

var controllers = module.exports = {};

var build = function(imageName){
  console.log('build', imageName);
  pexec('docker build .', {
    cwd: path.join(__dirname, '..' ,'/temp')
  });
};

controllers.buildImage = function(imageName){
  templates.node();
  build();
};