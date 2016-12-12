var tinify = require("tinify");
var walk    = require('walk');
var config = require('./config');
var fs = require('fs');
var filesize = require('file-size');

tinify.key = config.tiny_api_key;

const start_dir = config.path_to_files;
const destination_dir = config.path_to_optimized_files

if (!fs.existsSync(destination_dir)){
    fs.mkdirSync(destination_dir);
}

var walker  = walk.walk(start_dir, { followLinks: false });

walker.on('file', function(root, stat, next) {
    if (stat.name.match(/\.(jpg|jpeg|png)$/)) {
      var filepath_start = start_dir + '/' + stat.name;
      var filepath_end = destination_dir + '/' + stat.name

      var start_stats = fs.statSync(filepath_start)
      var start_size = filesize(start_stats["size"]).to('MB')
      console.log("starting size for " + stat.name + ": " + start_size)

      tinify.fromFile(filepath_start).toFile(filepath_end);

      var end_stats = fs.statSync(filepath_end)
      var end_size = filesize(end_stats["size"]).to('MB')
      console.log("ending size for " + stat.name + ": " + end_size)

      if (end_size != start_size) {
        var savings = ((end_size / start_size) * 100).toFixed(2)
        console.log(savings + "% saved")
      }

      console.log('\n')

    }

    next();
});
