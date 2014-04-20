var _ = require('underscore'),
  pexec = require('../utils/command_line').pexec,
  path = require('path'),
  templates = require('./docker_templates');

var controllers = module.exports = {};

var build = function(options){
  console.log('build', options);
  var imageName = options.userName + '/' + options.repoName;
  var cmd = 'docker build -t ' + imageName + ' .';
  pexec(cmd, {
    cwd: path.join(__dirname, '..' ,'/temp', options.repoName)
  });
};

controllers.buildImage = function(options){
  templates.node(options);
  build(options);
};