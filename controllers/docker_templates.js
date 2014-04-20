var fs = require('fs-extra'),
  path = require('path'),
  Handlebars = require('handlebars');

var Templates = module.exports = {};

var copyFiles = function(){
  fs.copySync(path.join(__dirname, '../docker_templates'),
    path.join(__dirname, '../temp'));
};

var updateDockerFile = function(){
  var absPath = path.join(__dirname, '../docker_templates') + '/medium.txt';
  var medium = fs.readFileSync(absPath, {encoding: 'utf8'});
  var mediumTemplate = Handlebars.compile(medium);
  var preBuildHook = 'RUN easy_install supervisor \n' +
                     'RUN mkdir -p /var/log/supervisor';
  var postBuildHook = 'RUN easy_install supervisor \n' +
                     'RUN mkdir -p /var/log/supervisor';

  var output = mediumTemplate({
    preBuildHook: preBuildHook,
    postBuildHook: postBuildHook
  });

  var absOutputPath = path.join(__dirname, '../temp');
  fs.writeFileSync(absOutputPath + '/test', output, {encoding: 'utf8'});

  console.log('medium', output);
};

var updateSupervisordFile = function(){

};

Templates.node = function(){
  copyFiles();
  updateDockerFile();
  updateSupervisordFile();
};