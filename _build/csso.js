module.exports = function(grunt) {
	grunt.config.set("csso", {
		prod: {
			options: {
				report: "min"
			},
			files: {
				"css/styles.min.css": ["css/styles.css"]
			}
		}
	});

	grunt.loadNpmTasks("grunt-csso");
};