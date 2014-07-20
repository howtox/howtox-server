var pexec = require('../utils/command_line').pexec,
  path = require('path'),
  dockerUtils = require('./docker_utils'),
  dockerRun = require('./docker_run'),
  resWrite = require('../utils/res_write'),
  dockerCon = module.exports = {};

dockerCon.createContainer = function(req, res){
  //check for repo
  var repo = req.body && req.body.repo;
  console.log('repo', repo);

  dockerRun(req, res)
    .then(function(data){
      console.log('data', data);
      // resWrite(req, res, data);
      res.render('launch', {
        fullName: req.body.repo,
        data: JSON.stringify(data),
        domain: APP_CONFIG.domain,
        port: data.port
      });
    })
    .catch(function(data){
      resWrite(req, res, data);
    });
};

dockerCon.createImage = function(req, res){
  //launch image
  //client will fire 'buildimage' event
  //server will respond to the event in 'socket_con.js'
  res.render('launch_wait_for_image', {
    fullName: req.body.repo
  });
};

dockerCon.index = function(req, res){
  res.end('docker index');
};

dockerCon.stop = function(req, res){
  console.log('stop in routes');
  dockerUtils
    .stopAllPro()
    .then(function(){
      resWrite(req, res, {step:'stop'});
    })
    .catch(function(err){
      resWrite(req, res, {data: err});
    });
};
