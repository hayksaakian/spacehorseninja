var express = require('express');
var app = express();
var Flickr = require("flickrapi");
var myFlickrKey=process.env.SpaceHorse_Flickr_Key;

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

  smartGetPicture("horse", function(url){
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
    "https://farm6.staticflickr.com/5518/10178207295_85ecb7a2df.jpg",
    "https://farm6.staticflickr.com/5667/20709506288_56bc1482e3.jpg",
    "https://farm6.staticflickr.com/5653/20909257771_21dae0c6f8.jpg",
    "https://farm6.staticflickr.com/5494/12583323674_021b896024.jpg",
    "https://farm9.staticflickr.com/8134/8700183681_fc8e3939cb.jpg",
    "https://farm4.staticflickr.com/3935/15022534534_0ef70e7ef6.jpg",
    "https://farm6.staticflickr.com/5597/15456632069_a3abf2bd30.jpg",
    "https://farm6.staticflickr.com/5597/15023120793_0eeaf30e08.jpg",
    "https://farm4.staticflickr.com/3947/15644110622_8f38d82598.jpg",
    "https://farm4.staticflickr.com/3950/15457297837_4dffc50196.jpg"
  ]

  var randomIndex = Math.floor(Math.random() * list.length);

  var randomString = list[randomIndex];

  cb(randomString)
}

function smartGetPicture(searchText, cb) {
    //testing replacement
    var flickrRandomImageURL;
    var flickrOptions = {
        api_key: myFlickrKey
    };
    Flickr.tokenOnly(flickrOptions, function (error, flickr) {
        // we can now use "flickr" as our API object,
        // but we can only call public methods and access public data
        flickr.photos.search({
            text: searchText,
            sort: "relevance"
        }, function (err, result) {
            if (err) {
                throw new Error(err);
            }
            // do something with result
            var randomIndex = Math.floor(Math.random() * result.photos.photo.length);
            //console.log(JSON.stringify(result.photos.photo.length));
            //console.log('picking result number', randomIndex, JSON.stringify(result.photos.photo[randomIndex]));
            flickrRandomImageURL = "https://farm" + result.photos.photo[randomIndex].farm + ".staticflickr.com/" + result.photos.photo[randomIndex].server + "/" + result.photos.photo[randomIndex].id + "_" + result.photos.photo[randomIndex].secret + ".jpg";
            console.log(flickrRandomImageURL)
            cb(flickrRandomImageURL)
        });
    });

};
