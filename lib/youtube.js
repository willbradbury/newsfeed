var request = require('request');

var YT_URL = 'https://www.googleapis.com/youtube/v3/search';
var YT_API_KEY = 'AIzaSyDDP01Gnj3-wfoqM59xQz6pryJQhmYWCt8';
var YT_EMBED_URL = 'http://www.youtube.com/embed/';

/**
 * Queries YouTube for tracks that match the given query
 * 
 * @param query - the search query to send to YouTube
 *
 * Calls @param callback(error, results):
 *  error -- the error that occurred or null if no error
 *  results -- if error is null, contains the search results
 */
exports.search = function(query, callback) {
    request(YT_URL+"?key="+YT_API_KEY+"&q="+encodeURIComponent(query)+"&part=snippet"+"&type=video", function(error, response, body){
    if(!error && response.statusCode == 200){
      callback(null,JSON.parse(body).items.map(function(video){
        return {
          title : video.snippet.title,
          source : YT_EMBED_URL + video.id.videoId
        };
      }));
    }else{
      callback(error);
    }
  });
};


