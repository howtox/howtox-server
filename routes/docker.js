var dockerController = require('../controllers/docker');

var resWrite = function(req, res, input){
  if(typeof input !== 'string'){
    input = JSON.stringify(input);
  }

  res.write(input);
  res.end();
};

exports.index = function(req, res){
  res.write({page:'index'});
};

exports.create = function(req, res){
    dockerController
        .create(req, res)
        .finally(function(data){
            console.log('finally', data);
            resWrite(req, res, {data: data});
        });
};

exports.stop = function(req, res){
    console.log('stop in routes');
    dockerController
        .stop(req, res)
        .then(function(){
            resWrite(req, res, {step:'stop'});
        });
};
