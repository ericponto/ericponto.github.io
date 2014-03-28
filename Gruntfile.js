module.exports = function(grunt) {

	grunt.loadTasks("_build");

	grunt.registerTask("build",
		"build the site",
		["less", "autoprefixer", "uglify"]
	);

	grunt.registerTask("default", ["build"]);
};