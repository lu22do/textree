requirejs.config({
  paths: {
    'jQuery': 'libs/jquery-2.0.3.min',
    'Raphael': 'libs/raphael',     // todo: use min
    'Underscore': 'libs/underscore',
    'Backbone': 'libs/backbone',
    'Bootstrap': 'libs/bootstrap.min',
    'text': 'libs/text',
    'models': 'models',
    'templates': '../templates'
  },

  shim: {
    'Backbone': ['Underscore', 'jQuery'],
    'Bootstrap': ['jQuery'],
    'Textree': ['Backbone', 'Bootstrap', 'Raphael']
  }
});

require(['Textree'], function(Textree) {
  Textree.initialize();
});