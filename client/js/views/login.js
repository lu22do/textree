define(['text!templates/login.html'], function(loginTemplate) {
  function setCookie(cname,cvalue,exdays) {
    var d = new Date();
    d.setTime(d.getTime()+(exdays*24*60*60*1000));
    var expires = 'expires=' + d.toGMTString();
    document.cookie = cname + '=' + cvalue + '; ' + expires;
  }

  function getCookie(cname) {
    var name = cname + '=';
    var ca = document.cookie.split(';');
    for(var i=0; i<ca.length; i++) {
      var c = ca[i].trim();
      if (c.indexOf(name) === 0) {
        return c.substring(name.length, c.length);
      }
    }
    return '';
  }

  var loginView = Backbone.View.extend({
    el: $('#content'),

    events: {
      'submit form': 'login'
    },

    initialize: function(options) {
      this.router = options.router;
      this.email = '';
      this.rememberme = '';

      if (options.email) {
        this.email = options.email;
      }
      else {
        this.email = getCookie('email');
        if (this.email) {
          this.rememberme = 'checked';
        }
      }
    },

    login: function() {
      var that = this;

      $('.error').slideUp();

      if ($('input[name=email]').val() === '') {
        $('#noemail_error').slideDown();
        return false;        
      }

      if ($('input[name=password]').val() === '') {
        $('#nopassword_error').slideDown();
        return false;
      }

      if ($('input[name=rememberme]').is(':checked')) {
        setCookie('email', $('input[name=email]').val(), 100);
      } 
      else {
        setCookie('email', '', -100); // remove the cookie
      }

      $.post('/api/login', {
        email: $('input[name=email]').val(),
        password: $('input[name=password]').val()
      }, function(data) {
        that.router.setLoggedAccount(data);
        window.location.hash = 'index';
      }).error(function(){
        $('#login_error').slideDown();
      });
      return false;
    },

    render: function() {
      this.$el.html(_.template(loginTemplate, {email: this.email, rememberme: this.rememberme}));

      if (!this.email) {
        $('input[name=email]').focus();
      } else {
        $('input[name=password]').focus();
      }
    }
  });

  return loginView;
});
