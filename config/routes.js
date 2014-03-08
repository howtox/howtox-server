module.exports = function(app) {
  //http://stackoverflow.com/questions/7067966/how-to-allow-cors-in-express-nodejs
  app.all('/*', function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "X-Requested-With");
    next();
  });

  app.get('/', routes.index);
  app.get('/users', user.list);

  app.get('/docker', dockerRoutes.index);
  app.get('/docker/', dockerRoutes.index);
  // app.get('/docker/containers/create/:id', dockerRoutes.create);
  app.post('/docker/containers/create/', dockerRoutes.create);
  app.get('/docker/containers/stop', dockerRoutes.stop);
};