(function(window, document, undefined) {
  var NewsfeedView = {};

  var newsfeedPostTemplate = Handlebars.compile($("#newsfeed-post-template").html());

  /* Renders the newsfeed into the given $newsfeed element. */
  NewsfeedView.render = function($newsfeed) {
    PostModel.loadAll(function(error, posts){
      if(error){
        $('.error').text(error);
        return;
      }
      posts.forEach(function(post){
        NewsfeedView.renderPost($newsfeed, post, false);
      });
    });

    $newsfeed.imagesLoaded(function() {
      $newsfeed.masonry({
        columnWidth: '.post',
        itemSelector: '.post'
      });
    });
  };

  /* Given post information, renders a post element into $newsfeed. */
  NewsfeedView.renderPost = function($newsfeed, post, updateMasonry) {
    
    var $post = $(newsfeedPostTemplate(post));
    $newsfeed.prepend($post);

    $('.remove',$post).click(function(e){
      PostModel.remove(post._id, function(error){
        if(error){
          $('.error').text(error);
          return;
        }
      });
      $newsfeed.masonry('remove', $post);
      $newsfeed.masonry();
    });

    $('.upvote',$post).click(function(e){
      PostModel.upvote(post._id, function(error, newPost){
        if(error){
          $('.error').text(error);
          return;
        }
        $('.upvote-count',$post).html(newPost.upvotes);
      });
    });

    if (updateMasonry) {
      $newsfeed.imagesLoaded(function() {
        $newsfeed.masonry('prepended', $post);
      });
    }
  };

  window.NewsfeedView = NewsfeedView;
})(this, this.document);
