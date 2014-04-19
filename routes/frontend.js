var frontend    = require('../controllers/frontend');

module.exports = function (app) {
  app.get('/', frontend.index);
  app.get('/box/:id', frontend.getBox);
};