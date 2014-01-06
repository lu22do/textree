define(function(require) {
  var Branch = Backbone.Model.extend({
    urlRoot: '/api/branches'
  });

  return Branch;
});