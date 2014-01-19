define(['TextreeView', 'text!templates/index.html', 'views/activity', 'views/treelist', 'models/Activity'], 
       function(TextreeView, indexTemplate, ActivityView, TreeListView, Activity) {
  var indexView = TextreeView.extend({
    el: $('#content'),
    
    events: {
    },

    initialize: function(options) {
      this.socketEvents = options.socketEvents;
      this.socketEvents.bind('activity:me', this.onSocketActivityAdded, this);

      this.activityCollection = options.activityCollection;
      this.activityCollection.on('add', this.onActivityAdded, this);
      this.activityCollection.on('reset', this.onActivityCollectionReset, this);

      this.myTreeCollection = options.myTreeCollection;
      this.otherTreeCollection = options.otherTreeCollection;
    },

    onActivityCollectionReset: function(collection) {
      var that = this;
      collection.each(function(model) {
        activity.onActivityAdded(model);
      });
    },

    onSocketActivityAdded: function(event) {
      var newActivity = event.data;
      var found = false;
      this.activityCollection.forEach(function(activity) {
        var name = activity.get('name');
        if (name && 
            name.full == newActivity.name.full &&
            activity.get('activity') == newActivity.activity) {
          found = true;
        }
      });
      if (!found) {
        this.activityCollection.add(new Activity({activity: newActivity.activity, name: newActivity.name}));
      }
    },

    onActivityAdded: function(activity) {
      var activityHtml = (new ActivityView({model: activity})).render().el;
      $(activityHtml).prependTo('#activity_list').hide().fadeIn('slow');
    },

    render: function() {
      this.$el.html(indexTemplate);

      new TreeListView({
        el: $('#my_tree_list'),
        collection: this.myTreeCollection,
        withAuthor: false,
        complete: false
      });

      new TreeListView({
        el: $('#other_tree_list'),
        collection: this.otherTreeCollection,
        withAuthor: true,
        complete: false
      });
    }
  });

  return indexView;
});