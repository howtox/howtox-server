module.exports = function (app) {
  //http://stackoverflow.com/questions/7067966/how-to-allow-cors-in-express-nodejs
  app.all('/*', function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "X-Requested-With");
    next();
  });
};