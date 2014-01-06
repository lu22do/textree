define(['models/Branch'], function(Branch) {
  var BranchCollection = Backbone.Collection.extend({
    model: Branch
  });

  return BranchCollection;
});