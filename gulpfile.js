/*
 * gulp web development setup for SCSS + Minification
 * by Timotius Sitorus
 */
var http = require('http');

// Load plugins
var gulp = require('gulp');
var $ = require('gulp-load-plugins')();
var del = require('del');
var browserSync = require('browser-sync');

// Browserify + JSX compilation
var source = require('vinyl-source-stream');
var buffer = require('vinyl-buffer');
var browserify = require('browserify');
var reactify = require('reactify');


// HTML minification
gulp.task('html', function() {
    gulp.src('src/*.html')
        .pipe(gulp.dest('dist'));
});

// Styles
gulp.task('styles', function() {
    return gulp.src('src/styles/**/*.scss')
        .pipe($.sass({
            includePaths: require('node-bourbon').includePaths,
            errLogToConsole: true
        }))
        .pipe(gulp.dest('dist/styles'))
        .pipe($.rename({
            suffix: '.min'
        }))
        .pipe($.minifyCss())
        .pipe(gulp.dest('dist/styles'));
});

// Scripts
gulp.task('scripts', function() {
    var b = browserify({
        entries: 'src/scripts/main.js',
        transform: [reactify],
        debug: true,
        cache: {},
        packageCache: {},
        fullPaths: true
    });

    return b.bundle()
        .pipe(source('main.js'))
        .pipe(buffer())
        .pipe(gulp.dest('dist/scripts'))
        .pipe($.rename({
            suffix: '.min'
        }))
        .pipe($.uglify())
        .pipe(gulp.dest('dist/scripts'));
});

// Images
gulp.task('images', function() {
    return gulp.src('src/images/*')
        .pipe($.cache($.imagemin({
            optimizationLevel: 3,
            progressive: true,
            interlaced: true
        })))
        .pipe(gulp.dest('dist/images'));
});

gulp.task('fonts', function() {
    return gulp.src('src/fonts/*')
        .pipe(gulp.dest('dist/fonts'));
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

gulp.task('reload', browserSync.reload);


// Watch
gulp.task('watch', function() {

    browserSync.init({
        server: "./dist",
        notify: false
    });


    // Watch html files
    gulp.watch('src/*.html', ['html', 'reload']);

    // Watch .scss files
    gulp.watch('src/styles/**/*.scss', ['styles', 'reload']);

    // Watch .js files
    gulp.watch('src/scripts/**/*.js', ['scripts', 'reload']);

    // Watch image files
    gulp.watch('src/images/**/*', ['images', 'reload']);

    // Watch image files
    gulp.watch('src/fonts/**/*', ['fonts', 'reload']);

    // Watch any files in dist/, reload on change
    //gulp.watch(['dist/**']).on('change', livereload.changed);

});

// Default task
gulp.task('default', ['init', 'watch']);
