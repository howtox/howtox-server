var fs = require('fs'),
  Q = require('q'),
  path = require('path'),
  currentImages = require('../config/db').images,
  buildImage = require('./docker_build_image').buildImage;

var dockerImages;

//check whether the image exist locally
//docker images | grep imageName
var imageExist = function(imageName){
  var dfd = Q.defer();
  currentImages.count({ imageName: imageName }, function (err, count) {
    if(err){
      return dfd.reject();
    }
    return (count ? dfd.resolve() : dfd.reject());
  });
  return dfd.promise;
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
  var dfd = Q.defer();

  imageExist(imageName)
    .then(function(){
      //docker image exist, pass
      console.log('exist');
      dfd.resolve('find');
    })
    .catch(function(){
      //create image
      console.log('Not exist');
      // createImage(imageName);
      dfd.resolve('create');
    });

  return dfd.promise;
};