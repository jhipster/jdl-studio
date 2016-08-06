var gulp = require("gulp"),
    inject = require('gulp-inject'),
    browserSync = require('browser-sync').create(),
    reload      = browserSync.reload;

var bowerLibFiles = require('main-bower-files');

var depCssFiles = [
    'codemirror/codemirror.css',
    'codemirror/show-hint.css',
    'codemirror/solarized.jdl.css',
    'css/app.css'
];
var depJsFiles = [
    'lib/dagre.min.js',
    'codemirror/codemirror-compressed.js',
    'codemirror/closebrackets.js',
    'codemirror/dialog.js',
    'codemirror/jdl-hint.js',
    'codemirror/searchcursor.js',
    'codemirror/show-hint.js',
    'codemirror/codemirror.jdl-mode.js',
    'nomnoml/skanaar.canvas.js',
    'nomnoml/skanaar.util.js',
    'nomnoml/skanaar.vector.js',
    'nomnoml/nomnoml.parser.custom.js',
    'nomnoml/nomnoml.layouter.custom.js',
    'nomnoml/nomnoml.renderer.custom.js',
    'nomnoml/nomnoml.custom.js',
    'js/app.js'
];

var config = {
    lib: 'lib/'
}

gulp.task('copy:lib', function () {

});

gulp.task('build', ['inject'], function () {

});

gulp.task('inject', function () {
    return gulp.src('index.html')
        .pipe(inject(gulp.src(bowerLibFiles(), {read: false}), {
            name: 'bower',
            relative: true
        }))
        .pipe(inject(gulp.src(depJsFiles), {relative: true}))
        .pipe(inject(gulp.src(depCssFiles), {relative: true}))
        .pipe(gulp.dest(''));
});

gulp.task('serve', ['inject'], function () {

    // Serve files from the root of this project
    browserSync.init({
        server: {
            baseDir: "./"
        }
    });

    gulp.watch("index.html").on("change", reload);
    gulp.watch("js/*.js").on("change", reload);
    gulp.watch("codemirror/*").on("change", reload);
    gulp.watch("nomnoml/*").on("change", reload);
    gulp.watch("css/*.css").on("change", reload);
});

gulp.task('default', function() {
    gulp.start('serve');
});
