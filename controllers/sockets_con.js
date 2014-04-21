var controllers = module.exports = function (socket) {
  socket.emit('news', { hello: 'world' });
  
  socket.on('buildimage', function(data){
    console.log('buildimage', data);
  });
}