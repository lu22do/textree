define(['TextreeView', 'text!templates/tree.html'], 
       function(TextreeView, treeTemplate) {
  var treeView = TextreeView.extend({
    el: $('#content'),
    
    events: {
      'click .edit_button': 'editField',
      'click .delete_button': 'deleteTree',
      'click .jump_button': 'deleteTree'
    },

    initialize: function(/*options*/) {
      this.model.bind('change', this.update, this);
    },

    update: function() {
      var date = new Date(this.model.get('date'));
      this.$el.html(_.template(treeTemplate, {tree: this.model, date: date.toLocaleDateString(), time: date.toLocaleTimeString()}));
    },

    render: function() {
    },

    editField: function() {
      var data = {
        name: $('#createtree_form input[name=name]').val(),
        description: $('#createtree_form textarea[name=description]').val()
      };

      $.ajax('/api/trees' , {
        type: 'POST',
        data: data,
        success: function() {
          console.log('create success');
          window.location.hash = '#index'; 
        },
        error: function() {
          alert('Could not create tree');
        }
      });  
      return false;
    }
  });

  return treeView;
});