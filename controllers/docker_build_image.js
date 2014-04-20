var _ = require('underscore'),
  pexec = require('../utils/command_line').pexec,
  path = require('path'),
  templates = require('./docker_templates');

var controllers = module.exports = {};

var build = function(imageName){
  console.log('build', imageName);
  var cmd = 'docker build . -t ' + imageName;
  pexec(cmd, {
    cwd: path.join(__dirname, '..' ,'/temp')
  });
};

controllers.buildImage = function(imageName){
  templates.node(imageName);
  build(imageName);
};