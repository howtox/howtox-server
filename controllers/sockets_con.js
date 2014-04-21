var buildImage = require('./docker_build_image').buildImage;

var controllers = module.exports = function (socket) {
  socket.emit('news', { hello: 'world' });
  
  socket.on('buildimage', function(data){
    console.log('buildimage', data);
    socket.emit('toClient', JSON.stringify({ hello: 'buildimage' }));
    
    buildImage('howtox/node_c9_tty_supervisord')
      .then(function(data){
          socket.emit('toClient', JSON.stringify({ hello: 'buildimage finished! ' + data }));
      });
  });
}