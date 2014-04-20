var controllers = module.exports = {};

var DockerCon = require('./docker_build_image');

controllers.test = function(){
  console.log('test');
  DockerCon.build('LearnBoost/socket.io');
};