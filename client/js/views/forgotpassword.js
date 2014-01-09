define(['text!templates/forgotpassword.html'], function(forgotpasswordTemplate) {
  var forgotpasswordView = Backbone.View.extend({
    el: $('#content'),

    events: {
      'submit form': 'password'
    },

    password: function() {
      $.post('/api/forgotpassword', {
        email: $('input[name=email]').val()
      }, function(data) {
        console.log(data);
      });
      return false;
    },

    render: function() {
      this.$el.html(forgotpasswordTemplate);
    }
  });

  return forgotpasswordView;
});
