define(['text!templates/register.html'], function(registerTemplate) {
  var registerView = Backbone.View.extend({
    el: $('#content'),
    
    events:{
      'submit form': 'register'
    },

    register: function() {
      var that = this;
      $.post('/api/register', {
        firstName: $('input[name=firstName]').val(),
        lastName: $('input[name=lastName]').val(),
        pseudo: $('input[name=pseudo]').val(),
        email: $('input[name=email]').val(),
        password: $('input[name=password]').val()
      }, function() {
        window.location.hash = 'login';
      }).error(function(){
        that.$el.html('Error registering');
      });
      return false;
    },

    render: function() {
      this.$el.html(registerTemplate);
    }
  });

  return registerView;
});