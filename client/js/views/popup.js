define(['text!templates/popup.html'], 
       function(popupTemplate) {
  var popupView = Backbone.View.extend({
    
    events: {
      'click #confirm_button': 'confirm',
      'click #cancel_button': 'cancel',
      'click #ok_button': 'ok'
    },

    initialize: function(options) {
      this.cb = options.cb;
      this.text = options.text;
      this.confirmButtons = options.confirmButtons;
      this.okButton = options.okButton;
    },

    render: function() {
      $('#popup').show();
      this.$el.html(_.template(popupTemplate, {text: this.text, confirmButtons: this.confirmButtons, okButton: this.okButton}));
      if (this.confirmButtons) {
        $('#confirm_button').focus();
      }
      if (this.okButton) {
        $('#ok_button').focus();
      }
    },

    confirm: function() {
      $('#popup').hide();
      this.cb();
    },

    cancel: function() {
      $('#popup').hide();
    },

    ok: function() {
      $('#popup').hide();
    },
  });

  return popupView;
});