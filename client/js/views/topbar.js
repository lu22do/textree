define(['text!templates/topbar.html'], function(topbarTemplate) {
  var topbarView = Backbone.View.extend({
    el: $('#topbar ul'),

    events: {
      'click li': 'jump'
    },

    // from <li> id to links
    routes: {
      'topbar_index': '#index',
      'topbar_mytrees': '#treelist/me',
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
          this.$el.html(_.template(topbarTemplate, {loggedUser: this.loggedUser}));
        } else {
          $('#topbar_' + this.currentHighlight).parent().removeClass('active');          
        }
        $('#topbar_' + TopbarLink).parent().addClass('active');
        this.currentHighlight = TopbarLink;
      }
    },

    setLoggedUser: function(loggedUser) {
      this.loggedUser = loggedUser;
    },

    jump: function(e) {
      window.location.hash = this.routes[e.target.id];
    }
  });

  return topbarView;
});
