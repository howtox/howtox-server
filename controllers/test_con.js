var controllers = module.exports = {};

var testCon = require('./find_or_create_image');

controllers.test = function(req, res){
  console.log('test');
  var options = {
    userName: 'LearnBoost',
    repoName: 'socket.io1'
  };
  testCon(options.userName + '/' + options.repoName).then(function(data){
    res.end(data);
  });

};
