module.exports = function(grunt){
	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),
		watch: {
			js: {
				files: [
					"demo/**/*.js",
					"stub/*.json"
				],
				options: {
					livereload: true
				}
			}
		},

		connect: {
			server: {
				options: {
					livereload: true,
					port: 8000
				}
			}
		}
	});

	grunt.loadNpmTasks('grunt-contrib-watch');
	grunt.loadNpmTasks('grunt-contrib-connect');

	// Start web server
	grunt.registerTask('default', ['connect:server', 'watch']);
	grunt.loadTasks('tasks');
};
