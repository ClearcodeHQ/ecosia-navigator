const gulp = require("gulp");
const sources = ["src/*", "node_modules/mousetrap/mousetrap.js"];

gulp.task("default", () => {
  return gulp.src(sources).pipe(gulp.dest("./build/ecosia-navigator"));
});
