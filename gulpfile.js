var gulp = require("gulp"),
    lazypipe = require('lazypipe'),
    sourcemaps = require('gulp-sourcemaps'),
    rev = require('gulp-rev'),
    cssnano = require('gulp-cssnano'),
    uglify = require('gulp-uglify'),
    useref = require("gulp-useref"),
    revReplace = require("gulp-rev-replace")
    rename = require("gulp-rename"),
    gulpIf = require('gulp-if'),
    inject = require('gulp-inject'),
    del = require('del'),
    browserSync = require('browser-sync').create(),
    reload      = browserSync.reload;

var bowerLibFiles = require('main-bower-files');

const lib = require('./lib');

var config = {
    dist: 'dist/'
}

var initTask = lazypipe()
    .pipe(sourcemaps.init);
var jsTask = lazypipe()
    .pipe(uglify);
var cssTask = lazypipe()
    .pipe(cssnano);

gulp.task('clean', function () {
    return del([config.dist], { dot: true });
});


gulp.task('build', ['clean', 'inject'], function() {
    var manifest = gulp.src('.tmp/rev-manifest.json');

    return gulp.src('index-dev.html')
        .pipe(rename("index.html"))
        //init sourcemaps
        .pipe(useref({}, initTask))
        .pipe(gulpIf('*.js', jsTask()))
        .pipe(gulpIf('*.css', cssTask()))
        .pipe(gulpIf('**/*.!(html)', rev()))
        .pipe(revReplace({manifest: manifest}))
        .pipe(sourcemaps.write('.'))
        .pipe(gulp.dest(''));
});

gulp.task('inject', function () {
    return gulp.src('index-dev.html')
        .pipe(inject(gulp.src(bowerLibFiles(), {read: false}), {
            name: 'bower',
            relative: true
        }))
        .pipe(inject(gulp.src(lib.JS), {relative: true}))
        .pipe(inject(gulp.src(lib.CSS), {relative: true}))
        .pipe(gulp.dest(''));
});

gulp.task('serve', ['inject'], function () {

    // Serve files from the root of this project
    browserSync.init({
        server: {
            baseDir: "./",
            index: "index-dev.html"
        }
    });

    gulp.watch("index-dev.html").on("change", reload);
    gulp.watch("partials/*.html").on("change", reload);
    gulp.watch("js/*.js").on("change", reload);
    gulp.watch("codemirror/*").on("change", reload);
    gulp.watch("nomnoml/*").on("change", reload);
    gulp.watch("css/*.css").on("change", reload);
});

gulp.task('default', function() {
    gulp.start('serve');
});
