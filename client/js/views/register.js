define(['text!templates/register.html'], function(registerTemplate) {
  var registerView = Backbone.View.extend({
    el: $('#content'),
    
    events:{
      'submit form': 'register'
    },

    register: function() {
      var that = this;
      $('.error').slideUp();
      $.post('/api/register', {
        name: $('input[name=name]').val(),
        pseudo: $('input[name=pseudo]').val(),
        email: $('input[name=email]').val(),
        password: $('input[name=password]').val()
      }).done(function() {
        $('#account_created').slideDown();
        setTimeout(function() {
          window.location.hash = 'login/' + $('input[name=email]').val();
        }, 2000);
      }).fail(function(xhr, textStatus, errorThrown) {
        if (xhr.status == 412 && xhr.responseText == 'email') {
          $('#email_already_exists_error').slideDown();
        }
        else if (xhr.status == 412 && xhr.responseText == 'pseudo') {
          $('#pseudo_already_exists_error').slideDown();
        }
        else if (xhr.status == 400) {
          $('#invalid_input_error').slideDown();
        }
        else {
          $('#system_error').slideDown();
        }
      });
      return false;
    },

    render: function() {
      this.$el.html(registerTemplate);
    }
  });

  return registerView;
});