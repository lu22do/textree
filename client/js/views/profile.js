define(['TextreeView', 'text!templates/profile.html', 'text!templates/activity.html', 'models/Activity', 'views/activity'], 
       function(TextreeView, profileTemplate, activityTemplate, Activity, ActivityView) {
  var profileView = TextreeView.extend({
    el: $('#content'),

    events: {
      'click #edit_name_button': 'editNameField',
      'click #submit_name_button': 'submitNameUpdate',
      'click #cancel_name_button': 'cancelNameUpdate',
    },

    initialize: function(options) {
      this.socketEvents = options.socketEvents;
      this.router = options.router;
      this.model.bind('change', this.renderModel, this);
    },

    onSocketActivityAdded: function(data) {
      var newActivity = data.data;
      this.prependActivity(new Activity({activity: newActivity.activity, name: newActivity.name}));
    },

    prependActivity: function(activityModel) {
      var activityHtml = (new ActivityView({model: activityModel})).render().el;
      $(activityHtml).prependTo('.activity_list').hide().fadeIn('slow');
    },

    render: function(argument) {
    },

    renderModel: function() {
      var myprofile = false;
      if (this.model.get('_id')) {
        this.socketEvents.bind('activity:' + this.model.get('_id'), this.onSocketActivityAdded, this);
      }
      if (this.model.get('_id') == this.router.loggedAccount._id) {
        myprofile = true;
      }
      var that = this;
      this.$el.html(_.template(profileTemplate, {user: this.model, myprofile: myprofile}));

      var activityCollection = this.model.get('activities');
      if (null !== activityCollection) {
        _.each(activityCollection, function(activityJson) {
          var activityModel = new Activity(activityJson);
          that.prependActivity(activityModel);
        });
      }
    },

    editNameField: function() {
      $('input[name=name]').show();
      $('#name_ro').hide();
      $('#edit_name_button').hide();
      $('#submit_name_button').show();
      $('#cancel_name_button').show();
    },

    cancelNameUpdate: function() {
      $('input[name=name]').hide();
      $('#name_ro').show();
      $('#edit_name_button').show();
      $('#submit_name_button').hide();
      $('#cancel_name_button').hide();
    },

    submitNameUpdate: function() {
      $('#name_ro').text($('input[name=name]').val());
      this.cancelNameUpdate();
      $.ajax(
        '/api/accounts/', 
        {
          type: 'PUT',
          data: {
            name: $('input[name=name]').val(),
          }, 
          success: function() {
            console.log('update success');
          },
          error: function() {
            alert('Could not update name');
          }
        }
      );  
    },


  });

  return profileView;
});