define(['TextreeView', 'text!templates/treelist.html'], 
function(TextreeView, treelistTemplate) {
  var treelistView = TextreeView.extend({
    events: {
      'click #delete_button': 'deleteTree'
    },
    
    initialize: function(options) {
      this.complete = options.complete;
      this.withAuthor = options.withAuthor;
      this.collection.on('reset', this.renderCollection, this);
    },

    render: function() {
      //this.$el.html(treelistTemplate);
    },

    renderCollection: function(collection) {
      var html = _.template(treelistTemplate, {
        treecoll: collection, 
        complete: this.complete, 
        withAuthor: this.withAuthor});
      this.$el.html(html);
    }
  });

  return treelistView;
});