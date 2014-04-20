var controllers = module.exports = {};

var DockerCon = require('./docker_build_image');

controllers.test = function(){
  console.log('test');
  var options = {
    userName: 'LearnBoost',
    repoName: 'socket.io'
  };
  DockerCon.buildImage(options);
};
