App = Ember.Application.create({});

App.Router.reopen({
  rootURL: '#/posts/'
});

App.Router.map(function() {
  this.resource('about');
  this.resource('posts', function() {
    this.resource('post', { path: ':post_id' });
  });
});

App.PostsRoute = Ember.Route.extend({
  model: function() {
    return $.getJSON('http://www.designsbydwight.com/api/get_recent_posts/?callback=?').then(function(data) {
      return data.posts.map(function(post) {
        post.body = post.content;
        return post;
      });
    });
  }
});

App.PostRoute = Ember.Route.extend({
  model: function(params) {
    return $.getJSON('http://www.designsbydwight.com/get_post/?id='+params.post_id+'&callback=?').then(function(data) {
        data.post.body = data.post.content;
        return data.post;
    });
  }
});

App.PostController = Ember.ObjectController.extend({
  isEditing: false,

  actions: {
    edit: function() {
      this.set('isEditing', true);
    },

    doneEditing: function() {
      this.set('isEditing', false);
    }
  }
});

var showdown = new Showdown.converter();

Ember.Handlebars.helper('format-markdown', function(input) {
  return new Handlebars.SafeString(showdown.makeHtml(input));
});

Ember.Handlebars.helper('format-date', function(date) {
  return moment(date).fromNow();
});
