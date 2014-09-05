module.exports = function(grunt) {
	grunt.config.set("copy", {
		css: {
			src: "css/styles.min.css",
			dest: "_includes/styles.html"
		}
	});

	grunt.loadNpmTasks("grunt-contrib-copy");
};