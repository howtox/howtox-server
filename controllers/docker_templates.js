var fs = require('fs'),
  path = require('path'),
  Handlebars = require('handlebars');

var Templates = module.exports = {};

Templates.node = function(){
  var absPath = path.join(__dirname, '../docker_templates') + '/medium.txt';
  var medium = fs.readFileSync(absPath, {encoding: 'utf8'});
  var mediumTemplate = Handlebars.compile(medium);
  var output = mediumTemplate({
    preBuildHook: 'test'
  });
  console.log('medium', output);
};