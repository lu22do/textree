define(['TextreeView', 
        'models/BranchCollection', 'models/Branch'],
       function(TextreeView,
                BranchCollection, Branch) {
  
  var visualizerView = TextreeView.extend({
    paper: undefined,

    initialize: function(options) {
      this.router = options.router;

      this.model.bind('change', this.update, this);

      this.paper = new Raphael(this.el, 200, 200);
    },

    update: function() {
      // this.model
    },

    addBranch: function(level, index) {
      if (level > 0) {
        var xpos = -30 * index;
        var ypos = 100 + (level-1)*50;
        var pathstr = 'M 100 ' + ypos + ' l ' + xpos + ' 50 z';
        var path = this.paper.path(pathstr).attr({'stroke-width': '2px', stroke: '#603e27'});        
      }
      var circle = this.paper.circle(100 - 30 * index, 100 + level*50, 10).attr({fill: '#4D4', 'stroke-width': '2px', stroke: '#000'});
    },

    render: function() {
      this.addBranch(1, -1);
      this.addBranch(1, 0);
      this.addBranch(1, 1);
      this.addBranch(0, 0);
    },

  });
  return visualizerView;
});