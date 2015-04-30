'use strict';

// Include dependencies
var gulp = require('gulp');
var $ = require('gulp-load-plugins')();
var del = require('del');
var browserSync = require('browser-sync');
var runSequence = require('run-sequence');
var reload = browserSync.reload;

var AUTOPREFIXER_BROWSERS = [
    'ie >= 8',
    'ie_mob >= 10',
    'ff >= 27',
    'chrome >= 31',
    'safari >= 5',
    'opera >= 23',
    'ios >= 7',
    'android >= 4',
    'bb >= 7'
];

var noop = function () {};


// Lint Javascript
gulp.task('jshint', function () {
    return gulp.src('app/scripts/**/*.js')
        .pipe(reload({
            stream: true,
            once: true
        }))
        .pipe($.ignore.exclude('*.min.js'))
        .pipe($.jshint())
        .pipe($.jscs())
        .on('error', noop) // Do not stop on error
        .pipe($.jscsStylish.combineWithHintResults()) // Combine with JSHint
        .pipe($.jshint.reporter('jshint-stylish'))
        .pipe($.if(!browserSync.active, $.jshint.reporter('fail')));
});

// Compile stylesheets
gulp.task('styles', function () {
    return gulp.src([
            'app/styles/*.scss',
            'app/styles/**/*.css',
            'app/styles/framework/contents.scss'
        ])
        .pipe($.changed('.tmp/styles', {extension: '.scss'}))
        .pipe($.sourcemaps.init())
        .pipe($.sass({
            style: 'expanded',
            precision: 10,
            onError: console.error.bind(console, 'Sass error:')
        }))
        .pipe($.autoprefixer({browsers: AUTOPREFIXER_BROWSERS}))
        .pipe($.sourcemaps.write())
        .pipe(gulp.dest('.tmp/styles'))
        .pipe($.if('*.css', $.csso()))
        .pipe(gulp.dest('dist/styles'))
        .pipe($.size({title: 'styles'}));
});

// Copy root level files
// This catches all the random stuff like favicons or robots.txt
gulp.task('copy', function () {
    return gulp.src([
            'app/*',
            '!app/*.html'
        ], {dot: true})
        .pipe(gulp.dest('dist'))
        .pipe($.size({title: 'copy'}));
});

// Optimize images
gulp.task('images', function () {
    return gulp.src('app/images/**/*')
        .pipe($.cache($.imagemin({
            progressive: true,
            interlaced: true
        })))
        .pipe(gulp.dest('dist/images'))
        .pipe($.size({title: 'images'}));
});

// Minify HTML and optimize referenced resources
gulp.task('html', function () {
    var assets = $.useref.assets({searchPath: '{.tmp,app}'});

    return gulp.src('app/**/*.html')
        // Find all assets
        .pipe(assets)
        // Minifies non-minified Javascript
        .pipe($.if([
            '*.js',
            '!*.min.js'
        ], $.uglify({preserveComments: 'some'})))
        // Remove Unused CSS
        .pipe($.uncss({
            html: ['app/**/*.html']
        }))
        .pipe($.if([
            '*.css',
            '!*.min.css'
        ], $.csso()))
        .pipe(assets.restore())
        .pipe($.useref())
        .pipe($.replace('framework/contents.css', 'framework/main.css'))
        // Minify HTML
        .pipe($.if(/.+\.(php|html)/, $.htmlmin({
            removeComments: true,
            removeCommentsFromCDATA: true,
            removeCDATASectionsFromCDATA: true,
            collapseWhitespace: true,
            // Preserve one whitespace
            conservativeCollapse: true,
            collapseBooleanAttributes: true,
            removeAttributeQuotes: true,
            useShortDoctype: true,
            removeEmptyAttributes: true,
            keepClosingSlash: true,
            caseSensitive: true,
            minifyJS: true,
            minifyCSS: true,
            // Minify Schema.org json
            processScripts: ['application/ld+json']
        })))
        .pipe(gulp.dest('dist'))
        .pipe($.size({title: 'html'}));
});

// Delete the output folders
gulp.task('clean', del.bind(null, ['.tmp', 'dist']));

// Start up BrowserSync
gulp.task('serve', ['styles'], function () {
    browserSync({
        notify: false,
        server: ['.tmp', 'app']
    });

    gulp.watch(['app/**/*.html'], reload);
    gulp.watch(['app/styles/**/*.{scss,css}'], ['styles', reload]);
    gulp.watch(['app/scripts/**/*.js'], ['jshint']);
    gulp.watch(['app/images/**/*'], reload);
});

// Run BrowserSync from the dist directory
gulp.task('serve:dist', ['default'], function () {
    browserSync({
        notify: false,
        server: 'dist'
    });
});

// Build production files (Default)
gulp.task('default', ['clean'], function (cb) {
    runSequence('styles', ['jshint', 'html', 'images', 'copy'], cb);
});
