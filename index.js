var express = require('express');
var app = express();


app.set('port', (process.env.PORT || 3000));

var easyimg = require('easyimage');

app.use(express.static('public'));

var max_size = 2400
function getRandomArbitrary(min, max) {
  return Math.random() * (max - min) + min;
}

app.get('/', function (req, res) {
  handler(500, 100, req, res)
});

app.get('/:width/:height', function(req, res){
  handler(req.params.width, req.params.height, req, res)
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


function handler (width, height, req, res) {
  if (height > max_size || width > max_size) {
    errorHandler(req, res)
    return
  }

  getPicture("horse", function(url){
    easyimg.resize({
         src:url, dst:'./tmp/'+width+'x'+height+'.jpg',
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
  })
  
}

function errorHandler (req, res) {
  res.sendFile('public/img/errorhorse.jpg', { root: __dirname })
}

var server = app.listen(app.get('port'), function () {
  var host = server.address().address;
  var port = server.address().port;

  console.log('Example app listening at http://%s:%s', host, port);
});

function getPicture(tags, cb){
  var list = [
    "https://farm4.staticflickr.com/3098/2673737268_a355ce2669.jpg",
    "https://farm6.staticflickr.com/5807/20290758104_5b337f7d5f.jpg",
    "https://farm1.staticflickr.com/619/20292294883_5824bb5e85.jpg",
    "https://farm6.staticflickr.com/5690/20920637291_1afab34330.jpg",
    "https://farm6.staticflickr.com/5686/20877295655_b181a80214.jpg",
    "https://farm1.staticflickr.com/675/20867598662_3b93d891d3.jpg",
    "https://farm8.staticflickr.com/7334/10817666133_287b4a3b8c.jpg",
    "https://farm1.staticflickr.com/647/20709403240_d537cae257.jpg",
    "https://farm6.staticflickr.com/5653/20909257771_21dae0c6f8.jpg",
    "https://farm8.staticflickr.com/7632/17126208322_58be639ea0.jpg",
    "https://farm3.staticflickr.com/2435/3539592423_9c05fa3f3d.jpg",
    "https://farm6.staticflickr.com/5518/10178207295_85ecb7a2df.jpg"

  ]

  var randomIndex = Math.floor(Math.random() * list.length);

  var randomString = list[randomIndex];

  cb(randomString)
}

function smartGetPicture(tags, cb) {
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

