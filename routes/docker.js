var dockerCon = require('../controllers/docker');

module.exports = function(app){
  app.get('/docker', dockerCon.index);
  app.get('/docker/', dockerCon.index);

  app.post('/docker/containers/create/', dockerCon.create);
  //todo
  //add a get route to do the same thing

  app.get('/docker/containers/stop', dockerCon.stop);
  app.get('/docker/containers/stop/', dockerCon.stop);
};