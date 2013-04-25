
module.exports = function (grunt) {
  'use strict';

  grunt.initConfig({
    copy: {
      build: {
        expand: true,
        cwd: './',
        src: [
          'src/**',
          'manifest.json',
          'html/**',
          '!html/img/**',
          'Changes.md',
          'README.md',
          'icons/**',
          'lib/**'
        ],
        dest: 'builds/current/'
      }
    },

    clean: {
      current: 'builds/current/'
    },

    jshint: {
      options: {
        jshintrc: '.jshintrc'
      },
      all: [
        'Gruntfile.js',
        'src/**/*.js'
      ]
    },
  });

  grunt.registerTask('default', [
    'jshint'
  ]);

  grunt.registerTask('build', [
    'jshint',

    'clean:current',
    'copy:build'
  ]);

  // load all grunt tasks
  require('matchdep').filterDev('grunt-*').forEach(grunt.loadNpmTasks);

};
