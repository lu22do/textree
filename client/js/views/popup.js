define(['text!templates/popup.html'], 
       function(popupTemplate) {
  var popupView = Backbone.View.extend({
    
    events: {
      'click #confirm_button': 'confirm',
      'click #cancel_button': 'cancel'
    },

    initialize: function(options) {
      this.cb = options.cb;
    },

    render: function() {
      $('#popup').show();
      this.$el.html(popupTemplate);
    },

    confirm: function() {
      $('#popup').hide();
      this.cb();
    },

    cancel: function() {
      $('#popup').hide();
    },
  });

  return popupView;
});