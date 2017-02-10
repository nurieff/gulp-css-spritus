var gulp = require('gulp')
  , spritus = require('../index')
  , sass = require('gulp-sass');

var config = {
  imageDirSave: 'public/images/'
};

gulp.task('css', function () {
  return gulp.src('./assets/css/*.css')
    .pipe(spritus(config))
    .pipe(gulp.dest('./public/css'));
});

gulp.task('scss', function () {
  return gulp.src('./assets/scss/**/*.scss')
    .pipe(sass().on('error', sass.logError))
    .pipe(spritus(config))
    .pipe(gulp.dest('./public/css'));
});

gulp.task("default", ['css', 'scss']);

gulp.task("watch", function () {

  gulp.watch([
    './assets/css/*.css'
  ], ['css']);

  gulp.watch([
    './assets/scss/*.scss'
  ], ['scss']);

});