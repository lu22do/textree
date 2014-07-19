define(['TextreeView', 'views/popup', 'text!templates/treedetails.html'], 
       function(TextreeView, PopupView, treeTemplate) {
  var treeDetailsView = TextreeView.extend({
    el: $('#content'),
    
    events: {
      'click #edit_name_button': 'editNameField',
      'click #submit_name_button': 'submitNameUpdate',
      'click #cancel_name_button': 'cancelNameUpdate',

      'click #edit_desc_button': 'editDescField',
      'click #submit_desc_button': 'submitDescUpdate',
      'click #cancel_desc_button': 'cancelDescUpdate',
      
      'click #delete_button': 'deleteTreePopup',

      'click #reading_mode_buttons': 'readingModeUpdate',
    },

    initialize: function(options) {
      this.router = options.router;

      this.model.bind('change', this.update, this);
    },

    update: function() {
      var cdate = new Date(this.model.get('date'));
      var udate = new Date(this.model.get('updateDate'));
      this.$el.html(_.template(treeTemplate, {
        tree: this.model,
        loggedAccountId: this.router.loggedAccount._id, 
        cdate: cdate.toLocaleDateString(), ctime: cdate.toLocaleTimeString(),
        udate: udate.toLocaleDateString(), utime: udate.toLocaleTimeString()
      }));
      if (this.model.get('readingMode') === 'branch_by_branch') {
        $('#continuous_button').button('toggle');
        $('#branch_by_branch_button').button('toggle');
      }
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

    readingModeUpdate: function(e) {
      var readingMode;

      if (e.target.id == 'continuous_button') {
        readingMode = "continuous";
      } 
      else if (e.target.id == 'branch_by_branch_button') { 
        readingMode = "branch_by_branch";
      }
      
      if (!readingMode) {
        alert('No readingMode!');
        return;
      }

      if (readingMode == this.model.get('readingMode')) {
        alert('ReadingMode not modified!');
        return;
      }

      $.ajax(
        '/api/trees/' + this.model.get('_id'), 
        {
          type: 'PUT',
          data: {
            readingMode: readingMode,
          }, 
          success: function() {
            console.log('update success');
          },
          error: function() {
            alert('Could not update tree');
          }
        }
      );  
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

  return treeDetailsView;
});