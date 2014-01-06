define(['TextreeView', 'text!templates/branch.html', 'models/Branch'],
	function(TextreeView, branchTemplate, Branch) {
  var branchView = TextreeView.extend({
    el: $('#content'),

    events: {
    	"click #save_branch_button": "saveBranch",
    	"submit #new_branch": "newBranch"
    },

    initialize: function(options) {
      this.model.bind('change', this.update, this);
    },

    update: function() {
      this.$el.html(_.template(branchTemplate, this.model.toJSON()));
		},

    render: function() {
    	// show loading indicator?
		},

    saveBranch: function() {
    	console.log('update: ' + $('#branch_text').val());
  
    	$.ajax(
        '/api/branches/' + this.model.get('_id'), 
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
            console.log("update success");
          },
          error: function() {
          	alert('Could not update branch');
        	}
        }
      );
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
        parentId: this.model.get('_id'),
        title: $('input[name=title]').val(),
        text: ''
      }, function(newbranch) {
      	that.model.fetch();
      }).error(function(){
        that.$el.html("Error adding branch");
      });

		  return false; // to remain on current view
		}
	});
	return branchView;
});