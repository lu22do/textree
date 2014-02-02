define(['TextreeView', 'views/popup', 'text!templates/branch.html', 'models/BranchCollection' /*, 'models/Branch'*/],
  function(TextreeView, PopupView, branchTemplate, BranchCollection) {
  var branchView = TextreeView.extend({
    el: $('#content'),

    events: {
      'click #savebranch_button': 'saveBranch',
      'click #deletebranch_button': 'deleteBranch',
      'click #createbranch_button': 'newBranch'
    },

    initialize: function(options) {
      this.router = options.router;

      var children = new BranchCollection();
      children.url = '/api/branches/' + this.model.get('id') + '/children';
      this.model.set({children: children});

      children.bind('reset', this.update, this);

      this.model.bind('change', this.update, this);
    },

    requestColl: false,

    update: function() {
      if (!this.requestColl) {
        this.requestColl = true;
        this.model.get('children').fetch({reset: true});
      }

      this.$el.html(_.template(branchTemplate, {
        branch: this.model.toJSON(),
        children: this.model.get('children').toJSON(),
        loggedAccountId: this.router.loggedAccount._id
      }));
    },

    render: function() {
      // show loading indicator?
    },

    saveBranch: function() {
      console.log('update: ' + $('#branch_text').val());
  
      $.ajax(
        '/api/branches/' + this.model.get('id'), 
        {
          type: 'PUT',
          data: {
            text: $('#branch_text').val()
          }, 
          success: function() {
            $('#save_branch_done').fadeIn('slow', function() {
              setTimeout(function() {
                $('#save_branch_done').fadeOut('slow');
              }, 400);
            });
            console.log('update success');
          },
          error: function() {
            alert('Could not update branch');
          }
        }
      );
      return false;
    },

    deleteBranch: function() {
      var that = this;

      $.ajax(
        '/api/branches/' + this.model.get('id'), 
        {
          type: 'DELETE', 
          success: function() {
            new PopupView({
              el: $('#popup'), 
              text: 'Branch deleted, jumping to parent'
            }).render();            
            
            setTimeout(function() {
              window.location.hash = 'branch/' + that.model.get('parent');
            }, 2000);
          },
          error: function() {
            new PopupView({
              el: $('#popup'), 
              text: 'Could not delete branch (probably because it has some children)', 
              okButton: true
            }).render();
        }
      });
    },

    newBranch: function() {
      /*
      var arr = this.model.get('children');
      arr.push('1234');
      this.model.set({children: arr});
      this.update();
      */
      var that = this;
      $.post('/api/branches', {
        parentId: this.model.get('id'),
        title: $('#new_branch input[name=title]').val(),
        text: ''
      }, function() {
        that.model.get('children').fetch({reset: true});
      }).error(function(){
        that.$el.html('Error adding branch');
      });

      return false; // to remain on current view
    }
  });
  return branchView;
});