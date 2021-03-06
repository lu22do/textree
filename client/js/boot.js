requirejs.config({
  paths: {
    'jQuery': 'libs/jquery-2.0.3.min',
    'Underscore': 'libs/underscore',
    'Backbone': 'libs/backbone',
    'Bootstrap': 'libs/bootstrap.min',
    'jquery-te': 'libs/jquery-te-1.4.0.min',
    'text': 'libs/text',
    'models': 'models',
    'templates': '../templates'
  },

  shim: {
    'Backbone': ['Underscore', 'jQuery'],
    'Bootstrap': ['jQuery'],
    'Textree': ['Backbone', 'Bootstrap']
  }
});

require(['Textree'], function(Textree) {
  Textree.initialize();
});