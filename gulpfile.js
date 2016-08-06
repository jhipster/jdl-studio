var gulp = require("gulp"),
    browserSync = require('browser-sync').create(),
    reload      = browserSync.reload;

var bowerLibFiles = require('main-bower-files');

var CodeMirrorFiles = [
    'closebrackets.js',
    'codemirror-compressed.js',
    'codemirror.css',
    'codemirror.jdl-mode.js',
    'dialog.js',
    'jdl-hint.js',
    'searchcursor.js',
    'show-hint.css',
    'show-hint.js',
    'solarized.jdl.css'
];
var nomnomlFiles = [
    'skanaar.canvas.js',
    'skanaar.util.js',
    'skanaar.vector.js',
    'nomnoml.parser.custom.js',
    'nomnoml.layouter.custom.js',
    'nomnoml.renderer.custom.js',
    'nomnoml.custom.js'
];

var appFiles = [
    'css/app.css',
    'js/app.js'
];

var config = {
    lib: 'lib'
}

gulp.task('copy:lib', function () {
    gulp.src(bowerFiles(), {read: false})
    .pipe(gulp.dest(config.lib))
});

gulp.task('build', function () {

});

gulp.task('inject', ['inject:dep', 'inject:app']);

gulp.task('inject:app', function () {

});


gulp.task('inject:dep', function () {
    /*var stream = gulp.src('index.html')
        .pipe(inject(gulp.src(bowerFiles(), {read: false}), {
            name: 'bower',
            relative: true
        }))
        .pipe(gulp.dest(''));*/

    //return stream;
});

gulp.task('serve', function () {

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
