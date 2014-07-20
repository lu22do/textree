define(['TextreeView', 'text!templates/tree.html', 'views/branch',
        'models/BranchCollection', 'models/Branch'],
       function(TextreeView, treeTemplate, BranchView,
                BranchCollection, Branch) {
  
  function loadBranch(that, id, depth, selectedChildIndex) {
    var branchModel = new Branch({id: id});
    branchModel.url = '/api/branches/' + id;
    branchModel.set("depth", depth);

    that.curTree[depth] = branchModel;

    var branchHtml = (new BranchView({ 
      model: branchModel,
      router: that.router, 
      selectedChildIndex: selectedChildIndex,
      readingMode: that.model.get('readingMode'),
      treeView: that,
    })).render().el;
    $(branchHtml).appendTo('#branchescolumn');

    branchModel.fetch();
  }

  var treeView = TextreeView.extend({
    el: $('#content'),

    curTree: [],

    events: {
      'click #treetop': 'jumpToTop'
    },

    initialize: function(options) {
      this.router = options.router;

      this.model.bind('change', this.update, this);
    },

    // notification that a branch is loaded, let's load one child branch
    branchLoaded: function(branch, selectedChildIndex) {
      if (this.model.get('readingMode') == 'branch_by_branch') {
        return;
      }

      var children = branch.get('children');
      if (children.length === 0) {
        return;
      }

      if (selectedChildIndex === undefined) {
        selectedChildIndex = 0;
      }

      var firstChildId = children.at(selectedChildIndex).get('_id'); /* why _id and not id ? */

      loadBranch(this, firstChildId, branch.get('depth') + 1, 0);
    },

    selectChildBranch: function(depth, childId) {
      if (this.model.get('readingMode') == 'branch_by_branch') {
        $('#branchescolumn').empty();
      }
      else {
        var children = $('#branchescolumn').children();
        for (var i = children.length - 1; i > depth; i--) {
          children[i].remove();
        }
      }

      loadBranch(this, childId, depth + 1, undefined);
    },

    reloadBranch: function(depth, id, selectedChildIndex) {
      if (this.model.get('readingMode') == 'branch_by_branch') {
        $('#branchescolumn').empty();
      }
      else {
        var children = $('#branchescolumn').children();
        for (var i = children.length - 1; i >= depth; i--) {
          children[i].remove();
        }
      }

      loadBranch(this, id, depth, selectedChildIndex);
    },

    jumpToTop: function() {
      this.reloadBranch(0, this.model.get('rootBranch'));
    },

    update: function() {
      this.$el.html(_.template(treeTemplate, {tree: this.model})); 

      $('#treeinfo').hover(function(e) {
        $('#edittree').show();
        $('#description').fadeIn();
      }, function(e) {
        $('#edittree').hide();
        $('#description').fadeOut();
      });

      loadBranch(this, this.model.get('rootBranch'), 0, 0);
    },

    render: function() {
    },

  });
  return treeView;
});