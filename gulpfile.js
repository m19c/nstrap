'use strict';

var gulp     = require('gulp'),
    eslint   = require('gulp-eslint'),
    mocha    = require('gulp-mocha'),
    coverage = require('gulp-coverage'),
    exec     = require('child_process').exec,
    rs       = require('run-sequence');

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
    .pipe(coverage.format([
      {
        reporter: 'lcov',
        outFile:  'coverage.lcov'
      },
      {
        reporter: 'html',
        outFile:  'report.html'
      }
    ]))
    .pipe(gulp.dest('dist/'))
  ;
});

gulp.task('ccm', function (done) {
  exec(
    'CODECLIMATE_REPO_TOKEN=9d7be636d8c5a527bb4e1273cbd4dea57fc3124f7b46a411d1e668c1dffd9684 ./node_modules/.bin/codeclimate-test-reporter < ./dist/coverage.lcov',
    function (err) {
    done(err);
  });
});

gulp.task('default', function (done) {
  rs('lint', 'test', 'ccm', done);
});