module.exports = function(grunt) {
	grunt.config.set("uglify", {
		prod: {
			files: {
				"js/scripts.js": "_js/scripts.js"
			}
		}
	});

	grunt.loadNpmTasks("grunt-contrib-uglify");
};