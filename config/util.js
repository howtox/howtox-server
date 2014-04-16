module.exports = function(app) {
  analytics.init({secret: process.env.p_analytics_secret });
  analytics.on('error', console.log); // remove after setup
};