var fs = require('fs'),
  path = require('path'),
  buildImage = require('./docker_build_image').buildImage;
  
var dockerImages;

var readImageNames = function(){
  var filePath = path.join(__dirname, '../docker_config/image_list.json');
  var fileContent = fs.readFileSync(filePath, "utf8");
  var output;
  try {
    output = JSON.parse(fileContent);
  } catch (e) {
    console.log('JSON parse failed', e);
  }
  return output;
};

//check whether the image exist locally
//docker images | grep imageName
var imageExist = function(imageName){
  var dockerImageNames = readImageNames();
  return _.contains(dockerImageNames, imageName);
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

  if( imageExist(imageName) ){
    //docker image exist, pass
    console.log('exist');
    dfd.resolve('find');
  } else {
    //create image
    console.log('Not exist');
    // createImage(imageName);
    dfd.resolve('create');
  }

  return dfd.promise;
};