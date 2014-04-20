var _ = require('underscore'),
  templates = require('./docker_templates');

var DockerCon = module.exports = {};

DockerCon.buildImage = function(imageName){
  templates.node();
};