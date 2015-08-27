var express = require('express');
var app = express();

var max_size = 2400

app.set('port', (process.env.PORT || 3000));

var easyimg = require('easyimage');

function getRandomArbitrary(min, max) {
  return Math.random() * (max - min) + min;
}

app.get('/', function (req, res) {
  handler(500, 100, req, res)
});

app.get('/:height/:width', function(req, res){
  handler(req.params.height, req.params.width, req, res)
})

app.get('/:length', function(req, res){
  var length = req.params.length
  if (length.indexOf('x') !== -1) {
    var parts = length.split('x')
    handler(parts[0], parts[1], req, res)
  }else{
    handler(req.params.length, req.params.length, req, res)  
  }
})


function handler (height, width, req, res) {
  if (height > max_size || width > max_size) {
    errorHandler(req, res)
    return
  }
  easyimg.resize({
       src:'horse.jpg', dst:'./tmp/'+width+'x'+height+'.jpg',
       width: width, height: height,
       cropwidth:width, cropheight:height,
       ignoreAspectRatio: true,
       x:0, y:0
    }).then(
    function(image) {
      console.log('Resized and cropped: ' + image.width + ' x ' + image.height);
      console.log('sending:', image.path)
      res.sendFile(image.path, { root: __dirname })
    },
    function (err) {
      errorHandler(req, res)
      console.log(err);
    }
  );
}

function errorHandler (req, res) {
  res.sendFile('error_horse.jpg', { root: __dirname })
}

var server = app.listen(app.get('port'), function () {
  var host = server.address().address;
  var port = server.address().port;

  console.log('Example app listening at http://%s:%s', host, port);
});

