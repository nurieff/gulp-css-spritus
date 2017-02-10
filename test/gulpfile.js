var gulp = require('gulp')
  , spritus = require('../index')
  , sass = require('gulp-sass');

var config = {
  imageDirSave: 'public/images/',
  saveImage: true,
  withImagemin: true
};

gulp.task('css', function () {
  return gulp.src('./assets/css/*.css')
    .pipe(spritus(config))
    .pipe(gulp.dest('./public/css'));
});

gulp.task('scss', function () {
  return gulp.src('./scss/**/*.scss')
    .pipe(sass().on('error', sass.logError))
    .pipe(spritus(config))
    .pipe(gulp.dest('./public/css'));
});

gulp.task("default", ['css', 'scss']);