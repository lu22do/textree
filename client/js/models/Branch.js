define(['models/BranchCollection'], function(BranchCollection) {
  var Branch = Backbone.Model.extend({
    urlRoot: '/api/branches',

/*    initialize: function() {
      this.children = new BranchCollection();
    }, 

    parse: function(response, options) {
      if (response.children.length > 0) {
        console.log(response.children[0])
      }
      delete response.children;
      return response;
    }
*/  });

  return Branch;
});