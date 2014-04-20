var _ = require('underscore'),
  fs = require('fs'),
  path = require('path');
var buildImage = require('./docker_build_image').buildImage;
var frontendCon = module.exports = {};
var dockerImages = require('../docker_config/image_list.json');
var dockerCon = require('./docker');
frontendCon.index = function(req, res){
  res.end('index');
};

frontendCon.getBox = function(req, res){
  var boxId = req && req.params && req.params.id;
  var domain = 'http://da.howtox.com:';
  var editorSrc = domain + boxId;
  var terminalSrc = domain + (parseInt(boxId, 10) + 2);
  // res.end('index' + boxId);
  res.render('box_iframe', {
    editorSrc: editorSrc,
    terminalSrc: terminalSrc
  });
};

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

var findOrCreateImage = function(imageName){
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


frontendCon.launchRepo = function(req, res){
  var githubUser = req && req.params && req.params.githubUser;
  var githubRepo = req && req.params && req.params.githubRepo;
  var fullName = githubUser + '/' + githubRepo;

  findOrCreateImage(fullName);

  req.body = {};
  req.body.repo = fullName;
  dockerCon.create(req, res);
  //launch image
  // res.render('launch', {
  //   fullName: fullName
  // });
};