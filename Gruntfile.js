module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),

    jshint: {
      all: ['Gruntfile.js', 'client/js/*.js', 'client/js/views/*', 'client/js/models/*', 
            'server/*.js', 'server/models/*.js', 'server/routes/*.js']
    },

    watch: {
      options: {
        livereload: true,
      },
      files: [
        'client/{,*/}*.html',
        'client/styles/{,*/}*.css',
        'client/js/{,*/}*.js',
        'client/images/{,*/}*.{gif,jpeg,jpg,png,svg,webp}'
      ]
    }
  });

  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-watch');

  // Default task(s).
  grunt.registerTask('default', ['jshint']);

  grunt.registerTask('serve', ['watch']);
};

