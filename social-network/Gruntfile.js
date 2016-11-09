module.exports = function (grunt) {

    grunt.initConfig({
        pkg:grunt.file.readJSON('package.json'),

        uglify:{
            dist: {
                files: {

                }
            }
        },

        cssmin: {
            combine: {
                files: {

                }
            }
        }
    })
};

grunt.loadNpmTasks('grunt-contrib-cssmin');
grunt.loadNpmTasks('grunt-contrib-uglify');


grunt.registerTask('default',['cssmin','uglify']);