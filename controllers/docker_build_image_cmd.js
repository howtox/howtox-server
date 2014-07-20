var build = require('./docker_build_image').buildImageSpawn;

build('shaohua/request').then(function(){
  console.log('Building finished.');
});