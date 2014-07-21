var fs = require('fs-extra'),
  path = require('path'),
  Handlebars = require('handlebars');

var Templates = module.exports = {};

var _getRepoPath = function(repoName){
  return path.join(__dirname, '../temp', repoName);
};

var deleteAndCreateFolder = function(repoName){
  try {
    fs.removeSync(_getRepoPath(repoName));
  } catch(e) {
    console.log('removeSync' + repoName + 'failed' + e);
  }

  try {
    fs.mkdirsSync(_getRepoPath(repoName));
  } catch(e) {
    console.log('mkdirsSync' + repoName + 'failed' + e);
  }
};

var deleteFiles = function(){
};

var copyFiles = function(repoName){
  fs.copySync(path.join(__dirname, '../docker_templates'),
    _getRepoPath(repoName));
};

var updateDockerFile = function(userName, repoName){
  var absPath = path.join(__dirname, '../docker_templates') + '/Dockerfile';
  var dockerfileRawTemplate = fs.readFileSync(absPath, {encoding: 'utf8'});
  var dockerfileTemplate = Handlebars.compile(dockerfileRawTemplate);

  var cloneCmd = 'RUN git clone https://github.com/'+ userName +'/'+ repoName +'.git ' +
                     '/root/' + repoName;

  var preBuildHook = cloneCmd;
  var postBuildHook = '';

  var output = dockerfileTemplate({
    preBuildHook: preBuildHook,
    postBuildHook: postBuildHook
  });

  var absOutputPath = _getRepoPath(repoName);
  fs.writeFileSync(absOutputPath + '/Dockerfile', output, {encoding: 'utf8'});

  // console.log('medium', output);
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

Templates.completeRegenerate = function(options){
  var userName = options.userName;
  var repoName = options.repoName;
  deleteAndCreateFolder(repoName);
  // deleteFiles();
  copyFiles(repoName);
  updateDockerFile(userName, repoName);
  updateSupervisordFile(repoName);
};

Templates.shortRegenerate = function(options){
  var userName = options.userName;
  var repoName = options.repoName;
  deleteAndCreateFolder(repoName);

  var absPath = path.join(__dirname, '../docker_short_templates') + '/Dockerfile';
  var dockerfileRawTemplate = fs.readFileSync(absPath, {encoding: 'utf8'});
  var dockerfileTemplate = Handlebars.compile(dockerfileRawTemplate);

  var output = dockerfileTemplate({
    userName: userName,
    repoName: repoName
  });

  var absOutputPath = _getRepoPath(repoName);
  fs.writeFileSync(absOutputPath + '/Dockerfile', output, {encoding: 'utf8'});

};
