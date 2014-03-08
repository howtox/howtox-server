var dockerCon = require('../controllers/docker');

module.exports = function(app){
  app.get('/docker', dockerCon.index);
  // app.get('/docker/', dockerRoutes.index);
  // // app.get('/docker/containers/create/:id', dockerRoutes.create);
  // app.post('/docker/containers/create/', dockerRoutes.create);
  // app.get('/docker/containers/stop', dockerRoutes.stop);
  
};


// var resWrite = function(req, res, input){
//   if(typeof input !== 'string'){
//     input = JSON.stringify(input);
//   }

//   res.write(input);
//   res.end();
// };

// exports.index = function(req, res){
//   res.write({page:'index'});
// };

// exports.create = function(req, res){
//   dockerController
//     .create(req, res)
//     .then(function(data){
//       resWrite(req, res, data);
//     })
//     .catch(function(err){
//       resWrite(req, res, err);
//     });
// };

// exports.stop = function(req, res){
//   console.log('stop in routes');
//   dockerController
//     .stop(req, res)
//     .then(function(){
//       resWrite(req, res, {step:'stop'});
//     })
//     .catch(function(err){
//       resWrite(req, res, {data: err});
//     });
// };
