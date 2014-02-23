
/*
 * GET docker index.
 */

exports.index = function(req, res){
  res.render('index', { title: 'Docker' });
};

var resWrite = function(req, res, input){
  res.writeHead(200, {
    'Content-Type': 'application/json'
  });

  if(typeof input !== 'string'){
    input = JSON.stringify(input);
  }

  res.write(input);
  res.end();
};

exports.create = function(req, res){
  resWrite(req, res, {key1: 'value1', key2: 'value2'});
};