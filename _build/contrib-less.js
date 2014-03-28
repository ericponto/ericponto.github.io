module.exports = function(grunt) {
	grunt.config.set("less", {
		prod: {
			files: {
				"css/styles.css": "_less/styles.less"
			},
			options: {
				cleancss: true
			}
		}
	});

	grunt.loadNpmTasks("grunt-contrib-less");
};