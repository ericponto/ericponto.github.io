module.exports = function(grunt) {

	grunt.loadTasks("_build");

	grunt.registerTask("build",
		"build the site",
		["less", "autoprefixer", "csso", "uglify", "copy"]
	);

	grunt.registerTask("default", ["build"]);
};