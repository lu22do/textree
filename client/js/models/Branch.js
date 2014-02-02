define(['models/BranchCollection'], function(BranchCollection) {
  var Branch = Backbone.Model.extend({
    urlRoot: '/api/branches',

 /*   initialize: function() {
      var children = new BranchCollection();
      children.url = '/api/branches/' + this.id + '/children';
      this.set({children: children});
    }*/
/*,
    parse: function(response, options) {
      if (response.children.length > 0) {

      }
      delete response.children;
      return response;
    }
*/  
  });

  return Branch;
});