define(['TextreeView', 'views/popup', 'text!templates/branch.html', 'models/BranchCollection' /*, 'models/Branch'*/],
       function(TextreeView, PopupView, branchTemplate, BranchCollection) {

  function convertHTMLtoText(str) {
    return str.replace(/<br>/gi, "\n");
  }

  function convertTexttoHTML(str) {
    return str.replace(/\n/g, "<br>");
  }

  function _toggleEditor(readingMode, depth) {
    if ($('#texteditor_container' + depth).is(":hidden")) {
      $('#texteditor_container' + depth).show();

      $('#texteditor' + depth).text(convertHTMLtoText($('#text' + depth).html()));

      var text_height = $('#text' + depth).height() + 20;
      if (text_height < 100) {
        text_height = 100;
      }
      $('#texteditor' + depth).height(text_height);    

      $('#text_container' + depth).hide();

      if (readingMode !== 'branch_by_branch') {
        if ($('#children_container' + depth).is(":visible")) {
          $('#children_container' + depth).slideUp();
        }        
      }
    }
    else {
      $('#texteditor_container' + depth).hide();
      $('#text_container' + depth).show();
    }
  }

  var branchView = TextreeView.extend({
    // el: $('#content'),

    requestColl: false,

    initialize: function(options) {
      this.router = options.router;
      this.selectedChildIndex = options.selectedChildIndex;
      this.readingMode = options.readingMode;
      this.treeView = options.treeView;
      this.showChildBranches = options.showChildBranches;

      if (this.selectedChildIndex === undefined) {
        this.selectedChildIndex = 0;
      }

      var children = new BranchCollection();
      children.url = '/api/branches/' + this.model.get('id') + '/children';
      this.model.set({children: children});

      children.bind('reset', this.update, this);

      this.model.bind('change', this.update, this);
    },

    update: function() {
      var that = this;

      /* FIXME: update is called twice: second time for children */
      if (!this.requestColl) {
        this.requestColl = true;
        this.model.get('children').fetch({reset: true});
        return;
      }

      this.treeView.branchLoaded.call(this.treeView, this.model, this.selectedChildIndex);

      var depth = that.model.get('depth');

      this.$el.addClass('row row' + depth);

      var children = this.model.get('children');
      if (children.length > 0 && this.selectedChildIndex !== undefined) {
        children.at(this.selectedChildIndex).set('selected', 'true');
      }

      this.$el.html(_.template(branchTemplate, {
        branch: this.model.toJSON(),
        children: children.toJSON(),
        loggedAccountId: this.router.loggedAccount._id,
        readingMode: this.readingMode
      }));

      this.$el.hover(function(e) {
        $('#edit' + depth).show();
        $('#show_branches' + depth).show();
      }, function(e) {
        $('#edit' + depth).hide();
        $('#show_branches' + depth).hide();
      });

      $('#edit' + depth).click(function(e) {
        _toggleEditor(that.readingMode, depth);
        e.preventDefault();
      });

      $('#show_branches' + depth).click(function(e) {
        if ($('#children_container' + depth).is(":hidden")) {
          $('#children_container' + depth).slideDown();
        } 
        else {
          $('#children_container' + depth).slideUp();
        }
        e.preventDefault();
      });

      // tests with contenteditable
      // $('#text' + depth).on('input', function() {
      //   console.log('input');
      // });
      // $('#text' + depth).on('focus', function() {
      //   console.log('focus');
      // });

      var obj = {};
      obj['click #save_branch_button' + depth] = 'saveBranch';
      obj['click #delete_branch_button' + depth] = 'deleteBranch';
      obj['click #create_branch_button' + depth] = 'newBranch';
      obj['click .select_branch_button'] = 'selectBranch';
      obj['click #new_branch_button' + depth] = 'newBranch';

      this.delegateEvents(obj);

      $('#cancel_save_branch_button' + depth).click(function() {
        $('#texteditor_container' + depth).hide();
        $('#text_container' + depth).show();
      });

      $('#new_branch_button' + depth).tooltip({delay: {show: 1000, hide: 100}});
      $('#edit' + depth).tooltip({delay: {show: 1000, hide: 100}});
      $('#show_branches' + depth).tooltip({delay: {show: 1000, hide: 100}});

      if (this.model.get('text') === null || this.model.get('text') === '') {
        _toggleEditor(this.readingMode, depth);
      }

      if (this.showChildBranches) {
        $('#children_container' + depth).show(); 
      }
    },

    render: function() {
      // show loading indicator?
      return this;
    },

    saveBranch: function() {
      var depth = this.model.get('depth');
//      console.log('updating: ' + $('#texteditor' + depth).val());
      var htmlText = convertTexttoHTML($('#texteditor' + depth).val());
      var that = this;

      $.ajax(
        '/api/branches/' + this.model.get('id'), 
        {
          type: 'PUT',
          data: {
            title: $('#branch_title' + depth).val(),
            text: htmlText
          }, 
          success: function() {
            $('#save_ok' + depth).fadeIn('slow', function() {
              setTimeout(function() {
                $('#save_ok' + depth).fadeOut('slow');
              }, 600);
            });
            $('#text' + depth).html(htmlText);
            $('#texteditor_container' + depth).hide();
            $('#text_container' + depth).show();
            $('#children_branch_list' + (depth - 1) + ' input').each(function(index) {
              if (this.value == that.model.get('id')) {
                $($(this).siblings().get(0)).text($('#branch_title' + depth).val());
              }
            });
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
      var parent = this.model.get('parent');
      var depth = this.model.get('depth');

      $.ajax(
        '/api/branches/' + this.model.get('id'), 
        {
          type: 'DELETE', 
          success: function() {
            if (that.readingMode != 'branch_by_branch') {
              that.treeView.reloadBranch.call(that.treeView, 
                                              depth - 1,
                                              parent);
            } else {
              new PopupView({
                el: $('#popup'), 
                text: 'Branch deleted, jumping to parent'
              }).render();            
              
              setTimeout(function() {
                that.treeView.reloadBranch.call(that.treeView, 
                                                depth - 1,
                                                parent);
              }, 1500);
            }
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
      var that = this;
      var depth = this.model.get('depth');
      var title = 'Branch ' + (this.model.get('children').length + 1);

      $.post('/api/branches', {
        parentId: this.model.get('id'),
        title: title,
        text: ''
      }, function(data) {
        if (that.readingMode !== 'branch_by_branch') {
          that.treeView.reloadBranch.call(that.treeView,
                                          depth,
                                          that.model.get('id'),
                                          that.model.get('children').length,
                                          true /* showChildBranches */);
        }
        else {
          that.treeView.selectChildBranch.call(that.treeView, 
                                               depth,
                                               data.id);          
        }
      }).error(function(){
        that.$el.html('Error adding branch');
      });

      return false; // to remain on current view
    },

    selectBranch: function(e) {
      var depth = this.model.get('depth');

      this.treeView.selectChildBranch.call(this.treeView,
                                          depth,
                                          $(e.target).attr('value'));

      if ($(e.target).prop('tagName') === 'A') {
        e.preventDefault();
      }
    }

  });
  return branchView;
});