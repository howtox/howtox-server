var _ = require('underscore'),
  fs = require('fs'),
  path = require('path');
var buildImage = require('./docker_build_image').buildImage;
var frontendCon = module.exports = {};
var dockerCon = require('./docker_con');

var findOrCreateImage = require('./find_or_create_image');

frontendCon.index = function(req, res){
  res.end('index');
};

frontendCon.getBox = function(req, res){
  var boxId = req && req.params && req.params.id;
  var domain = 'http://da.howtox.com:';
  var editorSrc = domain + boxId;
  var terminalSrc = domain + (parseInt(boxId, 10) + 1);
  // res.end('index' + boxId);
  res.render('box_iframe', {
    editorSrc: editorSrc,
    terminalSrc: terminalSrc
  });
};

frontendCon.launchRepo = function(req, res){
  var githubUser = req && req.params && req.params.githubUser;
  var githubRepo = req && req.params && req.params.githubRepo;
  var fullName = githubUser + '/' + githubRepo;

  //todo
  //might not be a good idea to mix req body and req params
  req.body = req.body || {};
  req.body.repo = fullName;

  findOrCreateImage(fullName)
    .then(function(state){
      if(state === 'find') {
        dockerCon.create(req, res);
      } else if (state === 'create') {
        dockerCon.createImage(req, res);
      }

    });

  //launch image
  // res.render('launch', {
  //   fullName: fullName
  // });
};