var buildImage = require('./docker_build_image').buildImage;
var redisRegularCon = require('./redis_regular_con');
var frontendCon = module.exports = {};

frontendCon.index = function(req, res){
  res.end('index');
};

frontendCon.getBox = function(req, res){
  var boxId = req && req.params && req.params.id;
  var domain = 'http://192.241.231.60:';
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
  return redisRegularCon.checkImageExist(imageName);
  //promise
  //probably not a good idea
};

var findOrCreateImage = function(imageName){
  if( imageExist(imageName) ){
    //docker image exist, pass
  } else {
    //create image
    buildImage(imageName);
  }
};


frontendCon.launchRepo = function(req, res){
  var githubUser = req && req.params && req.params.githubUser;
  var githubRepo = req && req.params && req.params.githubRepo;
  var fullName = githubUser + '/' + githubRepo;

  findOrCreateImage(fullName);

  //launch image
  res.render('launch', {
    fullName: fullName
  });
};