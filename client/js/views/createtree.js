define(['TextreeView', 'text!templates/createtree.html'], 
       function(TextreeView, createtreeTemplate) {
  var createtreeView = TextreeView.extend({
    el: $('#content'),
    
    events: {
      'click #createtree_button': 'createTree',
    },

    createTree: function() {
      var data = {
        name: $('#createtree_form input[name=name]').val(),
        description: $('#createtree_form textarea[name=description]').val()
      };

      $.ajax('/api/trees' , {
        type: 'POST',
        data: data,
        success: function(data) {
          window.location.hash = '#branch/' + data.rootBranch; 
        },
        error: function() {
          alert('Could not create tree');
        }
      });  
      return false;
    },

    render: function() {
      this.$el.html(createtreeTemplate);
    }
  });

  return createtreeView;
});