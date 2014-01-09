define(['text!templates/topbar.html'], function(topbarTemplate) {
  var topbarView = Backbone.View.extend({
    el: $('#topbar ul'),

    events: {
      'click li': 'jump'
    },

    // from <li> id to links
    routes: {
      'topbar_index': '#index',
      'topbar_treelist': '#treelist',
      'topbar_createtree': '#createtree', 
      'topbar_myprofile': '#profile/me',
      'topbar_mycontacts': '#contacts/me',
      'topbar_logout': '#logout'
    },

    currentHighlight: null, // topbar's highlighted link

    render: function(TopbarLink) { 
      if (TopbarLink === '') {
        this.$el.html('');
        this.currentHighlight = null;
      } 
      else {
        if (this.currentHighlight === null) {
          this.$el.html(topbarTemplate);
        } else {
          $('#topbar_' + this.currentHighlight).removeClass('topbar_selected');          
        }
        $('#topbar_' + TopbarLink).addClass('topbar_selected');
        this.currentHighlight = TopbarLink;
      }
    },

    jump: function(e) {
      window.location.hash = this.routes[e.target.id];
    }
  });

  return topbarView;
});
