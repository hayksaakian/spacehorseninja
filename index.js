var express = require('express');
var app = express();

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
      console.log(err);
    }
  );
}

var server = app.listen(app.get('port'), function () {
  var host = server.address().address;
  var port = server.address().port;

  console.log('Example app listening at http://%s:%s', host, port);
});


function getPicture(tags, cb) {
    var apiKey = "9cf527bef89cfed17e94d77d6234ad31"; // replace this with your API key

    // get an array of random photos
    $.getJSON(
        "https://api.flickr.com/services/rest/?jsoncallback=?", {
            method: 'flickr.photos.search',
            tags: tags,
            api_key: apiKey,
            format: 'json',
            per_page: 10 // you can increase this to get a bigger array
        },
        function(data) {

            // if everything went good
            if (data.stat == 'ok') {
                // get a random id from the array
                var photo = data.photos.photo[Math.floor(Math.random() * data.photos.photo.length)];

                // now call the flickr API and get the picture with a nice size
                $.getJSON(
                    "https://api.flickr.com/services/rest/?jsoncallback=?", {
                        method: 'flickr.photos.getSizes',
                        api_key: apiKey,
                        photo_id: photo.id,
                        format: 'json'
                    },
                    function(response) {
                        if (response.stat == 'ok') {
                            var the_url = response.sizes.size[5].source;
                            cb(the_url);
                        } else {
                            console.log(" The request to get the picture was not good :\ ")
                        }
                    }
                );

            } else {
                console.log(" The request to get the array was not good :( ");
            }
        }
    );
};

