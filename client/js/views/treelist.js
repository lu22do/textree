define(['TextreeView', 'text!templates/treelist.html'], 
function(TextreeView, treelistTemplate) {
  var treelistView = TextreeView.extend({
    events: {
      'click #delete_button': 'deleteTree'
    },
    
    initialize: function(options) {
      this.complete = options.complete;
      this.withAuthor = options.withAuthor;
      this.ownertitle = options.ownertitle;
      this.collection.on('reset', this.renderCollection, this);
    },

    render: function() {
      //this.$el.html(treelistTemplate);
    },

    renderCollection: function(collection) {
      var html = _.template(treelistTemplate, {
        treecoll: collection, 
        complete: this.complete, 
        ownertitle: this.ownertitle,
        withAuthor: this.withAuthor});
      this.$el.html(html);
    }
  });

  return treelistView;
});