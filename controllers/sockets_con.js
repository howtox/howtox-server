var buildImage = require('./docker_build_image').buildImage,
  dockerTempl = require('./docker_templates'),
  path = require('path'),
  spawn = require('child_process').spawn;

var controllers = module.exports = function (socket) {
  socket.emit('start', { hello: 'world' });
  
  socket.on('buildimage', function(data){
    console.log('buildimage', data.imageName);
    var imageName = data.imageName;
    var userName = data.imageName.split('/')[0]
    var repoName = data.imageName.split('/')[1];
    socket.emit('toClient', JSON.stringify({ hello: 'buildimage' }));
    
    dockerTempl.shortRegenerate({
      userName: userName,
      repoName: repoName
    });
    
    //http://stackoverflow.com/questions/20357216/stream-stdout-from-child-process-to-browser-via-expressjs
    var child = spawn('docker', ['build', '-t', data.imageName, '.'],  {
      cwd: path.join(__dirname, '..' ,'/temp', repoName)
    });
    //http://rockycode.com/blog/pipe-stdout-socketio/
    child.stdout.setEncoding('utf-8');
    
    child.stdout.on('data', function(chunk){ 
      socket.emit('toClient', chunk); 
    });
    child.stdout.on('end', function(){
      socket.emit('stdout:end');
    });
  
  });
}