var build = require('./docker_build_image').buildImageSpawn;

build('howtox/express').then(function(){
  console.log('Building finished.');
});