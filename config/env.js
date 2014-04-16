var express = require('express');

module.exports = function(app) {
  var setupDev = function(app){
    //set up dev environment
    app.use(express.errorHandler());

    //analytics
    // analytics.init({secret: process.env.p_analytics_secret });
  };

  var setupProd = function(app){
    //set up production environment
  };

  if (app.get('env') === 'production') {
    setupProd(app);
  } else {
    setupDev(app);
  }

};