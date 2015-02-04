module.exports = function(grunt) {
	grunt.config.set("copy", {
		css: {
			src: "css/styles.min.css",
			dest: "_includes/styles.html"
		},
		html5shiv: {
			src: "_lib/html5shiv/dist/html5shiv.min.js",
			dest: "js/html5shiv.min.js"
		}
	});

	grunt.loadNpmTasks("grunt-contrib-copy");
};