var resWrite = module.exports = function(req, res, input){
  if(typeof input !== 'string'){
    input = JSON.stringify(input);
  }

  res.write(input);
  res.end();
};