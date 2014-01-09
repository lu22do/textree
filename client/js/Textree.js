define(['router'], function(router) {
  var initialize = function() {
    checkLogin(runApplication);
  };

  var checkLogin = function(callback) {
    $.ajax('/api/account/authenticated', {
      type: 'GET',
      success: function(data) {
        router.loggedAccount = data;
        return callback(true);
      },
      error: function(/*data*/) {
        return callback(false);
      }
    });
  };

  var runApplication = function(authenticated) {
    if (!authenticated) {
      window.location.hash = 'login';
    } else {
      window.location.hash = 'index';
    }
    Backbone.history.start();
  };

  return {
    initialize: initialize
  };
});