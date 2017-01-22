var express = require('express');
var router = express.Router();
var cheerio = require('cheerio');
var rp = require('request-promise');
var fs = require('fs');
var youtubedl = require('youtube-dl');
var _ = require("lodash");
var YouTube = require('youtube-node');
var youTube = new YouTube();
youTube.setKey('AIzaSyCQ8RGe6Uy9NmlN1EIvMMe9GeGgY-oklVM');


/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index');
});

router.get('/download-video', function(req, res, next) {
  var id = req.query.id;
  
  var video = youtubedl('http://www.youtube.com/watch?v=' + id,
    // Optional arguments passed to youtube-dl.
    ['--format=18'],
    // Additional options can be given for calling `child_process.execFile()`.
    { cwd: __dirname });
  
  // Will be called when the download starts.
  video.on('info', function(info) {
    //console.log('Download started', info);
    console.log('filename: ' + info._filename);
    console.log('size: ' + info.size);
    res.setHeader('Content-disposition', 'attachment; filename=' + info._filename);
    res.setHeader('Content-type', 'application/octet-stream');
    video.pipe(res);
  });
});

router.get('/play-video', function(req, res, next) {
  var id = req.query.id;
  
  var video = youtubedl('http://www.youtube.com/watch?v=' + id,
    // Optional arguments passed to youtube-dl.
    ['--format=18'],
    // Additional options can be given for calling `child_process.execFile()`.
    { cwd: __dirname });
  
  // Will be called when the download starts.
  video.on('info', function(info) {
    //console.log('Download started', info);
    console.log('filename: ' + info._filename);
    console.log('size: ' + info.size);
    res.setHeader('Content-type', 'video/mp4');
    video.pipe(res);
  });
});


router.get('/download', function(req, res, next) {
  console.log(req.query.url);
  var url = req.query.url;
  
  var video = youtubedl('http://www.youtube.com' + url,
    // Optional arguments passed to youtube-dl.
    ['--format=18'],
    // Additional options can be given for calling `child_process.execFile()`.
    { cwd: __dirname });
  
  // Will be called when the download starts.
  video.on('info', function(info) {
    //console.log('Download started', info);
    console.log('filename: ' + info._filename);
    console.log('size: ' + info.size);
  });
  
  //res.setHeader('Content-disposition', 'attachment; filename=' + filename);
  //res.setHeader('Content-type', mimetype);
  res.setHeader('Content-type', 'video/mp4');
  //video.pipe(fs.createWriteStream(res));
  video.pipe(res);
});

router.post('/search', function(req, res, next) {
  var searchTxt = req.body.searchTxt;
  youTube.search(searchTxt, 20, function(error, results) {
    if (error) {
      res.send(JSON.stringify(error, null, 2));
    } else {
      _.remove(results.items, function(item){
        return item.id.kind == "youtube#channel";
      });
      //console.log(JSON.stringify(results.items, null, 2));      
      res.render('search-results', { results: results });
    }
  });
});

router.post('/search1', function(req, res, next) {
  //console.log(req.body);
  var searchTxt = req.body.searchTxt;
  
  rp('https://www.youtube.com/results?search_query=' + searchTxt).then(function (htmlString) {
    console.log("GOT");
    var $ = cheerio.load(htmlString);
    var thumbs = $(".yt-thumb-simple img");
    //console.log(thumbs);
    var imgList = [];
    thumbs.each(function(i, e){
      //console.log(i, e.attribs.src);
      
      var videoUrlEle = $(e).closest("a");
      var videoUrl = videoUrlEle[0].attribs.href;

      imgList.push({
        url: e.attribs.src,
        videoUrl: videoUrl 
      });
      if(i >= 5) return false;
    });
    console.log(imgList);
    res.render('select', { imgList: imgList });
    
  }).catch(function (err) {
    console.log(err);
  });

});


module.exports = router;
