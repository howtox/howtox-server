var pexec = require('../utils/command_line').pexec,
  path = require('path'),
  templates = require('./docker_templates');

var controllers = module.exports = {};

var build = function(options){
  console.log('build', options);
  var imageName = options.userName + '/' + options.repoName;
  var cmd = 'docker build -t ' + imageName + ' .';
  return pexec(cmd, {
    cwd: path.join(__dirname, '..' ,'/temp', options.repoName)
  });
};

controllers.buildImage = function(imageName){
  var options = {
    userName: imageName.split('/')[0],
    repoName: imageName.split('/')[1]
  };
  templates.node(options);  //sync
  return build(options);
};