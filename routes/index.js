var dockerCon = require('../controllers/docker_con'),
  frontend = require('../controllers/frontend_con'),
  testCon = require('../controllers/test_con');

module.exports = function(app){
  //CORS
  //http://stackoverflow.com/questions/7067966/how-to-allow-cors-in-express-nodejs
  app.all('/*', function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "X-Requested-With");
    next();
  });

  app.get('/docker', dockerCon.index);
  app.get('/docker/', dockerCon.index);

  app.post('/docker/containers/create/', dockerCon.create);
  //todo
  //add a get route to do the same thing

  app.get('/docker/containers/stop', dockerCon.stop);
  app.get('/docker/containers/stop/', dockerCon.stop);

  // app.get('/docker/images/create', dockerCon.createImage);

  app.get('/', frontend.index);
  app.get('/box/:id', frontend.getBox);
  app.get('/launch/:githubUser/:githubRepo', frontend.launchRepo);
  app.get('/launch_no_check/:githubUser/:githubRepo', frontend.launchRepoNoCheck);
  app.get('/test', testCon.test);
};
