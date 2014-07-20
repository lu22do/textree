define(['TextreeView', 'text!templates/about.html'],
       function(TextreeView, aboutTemplate) {

  var aboutView = TextreeView.extend({
    el: $('#content'),

    events: {
    },

    initialize: function(options) {
    },

    render: function() {
      this.$el.html(aboutTemplate); 
    },

  });
  return aboutView;
});