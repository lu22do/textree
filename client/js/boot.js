require.config({
  paths: {
    jQuery: '/js/libs/jquery-2.0.3.min',
    Underscore: '/js/libs/underscore',
    Backbone: '/js/libs/backbone',
    models: 'models',
    text: '/js/libs/text',
    templates: '../templates',

    TextreeView: '/js/TextreeView'
  },

  shim: {
    'Backbone': ['Underscore', 'jQuery'],
    'Textree': ['Backbone']
  }
});

require(['Textree'], function(Textree) {
  Textree.initialize();
});