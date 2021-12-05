module.exports = function (grunt) {
  // 載入外掛
  ["grunt-cafe-mocha", "grunt-contrib-jshint", "grunt-exec"].forEach(function (
    task
  ) {
    grunt.loadNpmTasks(task);
  });

  //設置外掛
  grunt.initConfig({
    cafemocha: {
      all: { src: "qa/tests-*.js", option: { ui: "tdd" } },
    },
    jshint: {
      app: ["mdl.js", "public/js/**/*.js", "lib/**/*.js"],
      qa: ["Gruntfile.js", "public/qa/**/*.js", "qa/**/*.js"],
    },
    exec: {
      linkcheck: { cmd: "linkchecker http://localhost:3000" },
    },
  });

  //註冊工作
  grunt.registerTask("default", ["cafemocha", "jshint", "exec"]);
};
