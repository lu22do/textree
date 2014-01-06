define(['models/Tree'], function(Tree) {
  var TreeCollection = Backbone.Collection.extend({
    model: Tree
  });

  return TreeCollection;
});