var YouTube = require('youtube-node');

var youTube = new YouTube();

youTube.setKey('AIzaSyCQ8RGe6Uy9NmlN1EIvMMe9GeGgY-oklVM');

youTube.search('lata', 20, function(error, result) {
  if (error) {
    console.log(error);
  }
  else {
    console.log(JSON.stringify(result, null, 2));
  }
});