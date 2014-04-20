var controllers = module.exports = {};

var DockerCon = require('./docker_build_image');

controllers.test = function(){
  console.log('test');
  DockerCon.buildImage('LearnBoost/socket.io');
};
