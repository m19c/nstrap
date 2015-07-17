'use strict';

var gulp     = require('gulp'),
    eslint   = require('gulp-eslint'),
    mocha    = require('gulp-mocha'),
    coverage = require('gulp-coverage');

gulp.task('lint', function () {
  return gulp
    .src(['lib/**/*', 'test/**/*', 'index.js', 'gulpfile.js'])
    .pipe(eslint({
      configFile: '.eslintrc'
    }))
    .pipe(eslint.format())
    .pipe(eslint.failOnError())
  ;
});

gulp.task('test', function () {
  return gulp
    .src(['test/**/*.test.js'], { read: false })
    .pipe(coverage.instrument({
      pattern:        ['lib/**/*', 'index.js'],
      debugDirectory: 'dist/debug'
    }))
    .pipe(mocha())
    .pipe(coverage.gather())
    .pipe(coverage.format())
    .pipe(gulp.dest('dist/report'))
  ;
});

gulp.task('default', ['lint', 'test']);