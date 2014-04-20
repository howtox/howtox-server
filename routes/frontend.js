var frontend    = require('../controllers/frontend');
var testCon    = require('../controllers/test_con');

module.exports = function (app) {
  app.get('/', frontend.index);
  app.get('/box/:id', frontend.getBox);
  app.get('/launch/:githubUser/:githubRepo', frontend.launchRepo);
  app.get('/test', testCon.test);
};