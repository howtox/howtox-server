var controllers = module.exports = function (socket) {
  socket.emit('news', { hello: 'world' });
}