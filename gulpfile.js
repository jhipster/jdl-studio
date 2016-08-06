var gulp = require("gulp"),
    inject = require('gulp-inject'),
    del = require('del'),
    browserSync = require('browser-sync').create(),
    reload      = browserSync.reload;

var build = require('./build');

var bowerLibFiles = require('main-bower-files');

const lib = require('./lib');

var config = {
    dist: 'dist/'
}

gulp.task('clean', function () {
    return del([config.dist], { dot: true });
});


gulp.task('build', ['clean', 'inject'], build);

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
    gulp.watch("js/*.js").on("change", reload);
    gulp.watch("codemirror/*").on("change", reload);
    gulp.watch("nomnoml/*").on("change", reload);
    gulp.watch("css/*.css").on("change", reload);
});

gulp.task('default', function() {
    gulp.start('serve');
});
