var gulp        = require('gulp');
var htmlmin     = require('gulp-htmlmin');
var cssmin      = require('gulp-cssmin');
var rename      = require('gulp-rename');
var concat      = require('gulp-concat');
var runSequence = require('run-sequence');
var uglify      = require('gulp-uglify');
var pump        = require('pump');

var jsDir       = 'src/js';
var cssDir      = 'src/css';
var htmlDir     = 'src/html';

gulp.task('default', ['watch']);

gulp.task('minifyHtml', function(){
  return gulp.src('./' + htmlDir + '/*.html')
    .pipe(htmlmin())
    .pipe(gulp.dest('./public/html'));
});

gulp.task('minifyCss', function() {
  return gulp.src('./' + cssDir + '/*.css')
    .pipe(cssmin())
    .pipe(rename({suffix: '.min'}))
    .pipe(gulp.dest('./public/css'));
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
      gulp.dest('./public/js')
    ],
    cb
  );
});

gulp.task('compile', function() {
  runSequence('minifyHtml', 'minifyCss', 'minifyJs');
});

gulp.task('watch', function() {
  gulp.watch(['./' + cssDir +'/**/*.css', 
              './' + cssDir +'/**/*.css', 
              './' + jsDir +'/**/*.js'], 
              ['compile']);
});