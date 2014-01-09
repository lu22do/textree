define(function(require) {
  var Tree = Backbone.Model.extend({
    urlRoot: '/api/trees'
  });

  return Tree;
});