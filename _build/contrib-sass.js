module.exports = function(grunt) {
	grunt.config.set("sass", {
		prod: {
			files: {
				"css/styles.css": "_scss/styles.scss"
			}
		}
	});

	grunt.loadNpmTasks("grunt-contrib-sass");
};