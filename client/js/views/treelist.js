define(['TextreeView', 'text!templates/treelist.html'], 
function(TextreeView, treelistTemplate) {
  var treelistView = TextreeView.extend({
    events: {
      'click #delete_button': 'deleteTree'
    },
    
    initialize: function() {
      this.collection.on('reset', this.renderCollection, this);
    },

    render: function() {
      //this.$el.html(treelistTemplate);
    },

    renderCollection: function(collection) {
      var html = _.template(treelistTemplate, {treecoll: collection});
      this.$el.html(html);
    },

    deleteTree: function(event /*, context*/) {
      var that = this;
      var treeId = event.target.getAttribute('treeid');

      var model = this.collection.findWhere({_id: treeId});
      this.collection.remove(model);
      
      $.ajax(
        '/api/trees/' + treeId, 
        {
          type: 'DELETE', 
          success: function() {
            console.log('delete success');
            //router.treelist();
            that.renderCollection(that.collection);
          },
          error: function() {
            alert('Could not delete tree');
        }
      });
      return false;
    }
  });

  return treelistView;
});