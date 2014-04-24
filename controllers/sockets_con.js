var buildImage = require('./docker_build_image').buildImage,
  path = require('path'),
  spawn = require('child_process').spawn;

var controllers = module.exports = function (socket) {
  socket.emit('start', { hello: 'world' });
  
  socket.on('buildimage', function(data){
    console.log('buildimage', data);
    var imageName = data.imageName;
    socket.emit('toClient', JSON.stringify({ hello: 'buildimage' }));
    
    // buildImage('howtox/node_c9_tty_supervisord')
    //   .then(function(data){
    //       socket.emit('toClient', JSON.stringify({ hello: 'buildimage finished! ' + data }));
    //   });
    
    //http://stackoverflow.com/questions/20357216/stream-stdout-from-child-process-to-browser-via-expressjs
    var child = spawn('docker', ['build', '-t', data, '.'],  {
      cwd: path.join(__dirname, '..' ,'/temp', imageName)
    });
    //http://rockycode.com/blog/pipe-stdout-socketio/
    child.stdout.setEncoding('utf-8');
    
    child.stdout.on( 'data', function(chunk) { socket.emit('toClient', chunk); } );
  
  });
}