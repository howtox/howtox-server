module.exports = function(app) {
  analytics.init({secret: process.env.p_analytics_secret });
};