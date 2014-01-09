define(['text!templates/login.html'], function(loginTemplate) {
  var loginView = Backbone.View.extend({
    el: $('#content'),

    events: {
      'submit form': 'login'
    },

    initialize: function(options) {
      this.router = options.router;
    },

    login: function() {
      var that = this;
      $.post('/api/login', this.$('form').serialize(), function(data) {
        that.router.loggedAccount = data;
        window.location.hash = 'index';
      }).error(function(){
        $('#error').text('Unable to login.');
        $('#error').slideDown();
      });
      return false;
    },

    render: function() {
      this.$el.html(loginTemplate);
      $('#error').hide();
      $('input[name=email]').focus();
    }
  });

  return loginView;
});
