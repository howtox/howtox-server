var tty = require('tty.js');

var app = tty.createServer({
  shell: 'bash',
  port: 8001
});

app.listen();
