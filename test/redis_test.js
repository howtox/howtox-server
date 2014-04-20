/* global describe, it, beforeEach */
var chai = require('chai'),
  expect = chai.expect;
var redisCon;

describe('Test redis', function(){
  beforeEach(function(){
    //connection has to be made here
    //no idea why
    redisCon = require('../controllers/redis_regular_con');
  });

  it('should connect and add a string', function(done){
    //request to 'ready' is queued
    redisCon.client.on('ready', function(){
      redisCon.addImage('image1');
      redisCon.checkImageExist('image1')
        .then(function(result){
          expect(result).to.equal(1);
          done();
        });
    });
  });

});
