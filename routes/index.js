var api         = require('./api'),
    frontend    = require('./frontend'),
    docker      = require('./docker');

module.exports = function(app){
  // ## Routing
  var routes = {
    api: api,
    frontend: frontend,
    docker: docker
  };

  // Set up API routes
  routes.api(app);

  // Set up Frontend routes
  routes.frontend(app);

  // Set up Docker routes
  routes.docker(app);
};
