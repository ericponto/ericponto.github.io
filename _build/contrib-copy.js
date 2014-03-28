module.exports = function(grunt) {
	grunt.config.set("copy", {
		html: {
			src: "index.html",
			dest: "site/index.html"
		},
		img: {
			files: [{
				expand: true,
				cwd: "src/",
				src: ["img/**"],
				dest: "site/"
			}]
		}
	});

	grunt.loadNpmTasks("grunt-contrib-copy");
};