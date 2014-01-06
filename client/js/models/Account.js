define(['models/ActivityCollection'], function ActivityCollection() {
  var Account = Backbone.Model.extend({
    urlRoot: '/api/accounts',

    initialize: function() {
      this.activity = new ActivityCollection();
      this.activity.url = '/api/accounts/' + this.id + '/activity';
    }
  });

  return Account;
});