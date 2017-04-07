var gulp        = require('gulp'),
    cssmin      = require('gulp-cssmin'),
    rename      = require('gulp-rename'),
    concat      = require('gulp-concat'),
    runSequence = require('run-sequence'),
    uglify      = require('gulp-uglify'),
    pump        = require('pump');

var jsDir = 'js';
var cssDir = 'css';

gulp.task('default', ['watch']);

gulp.task('minifyCss', function() {
  return gulp.src(['./' + cssDir + '/*.css', '!./' + cssDir + '/*.min.css'])
    .pipe(cssmin())
    .pipe(rename({suffix: '.min'}))
    .pipe(gulp.dest('./public'));
});

gulp.task('minifyJs', function (cb) {
  pump([
      gulp.src('./' + jsDir + '/*.js')
      .pipe(rename({suffix: '.min'})),
      uglify({
        compress: {
          drop_console: false
        }
      }),
      gulp.dest('./public')
    ],
    cb
  );
});

gulp.task('compile', function() {
  runSequence('minifyCss', 'minifyJs');
});

gulp.task('watch', function() {
  gulp.watch(['./' + cssDir +'/**/*.css', './' + jsDir +'/**/*.js'], ['compile']);
});