/*globals module */
module.exports = function(grunt) {
    'use strict';

    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        jsFiles: [
            'Gruntfile.js',
            'app/scripts/app.js'
        ],

        uglify: {
            options: {
                banner: '/*! MichaelWales.com <%= pkg.version %> | ' +
                        'Copyright (c) <%= grunt.template.date("yyyy") Michael Wales */\n',
                report: 'gzip'
            },

            dist: {
                files: {
                    'app/scripts/app.min.js': 'app/scripts/app.js'
                }
            }
        },

        jshint: {
            options: {
                jshintrc: true
            },

            files: '<%= jsFiles %>'
        },

        watch: {
            options: {
                atBegin: true
            },

            files: '<%= jsFiles %>',
            tasks: 'default'
        }
    });

    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-watch');

    grunt.registerTask('test', ['jshint']);
    grunt.registerTask('default', ['test', 'uglify']);
};
