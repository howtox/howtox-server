var _ = require('underscore'),
  fs = require('fs'),
  path = require('path'),
  dockerImages = require('../docker_config/image_list.json');

//check whether the image exist locally
//docker images | grep imageName
var imageExist = function(imageName){
  return _.contains(dockerImages, imageName);
};

var createImage = function(imageName){
  var oldImages = dockerImages; //get a local reference
  oldImages.push(imageName);
  var configPath = path.join(__dirname, '../docker_config');
  fs.writeFileSync(configPath + '/image_list.json', JSON.stringify(oldImages), 'utf8');
};

var findOrCreateImage = module.exports = function(imageName){
  if( imageExist(imageName) ){
    console.log('exist');
    //docker image exist, pass
  } else {
    console.log('Not exist');
    //create image
    createImage(imageName);
    // buildImage(imageName);
  }
};