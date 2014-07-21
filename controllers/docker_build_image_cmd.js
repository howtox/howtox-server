var buildImageSpawn = require('./docker_build_image').buildImageSpawn;

buildImageSpawn('howtox/express').then(function(){
  console.log('Building finished.');
});