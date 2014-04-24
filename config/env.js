var express = require('express');

module.exports = function(app) {
  var setupDev = function(app){
    //set up dev environment
    app.use(express.errorHandler());
    app.set('port', process.env.PORT || 3000);
    //analytics
    // analytics.init({secret: process.env.p_analytics_secret });
  };

  var setupProd = function(app){
    //set up production environment
    app.set('port', process.env.PORT || 80);
  };

  if (app.get('env') === 'production') {
    setupProd(app);
  } else {
    setupDev(app);
  }

};