/* Gulp Configuration */
'use strict';
// Load plugins
const gulp = require('gulp'),
    sass = require('gulp-ruby-sass'),
    autoprefixer = require('gulp-autoprefixer'),
    cssnano = require('gulp-cssnano'),
    sassLint = require('gulp-sass-lint'),
    uglify = require('gulp-uglify'),
    rename = require('gulp-rename'),
    concat = require('gulp-concat'),
    notify = require('gulp-notify'),
    livereload = require('gulp-livereload'),
    del = require('del');

// Styles
gulp.task('styles', function() {
    return sass('public/scss/theme.scss', { style: 'expanded' })
        .pipe(sassLint())
        .pipe(sassLint.format())
        .pipe(sassLint.failOnError())
        .pipe(autoprefixer('last 2 version'))
        .pipe(gulp.dest('public/dist'))
        .pipe(rename({ suffix: '.min' }))
        .pipe(cssnano())
        .pipe(gulp.dest('public/dist'))
        .pipe(notify({ message: 'Styles task complete' }));
});

// Scripts
gulp.task('scripts', function() {
    return gulp.src('public/js/**/*.js')
        .pipe(concat('main.js'))
        .pipe(gulp.dest('public/dist'))
        .pipe(rename({ suffix: '.min' }))
        .pipe(uglify())
        .pipe(gulp.dest('public/dist'))
        .pipe(notify({ message: 'Scripts task complete' }));
});

// Clean
gulp.task('clean', function() {
    return del(['public/dist']);
});

// Default task
gulp.task('default', ['clean'], function() {
    gulp.start('styles', 'scripts');
});

// Watch
gulp.task('watch', function() {

    // Watch .scss files
    gulp.watch('public/scss/**/*.scss', ['styles']);

    // Watch .js files
    gulp.watch('public/js/**/*.js', ['scripts']);

    // Create LiveReload server
    livereload.listen();

    // Watch any files in dist/, reload on change
    gulp.watch(['public/dist/**']).on('change', livereload.changed);
});