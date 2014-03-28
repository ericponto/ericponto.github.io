module.exports = function(grunt) {
	grunt.config.set("autoprefixer", {
		prod: {
			src: "css/styles.css"
		}
	});

	grunt.loadNpmTasks("grunt-autoprefixer");
};