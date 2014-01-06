define(['TextreeView', 'text!templates/profile.html', 'text!templates/activity.html', 'models/Activity', 'views/Activity'], 
       function(TextreeView, profileTemplate, activityTemplate, Activity, ActivityView) {
  var profileView = TextreeView.extend({
    el: $('#content'),

    initialize: function(options) {
      this.socketEvents = options.socketEvents;
      this.model.bind('change', this.render, this);
    },

    postActivity: function() {
      var that = this;
      var activityText = $('input[name=activity]').val();
      var activityCollection = this.activityCollection;
      $.post('/accounts/' + this.model.get('_id') + '/activity', {activity: activityText});
      return false;
    },

    onSocketActivityAdded: function(data) {
      var newActivity = data.data;
      this.prependActivity(new Activity({activity: newActivity.activity, name: newActivity.name}));
    },

    prependActivity: function(activityModel) {
      var activityHtml = (new ActivityView({model: activityModel})).render().el;
      $(activityHtml).prependTo('.activity_list').hide().fadeIn('slow');
    },

    render: function() {
      if (this.model.get('_id')) {
        this.socketEvents.bind('activity:' + this.model.get('_id'), this.onSocketActivityAdded, this);
      }
      var that = this;
      this.$el.html(_.template(profileTemplate, this.model.toJSON()));

      var activityCollection = this.model.get('activity');
      if (null != activityCollection) {
        _.each(activityCollection, function(activityJson) {
          var activityModel = new Activity(activityJson);
          that.prependActivity(activityModel);
        });
      }
    }
  });

  return profileView;
});