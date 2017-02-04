define(['TextreeView', 
        'models/BranchCollection', 'models/Branch'],
       function(TextreeView,
                BranchCollection, Branch) {
  
  var visualizerView = TextreeView.extend({
    paper: undefined,

    initialize: function(options) {
      this.router = options.router;

      this.model.bind('change', this.update, this);

      this.paper = new Raphael(this.el, 300, 400);
    },

    parseHierarchy: function(parent, data, level) {
      var branch = this.addBranch(parent, {id: data.id, title: data.title}, level);

      if (!data.children) {
        alert('ouch');
      }

      var that = this;
      for (var i = 0; i < data.children.length; i++) {
        function startTimeout(index) {
          setTimeout(function() {
            that.parseHierarchy(branch, data.children[index], level+1);
          }, 500*(index+1));
        }

        startTimeout(i);

//        that.parseHierarchy(branch, data.children[i], level+1);

      }
    },

    update: function() {

      var that = this;
      $.ajax(
        '/api/branches/hierarchy/' + this.model.get('rootBranch'), 
        {
          type: 'GET',
          success: function(data) {
            data.title = 'Root';
            that.parseHierarchy(undefined, data, 0);
          },
          error: function() {
            alert('Could not update readingMode!');
          }
        }
      );
    },

    RADIUS: 20,
    MIN_SPACE: 10,  // minimum horizontal space between 2 circles at a given level
    array: [], // array of arrays of visual objects for each level

    addBranch: function(parent, obj, level) {
      if (!this.array[level]) {
        this.array[level] = [];
      }

      var y = 100 + level*50;
      var circle = this.paper.circle(0, y, this.RADIUS).attr({fill: '#4D4', 'stroke-width': '1px', stroke: '#000'});
      var text = this.paper.text(0, y, obj.title).attr({fill: '#000'});
      var path = this.paper.path('').attr({'stroke-width': '2px', stroke: '#603e27'}).toBack();

      this.array[level].push({path: path, circle: circle, text: text});

      // adjust x position of all circles on same level - issue: children position are not updated
      var x_parent = (parent ? parent.attr('cx') : 100);
      var y_parent = (parent ? parent.attr('cy') : 100);
      var nb = this.array[level].length;
      for (var i = 0; i < nb; i ++) {
        var x = x_parent + (this.RADIUS + this.MIN_SPACE/2) * (2*i - (nb-1));
        if (i === nb-1) {
          this.array[level][i].circle.attr({cx: x});
          this.array[level][i].text.attr({x: x});          
        }
        else {
          this.array[level][i].circle.animate({cx: x}, 1000);
          this.array[level][i].text.animate({x: x}, 1000);          
        }

        if (level > 0) {
          var pathstr = 'M' + x_parent + ',' + y_parent + 'L' + x + ',' + y + 'z';
          if (i === nb-1) {
            this.array[level][i].path.attr({path: pathstr});
          } 
          else {
            this.array[level][i].path.animate({path: pathstr}, 1000);
          }
        }   
      }

      return circle;
    },

    showDummy: false,
    render: function() {
      if (this.showDummy) {
        var that = this;
        var root = this.addBranch(undefined, {title: 'Root'}, 0, 0);
        setTimeout(function() {
          that.addBranch(root, {title: 'TOto'}, 1);
        },1000);
        setTimeout(function() {
          that.addBranch(root, {title: 'Titi'}, 1);
        },2000);
        setTimeout(function() {
          that.addBranch(root, {title: 'Tataaaa'}, 1);
        },3000);        
      }
    },

  });
  return visualizerView;
});