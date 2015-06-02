soundcloud = require('../lib/soundcloud.js');
youtube = require('../lib/youtube.js');
flickr = require('../lib/flickr.js');
Post = require('../models/post.js');

handleResponse = function(error,result,results,api){
  if(!error && result && result.length > 0){
    result[0].api = api;
    results.push(result[0]);
  }
}

module.exports = function(app) {
  /* Renders the newsfeed landing page. */
  app.get('/', function(request, response) {
    response.render('index.html');
  });

  app.get('/search', function(request, response) {
    results = []; responses = 0;
    soundcloud.search(request.query.query, function(error, result) {
      handleResponse(error,result,results,'soundcloud');
      responses++;
      if(responses == 3) response.json(200, results);
    });
    youtube.search(request.query.query, function(error, result) {
      handleResponse(error,result,results,'youtube');
      responses++;
      if(responses == 3) response.json(200, results);
    });
    flickr.search(request.query.query, function(error, result) {
      handleResponse(error,result,results,'flickr');
      responses++;
      if(responses == 3) response.json(200, results);
    });
  });

  app.get('/posts', function(request, response){
    Post.find(function(error, posts){
      if(error) throw error;
      response.json(200, posts);
    });
  });

  app.post('/posts', function(request, response){
    if(!request.body.api || !request.body.source || !request.body.title){
      console.log("ERROR: tried to add post without api, source, or title.");
      response.status(0).send("api, source, and title properties are required.");
      return;
    }

    var newPost = new Post({
      api: request.body.api,
      source: request.body.source,
      title: request.body.title,
      upvotes: 0
    });

    newPost.save(function(error) {
      if(error) throw error;
      response.json(200, newPost);
    });
  });

  app.post('/posts/remove', function(request, response){
    Post.findByIdAndRemove(request.body.id, function(error){
      if(error) throw error;
      response.status(200).send('');
    });
  });

  app.post('/posts/upvote', function(request, response){
    Post.findById(request.body.id, function(error,post){
      if(error) throw error;
      if(!post){
        response.status(1).send("Cannot upvote nonexistent post.");
      }else{
        post.upvotes++;
        post.save(function(error){
          if(error) throw error;
          response.json(200, post);
        });
      }
    });
  });

};
