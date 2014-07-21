#!/usr/bin/env node

//example
//node docker_build_image_cmd.js howtox/express

var buildImageSpawn = require('./docker_build_image').buildImageSpawn;
var program = require('commander');

program
  .version('0.0.1')
  .parse(process.argv);

program
  .command('*')
  .action(function(env){
    console.log('---Start building "%s"---', env);
    buildImageSpawn(env).then(function(){
      console.log('---End building "%s"---', env);
    });
  });

program.parse(process.argv);