define(['text!templates/login.html'], function(loginTemplate) {
  var loginView = Backbone.View.extend({
    el: $('#content'),

    events: {
      'submit form': 'login'
    },

    initialize: function(options) {
      this.router = options.router;
      this.email = options.email? options.email: '';
    },

    login: function() {
      var that = this;
      $.post('/api/login', this.$('form').serialize(), function(data) {
        that.router.setLoggedAccount(data);
        window.location.hash = 'index';
      }).error(function(){
        $('#error').text('Unable to login.');
        $('#error').slideDown();
      });
      return false;
    },

    render: function() {
      this.$el.html(_.template(loginTemplate, {email: this.email}));
      $('#error').hide();
      if (!this.email) {
        $('input[name=email]').focus();
      } else {
        $('input[name=password]').focus();
      }
    }
  });

  return loginView;
});
