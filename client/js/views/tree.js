define(['TextreeView', 'views/popup', 'text!templates/tree.html'], 
       function(TextreeView, PopupView, treeTemplate) {
  var treeView = TextreeView.extend({
    el: $('#content'),
    
    events: {
      'click #edit_name_button': 'editNameField',
      'click #submit_name_button': 'submitNameUpdate',
      'click #cancel_name_button': 'cancelNameUpdate',

      'click #edit_desc_button': 'editDescField',
      'click #submit_desc_button': 'submitDescUpdate',
      'click #cancel_desc_button': 'cancelDescUpdate',
      
      'click #delete_button': 'deleteTreePopup'
    },

    initialize: function(/*options*/) {
      this.model.bind('change', this.update, this);
    },

    update: function() {
      var cdate = new Date(this.model.get('date'));
      var udate = new Date(this.model.get('updateDate'));
      this.$el.html(_.template(treeTemplate, {tree: this.model, 
                                              cdate: cdate.toLocaleDateString(), ctime: cdate.toLocaleTimeString(),
                                              udate: udate.toLocaleDateString(), utime: udate.toLocaleTimeString()}));
    },

    render: function() {
    },

    editNameField: function() {
      this.dismissPopup();
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
        '/api/trees/' + this.model.get('_id'), 
        {
          type: 'PUT',
          data: {
            name: $('input[name=name]').val(),
          }, 
          success: function() {
            console.log('update success');
          },
          error: function() {
            alert('Could not create tree');
          }
        }
      );  
    },

    editDescField: function() {
      this.dismissPopup();
      $('input[name=desc]').show();
      $('#desc_ro').hide();
      $('#edit_desc_button').hide();
      $('#submit_desc_button').show();
      $('#cancel_desc_button').show();
    },

    cancelDescUpdate: function() {
      $('input[name=desc]').hide();
      $('#desc_ro').show();
      $('#edit_desc_button').show();
      $('#submit_desc_button').hide();
      $('#cancel_desc_button').hide();
    },

    submitDescUpdate: function() {
      $('#desc_ro').text($('input[name=desc]').val());
      this.cancelDescUpdate();
      $.ajax(
        '/api/trees/' + this.model.get('_id'), 
        {
          type: 'PUT',
          data: {
            description: $('input[name=desc]').val(),
          }, 
          success: function() {
          },
          error: function() {
            alert('Could not create tree');
          }
        }
      );  
      return false;
    },

    deleteTree: function() {      
      $.ajax(
        '/api/trees/' + this.model.get('_id'), 
        {
          type: 'DELETE', 
          success: function() {
            window.location.hash = 'treelist/me';
          },
          error: function() {
            alert('Could not delete tree');
        }
      });
    },

    deleteTreePopup: function() {
      var that = this;
      if (!this.popup) {
        this.popup = new PopupView({el: $('#popup'), text: 'Are you sure?', confirmButtons: true, cb: function() {
            that.deleteTree.apply(that);
          }});
      }
      this.popup.render();
    }, 

    dismissPopup: function() {
      $('#popup').hide();
    }
  });

  return treeView;
});