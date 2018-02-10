var gulp = require('gulp');
var ts = require('gulp-typescript');
var tsLint = require('gulp-tslint');
var tsProject = ts.createProject('src/tsconfig.server.json');

gulp.task('build', ['ts']);

gulp.task('ts', function () {
  return tsProject.src()
    .pipe(tsProject())
    .js.pipe(gulp.dest('dist'));
});

gulp.task('lint', function () {
  // noinspection JSUnresolvedFunction
  return tsProject.src()
    .pipe(tsLint())
    .pipe(tsLint.report());
});

gulp.task('watch', ['ts'], function () {
  gulp.watch('./src/**/*.ts', ['ts']);
});
