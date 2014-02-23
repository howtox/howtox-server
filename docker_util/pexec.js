var _ = require('underscore');
var Q = require('q');
var path = require('path');
var exec = require('child_process').exec;

//converting exec to a promised version
exports.pexec = function(program, options){
  var dfd = Q.defer();
  var child = exec(program, options || {},function (error, stdout, stderr) {
    stdout && console.log('stdout: \n' + stdout);
    stderr && console.log('stderr: \n' + stderr);
    if (error !== null) {
      // console.log('exec error: \n' + error);
      // dfd.reject(error); //needs more error handling to enable this line
    }
    dfd.resolve(stdout);
  });

  return dfd.promise;
};