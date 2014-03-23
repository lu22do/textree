module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),

    jshint: {
      all: ['Gruntfile.js', 'client/js/*.js', 'client/js/views/*', 'client/js/models/*', 
            'server/*.js', 'server/models/*.js', 'server/routes/*.js']
    },

    requirejs: {
      compile: {
        options: {
          baseUrl: 'client/js',
          mainConfigFile: 'client/js/boot.js',
          name: 'boot',
          out: 'client/build/js/client-optimized.js'
        }
      }
    },

    push: {
      origin: {
        options: {
          remote: 'origin'
        }
      },
      heroku: {
        options: {
          remote: 'heroku'
        }
      }
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
  grunt.loadNpmTasks('grunt-contrib-requirejs');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-git');

  // Default task(s).
  grunt.registerTask('default', [
    'jshint'
  ]);

  grunt.registerTask('build', [
    'jshint',
    'requirejs'
  ]);

  grunt.registerTask('serve', [
    'watch'
  ]);
};

