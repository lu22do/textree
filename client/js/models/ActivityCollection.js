define(['models/Activity'], function(Activity) {
  var ActivityCollection = Backbone.Collection.extend({
    model: Activity
  });

  return ActivityCollection;
});