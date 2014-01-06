define(function(require) {
  var Tree = Backbone.Model.extend({
    urlRoot: '/api/accounts/' + this.accountId + '/trees'
  });

  return Tree;
});