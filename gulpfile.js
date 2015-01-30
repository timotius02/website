/*
 * gulp web development setup for SCSS + Minification
 * by Timotius Sitorus
 */
var http = require('http');

// Load plugins
var gulp = require('gulp'),
    sass = require('gulp-sass'),
    minifycss = require('gulp-minify-css'),
    jshint = require('gulp-jshint'),
    uglify = require('gulp-uglify'),
    imagemin = require('gulp-imagemin'),
    rename = require('gulp-rename'),
    concat = require('gulp-concat'),
    cache = require('gulp-cache'),
    del = require('del'),
    connect = require('gulp-connect');

// HTML minification
gulp.task('html', function() {
    gulp.src('src/*.html')
        .pipe(gulp.dest('dist'))
        .pipe(connect.reload());
});

// Styles
gulp.task('styles', function() {
    return gulp.src('src/styles/styles.scss')
        .pipe(sass({
          includePaths: require('node-bourbon').includePaths,
          errLogToConsole: true
        }))
        .pipe(gulp.dest('dist/styles'))
        .pipe(rename({
            suffix: '.min'
        }))
        .pipe(minifycss())
        .pipe(gulp.dest('dist/styles'))
        .pipe(connect.reload());
});

// Scripts
gulp.task('scripts', function() {
    return gulp.src('src/scripts/**/*.js')
        .pipe(jshint('.jshintrc'))
        .pipe(jshint.reporter('default'))
        .pipe(concat('main.js'))
        .pipe(gulp.dest('dist/scripts'))
        .pipe(rename({
            suffix: '.min'
        }))
        .pipe(uglify())
        .pipe(gulp.dest('dist/scripts'))
        .pipe(connect.reload());
});

// Images
gulp.task('images', function() {
    return gulp.src('src/images/*')
        .pipe(cache(imagemin({
            optimizationLevel: 3,
            progressive: true,
            interlaced: true
        })))
        .pipe(gulp.dest('dist/images'))
        .pipe(connect.reload());
});

gulp.task('fonts', function() {
    return gulp.src('src/fonts/*')
        .pipe(gulp.dest('dist/fonts'))
        .pipe(connect.reload());
});

gulp.task('connect', function() {
    connect.server({
        root: 'dist',
        livereload: true
    });
});

gulp.task('clearCache', function() {
  // Still pass the files to clear cache for
  gulp.src('./lib/*.js')
    .pipe(cache.clear());

  // Or, just call this for everything
  cache.clearAll();
});

// Clean
gulp.task('clean', function(cb) {
    del(['dist/styles/*', 'dist/scripts/*', 'dist/images/*', 'dist/fonts/*', 'dist/*.html'], cb)
});

gulp.task('init', ['clean'], function(cb){
  gulp.start('html', 'styles', 'scripts', 'images', 'fonts');
});

// Watch
gulp.task('watch', function() {

    // Watch html files
    gulp.watch('src/*.html', ['html']);

    // Watch .scss files
    gulp.watch('src/styles/**/*.scss', ['styles']);

    // Watch .js files
    gulp.watch('src/scripts/**/*.js', ['scripts']);

    // Watch image files
    gulp.watch('src/images/**/*', ['images']);

    // Watch image files
    gulp.watch('src/fonts/**/*', ['fonts']);

    // Create LiveReload server
    //livereload.listen();

    // Watch any files in dist/, reload on change
    //gulp.watch(['dist/**']).on('change', livereload.changed);

});

// Default task
gulp.task('default', ['connect','init', 'watch']);
