var fs = require('fs'),
    gulp = require('gulp'),
    lazypipe = require('lazypipe'),
    sourcemaps = require('gulp-sourcemaps'),
    rev = require('gulp-rev'),
    cssnano = require('gulp-cssnano'),
    uglify = require('gulp-uglify'),
    useref = require("gulp-useref"),
    revReplace = require("gulp-rev-replace")
    gulpIf = require('gulp-if');

var config = {
    dist: 'dist/'
}

var initTask = lazypipe()
    .pipe(sourcemaps.init);
var jsTask = lazypipe()
    .pipe(uglify);
var cssTask = lazypipe()
    .pipe(cssnano);

module.exports = function() {
    var manifest = gulp.src('.tmp/rev-manifest.json');

    return gulp.src('index.html')
        //init sourcemaps
        .pipe(useref({}, initTask))
        .pipe(gulpIf('*.js', jsTask()))
        .pipe(gulpIf('*.css', cssTask()))
        .pipe(gulpIf('**/*.[css,js]', rev()))
        .pipe(revReplace({manifest: manifest}))
        .pipe(sourcemaps.write('.'))
        .pipe(gulp.dest(config.dist));
}
