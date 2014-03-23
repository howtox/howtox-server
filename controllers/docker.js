var pexec = require('../utils/command_line').pexec,
  redisCon = require('./redis_con'),
  dockerAdmin = require('./docker_admin'),
  angularAngularPhonecat = require('./angular_angular_phonecat'),
  phaser = require('./shaohua_phaser_101'),
  chjjTtyjs = require('./chjj_tty_js'),
  repoFactory = require('./repo_factory.js'),
  resWrite = require('../utils/res_write'),
  dockerCon = module.exports = {};

//redis kills container after 15 minutes
redisCon.stopCallback(function(data){
  console.log('cb', data);
  dockerAdmin.stopOne(data).then(function(output){
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
      dfd = repoFactory.createFactory[repo](req, res);
      break;
    case 'daviferreira/medium-editor':
      dfd = repoFactory.createFactory[repo](req, res);
      break;
    default:
      console.log('default repo');
      dfd.reject();
      break;
  }
  
  dfd
    .then(function(data){
      resWrite(req, res, data);
    })
    .catch(function(data){
      resWrite(req, res, data);
    });
};

dockerCon.index = function(req, res){
  res.end('docker index');
};

dockerCon.stop = function(req, res){
  console.log('stop in routes');
  dockerAdmin
    .stopAllPro()
    .then(function(){
      resWrite(req, res, {step:'stop'});
    })
    .catch(function(err){
      resWrite(req, res, {data: err});
    });
};