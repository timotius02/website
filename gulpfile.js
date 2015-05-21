/*
 * gulp web development setup for SCSS + Minification
 * by Timotius Sitorus
 */
var http = require('http');

// Load plugins
var gulp = require('gulp'),
    del = require('del');

var $ = require('gulp-load-plugins')();
var browserSync = require('browser-sync');

// HTML minification
gulp.task('html', function() {
    gulp.src('src/*.html')
        .pipe(gulp.dest('dist'))
        .pipe(browserSync.stream());
});

// Styles
gulp.task('styles', function() {
    return gulp.src('src/styles/**/*.scss')
        .pipe($.sass({
            includePaths: require('node-bourbon').includePaths,
            errLogToConsole: true
        }))
        .pipe($.rename({
            suffix: '.min'
        }))
        .pipe($.minifyCss())
        .pipe(gulp.dest('dist/styles'))
        .pipe(browserSync.stream());
});

// Scripts
gulp.task('scripts', function() {
    return gulp.src('src/scripts/**/*.js')
        .pipe($.jshint('.jshintrc'))
        .pipe($.jshint.reporter('default'))
        .pipe($.concat('main.js'))
        .pipe(gulp.dest('dist/scripts'))
        .pipe($.rename({
            suffix: '.min'
        }))
        .pipe($.uglify())
        .pipe(gulp.dest('dist/scripts'))
        .pipe(browserSync.stream());
});

// Images
gulp.task('images', function() {
    return gulp.src('src/images/*')
        .pipe($.cache($.imagemin({
            optimizationLevel: 3,
            progressive: true,
            interlaced: true
        })))
        .pipe(gulp.dest('dist/images'))
        .pipe(browserSync.stream());
});

gulp.task('fonts', function() {
    return gulp.src('src/fonts/*')
        .pipe(gulp.dest('dist/fonts'))
        .pipe(browserSync.stream());
});

gulp.task('clearCache', function() {
    // Still pass the files to clear cache for
    gulp.src('./lib/*.js')
        .pipe($.cache.clear());

    // Or, just call this for everything
    cache.clearAll();
});

// Clean
gulp.task('clean', function(cb) {
    del(['dist/styles/*', 'dist/scripts/*', 'dist/images/*', 'dist/fonts/*', 'dist/*.html'], cb);
});

gulp.task('init', ['clean'], function(cb) {
    gulp.start('html', 'styles', 'scripts', 'images', 'fonts');
});

// Watch
gulp.task('watch', function() {

    browserSync.init({
        server: "./dist",
        notify: false
    });

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

    // Watch any files in dist/, reload on change
    //gulp.watch(['dist/**']).on('change', livereload.changed);

});

// Default task
gulp.task('default', ['init', 'watch']);
