requirejs.config({
  paths: {
    'jQuery': 'libs/jquery-2.0.3.min',
    'Underscore': 'libs/underscore',
    'Backbone': 'libs/backbone',
    'text': 'libs/text',
    'models': 'models',
    'templates': '../templates'
  },

  shim: {
    'Backbone': ['Underscore', 'jQuery'],
    'Textree': ['Backbone']
  }
});

require(['Textree'], function(Textree) {
  Textree.initialize();
});