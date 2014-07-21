var pexec = require('../utils/command_line').pexec,
  path = require('path'),
  Q = require('q'),
  spawn = require('child_process').spawn,
  prepareTemplates = require('./docker_prepare_templates');

var controllers = module.exports = {};

var build = function(options){
  console.log('build', options);
  var imageName = options.userName + '/' + options.repoName;
  var cmd = 'docker build -t ' + imageName.toLowerCase() + ' .';
  return pexec(cmd, {
    cwd: path.join(__dirname, '..' ,'/temp', options.repoName)
  });
};

var buildSpawn = function(options){
  console.log('buildSpawn', options);
  var dfd = Q.defer();

  var imageName = options.userName + '/' + options.repoName;

  //http://stackoverflow.com/questions/20357216/stream-stdout-from-child-process-to-browser-via-expressjs
  var child = spawn('docker', ['build', '-t', imageName.toLowerCase(), '.'],  {
    cwd: path.join(__dirname, '..' ,'/temp', options.repoName)
  });
  //http://rockycode.com/blog/pipe-stdout-socketio/
  child.stdout.setEncoding('utf-8');

  child.stdout.on('data', function(chunk){
    console.log(chunk);
  });
  child.stdout.on('end', function(){
    console.log('stdout:end');
    dfd.resolve();
  });

  return dfd.promise;
};

controllers.buildImage = function(imageName){
  var options = {
    userName: imageName.split('/')[0],
    repoName: imageName.split('/')[1]
  };
  prepareTemplates.completeRegenerate(options);  //sync
  return build(options);
};

controllers.buildImageSpawn = function(imageName){
  var options = {
    userName: imageName.split('/')[0],
    repoName: imageName.split('/')[1]
  };
  prepareTemplates.completeRegenerate(options);  //sync
  return buildSpawn(options);
};