var request = require('request');

var FLICKR_URL = 'https://api.flickr.com/services/rest/?';
var FLICKR_API_KEY = '3cffcc97867ea6aaf3d7fa2690f0ae10';

/**
 * Queries Flickr for photos that match the given query.
 *
 * @param query -- the search query to send to Flickr
 *
 * Calls @param callback(error, results):
 *  error -- the error that occurred or null if no error
 *  results -- if error is null, contains the search results
 */
exports.search = function(query, callback) {
  request(FLICKR_URL+"api_key="+FLICKR_API_KEY+"&text="+encodeURIComponent(query)
                               +"&method=flickr.photos.search"
                               +"&format=json"
                               +"&media=photos"
                               +"&sort=relevance"
                               +"&nojsoncallback=1", function(error, response, body){
    if(!error && response.statusCode == 200){
      callback(null,JSON.parse(body).photos.photo.map(function(photo){
        return {
          title : photo.title,
          source : 'https://farm' + photo.farm + '.staticflickr.com/' +
                    photo.server + '/' + photo.id + '_' + photo.secret + '_z.jpg'
        };
      }));
    }else{
      callback(error);
    }
  });
};
