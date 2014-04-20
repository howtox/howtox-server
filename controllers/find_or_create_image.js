var _ = require('underscore'),
  fs = require('fs'),
  path = require('path'),
  buildImage = require('./docker_build_image').buildImage,
  dockerImages = require('../docker_config/image_list.json');

//check whether the image exist locally
//docker images | grep imageName
var imageExist = function(imageName){
  return _.contains(dockerImages, imageName);
};

var addImageName = function(imageName){
  var oldImages = dockerImages; //get a local reference
  oldImages.push(imageName);
  var configPath = path.join(__dirname, '../docker_config');
  fs.writeFileSync(configPath + '/image_list.json', JSON.stringify(oldImages), 'utf8');
};

var createImage = function(imageName){
  //build docker image
  buildImage(imageName);

  //save the image name
  addImageName(imageName);
};

var findOrCreateImage = module.exports = function(imageName){
  if( imageExist(imageName) ){
    //docker image exist, pass
    console.log('exist');
  } else {
    //create image
    console.log('Not exist');
    createImage(imageName);
  }
};