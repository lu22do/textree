define(['TextreeView', 'text!templates/help.html'],
       function(TextreeView, helpTemplate) {

  var helpView = TextreeView.extend({
    el: $('#content'),

    events: {
    },

    initialize: function(options) {
    },

    render: function() {
      this.$el.html(helpTemplate); 
    },

  });
  return helpView;
});