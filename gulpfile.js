const gulp = require("gulp");
const sass = require("gulp-sass");
const rename = require("gulp-rename");

const b = require("browser-sync").create();

const typescript = require('gulp-typescript');
const tsc = typescript.createProject('tsconfig.json');

/*
============================================================================================================
tasks - main
============================================================================================================
*/

gulp.task("dev", ["watch"]);
gulp.task("build", ["sass", "ts"]);
gulp.task("default", ["dev"]);

/*
============================================================================================================
tasks - subs
============================================================================================================
*/

gulp.task('ts', function () {
  const prj = tsc.src()
    .pipe(tsc())
    .on('error', e => console.error(e));

  return prj.js.pipe(gulp.dest('.'));
});

gulp.task("sass", function () {
  return gulp.src("./src/*.scss")
    .pipe(sass())
    .on('error', e => console.error(e))
    .pipe(rename("tuna-jsdatepicker.css"))
    .pipe(gulp.dest("./dist"));
});

gulp.task("watch", ["ts", "sass", "browsersync"], function () {
  gulp.watch("./src/**/*.ts", ["ts"]);
  gulp.watch("./src/**/*.scss", ["sass"]);

  gulp.watch("./dist/**/*.*").on('change', b.reload);
  gulp.watch("./demo/**/*.html").on('change', b.reload);
});

gulp.task("browsersync", function () {
  b.init({
    server: {
      baseDir: ["./demo"],
      routes: {
        "/dist": "dist",
        "/node_modules": "node_modules"
      }
    },
  })
});