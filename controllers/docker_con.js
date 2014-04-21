var pexec = require('../utils/command_line').pexec,
  path = require('path'),
  spawn = require('child_process').spawn,
  redisCon = require('./redis_con'),
  dockerUtils = require('./docker_utils'),
  angularAngularPhonecat = require('./angular_angular_phonecat'),
  phaser = require('./shaohua_phaser_101'),
  chjjTtyjs = require('./chjj_tty_js'),
  repoFactory = require('./repo_factory.js'),
  resWrite = require('../utils/res_write'),
  dockerCon = module.exports = {};

//redis kills container after 15 minutes
redisCon.stopCallback(function(data){
  console.log('cb', data);
  dockerUtils.stopOne(data).then(function(output){
    console.log('stop success', output);
  });
});

dockerCon.create = function(req, res){
  var repo = req.body && req.body.repo;
  var dfd = Q.defer();

  console.log('repo', repo);

  switch(repo){
    case 'angular/angular-phonecat':
      dfd = angularAngularPhonecat.createAngular(req, res);
      break;
    case 'shaohua/phaser-101':
      dfd = phaser.create(req, res);
      break;
    case 'chjj/tty.js':
      dfd = chjjTtyjs.createTty(req, res);
      break;
    case 'mikeal/request':
    case 'daviferreira/medium-editor':
    case 'jakiestfu/medium.js':
    case 'tholman/zenpen':
    case 'mduvall/grande.js':
    case 'sofish/pen':
    case 'base_case':
      dfd = repoFactory.createFactory['base_case'](req, res);
      break;
    default:
      console.log('default repo');
      dfd = repoFactory.createFactory['base_case'](req, res);
      // dfd.reject();
      break;
  }

  dfd
    .then(function(data){
      // resWrite(req, res, data);
      res.render('launch', {
        fullName: req.body.repo,
        data: JSON.stringify(data),
        port: data.port
      });
    })
    .catch(function(data){
      resWrite(req, res, data);
    });
};

dockerCon.createImage = function(req, res){
  //launch image
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
