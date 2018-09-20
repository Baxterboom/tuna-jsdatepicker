const gulp = require("gulp");
const sass = require("gulp-sass");
const rename = require("gulp-rename");

const bs = require("browser-sync").create();

const typescript = require('gulp-typescript');
const tsc = typescript.createProject('tsconfig.json');

gulp.task("default", ["dev"]);
gulp.task("dev", ["watch"]);
gulp.task("build", ["sass", "typescript"]);

gulp.task('typescript', function () {
  const prj = tsc.src()
    .pipe(tsc());

  return prj.js.pipe(gulp.dest('.'));
});

gulp.task("sass", function () {
  return gulp.src("./src/*.scss")
    .pipe(sass())
    .pipe(rename("tuna-jsdatepicker.css"))
    .pipe(gulp.dest("./dist"));
});

gulp.task("watch", ["typescript", "sass", "bs"], function () {
  gulp.watch("./src/**/*.ts", ["typescript"]);
  gulp.watch("./src/**/*.scss", ["sass"]);

  gulp.watch("./dist/**/*.*").on('change', bs.reload);
  gulp.watch("./demo/**/*.html").on('change', bs.reload);
});

gulp.task("bs", function () {
  bs.init({
    server: {
      baseDir: ["./demo"],
      routes: {
        "/dist": "dist",
        "/node_modules": "node_modules"
      }
    },
  })
});