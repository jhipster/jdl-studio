const gulp = require("gulp"),
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
    babel = require('gulp-babel'),
    del = require('del'),
    browserSync = require('browser-sync').create(),
    reload      = browserSync.reload;

const bowerLibFiles = require('main-bower-files');

const lib = require('./lib');

const config = {
    dist: 'dist/'
};

const babelTask = lazypipe()
    .pipe(babel, {presets: ['es2015']});
const initTask = lazypipe()
    .pipe(sourcemaps.init);
const jsTask = lazypipe()
    .pipe(uglify);
const cssTask = lazypipe()
    .pipe(cssnano);

gulp.task('clean', () => del([config.dist], { dot: true }));

gulp.task('build', ['clean', 'inject'], () => {
    const manifest = gulp.src('.tmp/rev-manifest.json');

    return gulp.src('index-dev.html')
        .pipe(rename("index.html"))
        //init sourcemaps
        .pipe(useref(
            {},
            lazypipe().pipe(() => gulpIf('bower_components/jdl-core/index.js', babelTask())),
            initTask
        ))
        .pipe(gulpIf('*.js', jsTask())).on('error', createErrorHandler('jsTask'))
        .pipe(gulpIf('*.css', cssTask())).on('error', createErrorHandler('cssTask'))
        .pipe(gulpIf('**/*.!(html)', rev())).on('error', createErrorHandler('rev'))
        .pipe(revReplace({manifest: manifest})).on('error', createErrorHandler('manifest'))
        .pipe(sourcemaps.write('.')).on('error', createErrorHandler('sourcemaps'))
        .pipe(gulp.dest(''));
});

function createErrorHandler(name) {
  return function (err) {
    console.error('Error from ' + name + ' in compress task', err.toString());
  };
}

gulp.task('inject', () => {
    return gulp.src('index-dev.html')
        .pipe(inject(gulp.src(bowerLibFiles(), {read: false}), {
            name: 'bower',
            relative: true
        }))
        .pipe(inject(gulp.src(lib.JS), {relative: true}))
        .pipe(inject(gulp.src(lib.CSS), {relative: true}))
        .pipe(gulp.dest(''));
});

function serve(path) {
    // Serve files from the root of this project
    browserSync.init({
        server: {
            baseDir: path,
            index: "index-dev.html"
        }
    });

    gulp.watch("index-dev.html").on("change", reload);
    gulp.watch("partials/*.html").on("change", reload);
    gulp.watch("js/*.js").on("change", reload);
    gulp.watch("codemirror/*").on("change", reload);
    gulp.watch("nomnoml/*").on("change", reload);
    gulp.watch("css/*.css").on("change", reload);
}

gulp.task('serve', ['inject'], () => {
  serve('./')
});

gulp.task('serveOnline', ['inject'], () => {
  serve('../')
});

gulp.task('default', () => {
    gulp.start('serve');
});
