var fs = require('fs-extra'),
  path = require('path'),
  Handlebars = require('handlebars');

var Templates = module.exports = {};

var _getRepoPath = function(repoName){
  return path.join(__dirname, '../temp', repoName);
};

var deleteAndCreateFolder = function(repoName){
  fs.removeSync(_getRepoPath(repoName));
  fs.mkdirsSync(_getRepoPath(repoName));
};

var deleteFiles = function(){
};

var copyFiles = function(repoName){
  fs.copySync(path.join(__dirname, '../docker_templates'),
    _getRepoPath(repoName));
};

var updateDockerFile = function(repoName){
  var absPath = path.join(__dirname, '../docker_templates') + '/Dockerfile';
  var dockerfileRawTemplate = fs.readFileSync(absPath, {encoding: 'utf8'});
  var dockerfileTemplate = Handlebars.compile(dockerfileRawTemplate);
  var preBuildHook = 'RUN easy_install supervisor \n' +
                     'RUN mkdir -p /var/log/supervisor';
  var postBuildHook = 'RUN easy_install supervisor \n' +
                     'RUN mkdir -p /var/log/supervisor';

  var output = dockerfileTemplate({
    preBuildHook: preBuildHook,
    postBuildHook: postBuildHook
  });

  var absOutputPath = _getRepoPath(repoName);
  fs.writeFileSync(absOutputPath + '/Dockerfile', output, {encoding: 'utf8'});

  console.log('medium', output);
};

var updateSupervisordFile = function(repoName){
  //repoName
  var absPath = path.join(__dirname, '../docker_templates') + '/srv/howtox/supervisord.conf';
  var dockerfileRawTemplate = fs.readFileSync(absPath, {encoding: 'utf8'});
  var dockerfileTemplate = Handlebars.compile(dockerfileRawTemplate);

  var output = dockerfileTemplate({
    repoName: repoName
  });

  var absOutputPath = _getRepoPath(repoName);
  fs.writeFileSync(absOutputPath + '/srv/howtox/supervisord.conf', output, {encoding: 'utf8'});
};

Templates.node = function(){
  var userName = 'LearnBoost';
  var repoName = 'socket.io';
  deleteAndCreateFolder(repoName);
  // deleteFiles();
  copyFiles(repoName);
  updateDockerFile(repoName);
  updateSupervisordFile(repoName);
};