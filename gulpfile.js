//use of JS
var gulp = require('gulp');
var browserify = require('browserify');
var babelify = require('babelify');
var jadeify = require('jadeify');
var buffer = require('vinyl-buffer');
var source = require('vinyl-source-stream');
var uglify = require('gulp-uglify');

//use of CSS
var stylus = require('gulp-stylus');
var concat = require('gulp-concat-css');
var nib = require('nib');
var minify = require('gulp-minify-css');

//livereload stuff

var watchify = require('watchify');
var assign = require('lodash.assign');
var livereload = require('gulp-livereload');

var opts = {
    entries: './lib/babel/app.js', //main file
    transform: [babelify, jadeify]
};

opts = assign({}, watchify.args, opts);

//task builders

gulp.task('build:js', ['js', 'js:watch']);
gulp.task('build:css', ['styl', 'styles:watch']);
gulp.task('build:all', ['js', 'styl', 'js:watch', 'styles:watch']);

//gulp tasks

gulp.task('js', function() {
    return generateBundle(browserify(opts));
});

gulp.task('styl', function() {
    return styl();
});

gulp.task('styles:livereload', function() {
    return styl().pipe(livereload());
});

gulp.task('styles:watch', function() {
    return gulp.watch(['./lib/stylus/styles.styl','./lib/stylus/**/*.styl', './lib/babel/**/*.styl'], ['styles:livereload']);
});

gulp.task('js:watch', function() {
    var w = watchify(browserify(opts));
    w.on('update', function(file) {
        //logica de rebuild
        console.log('file modifed, rebuilding: ', file);
        var bdle = generateBundle(w).pipe(livereload());
        console.log('rebuild finished');
        return bdle;
    });
    //livereload es un Singleton
    return generateBundle(w).pipe(livereload({ start: true }));
});

function generateBundle(b) {
    return b
     .bundle()
     .pipe(source('app.js')) // archivo destino
     .pipe(buffer())
     //.pipe(uglify())
     .pipe(gulp.dest('./tifis_platform/general/front/js/')); //donde se va a guardar
}

function styl() {
    return gulp.src('./lib/stylus/styles.styl') // entry point styl
    .pipe(stylus({ use: nib() })) //inicializando nib como plugging
    .pipe(concat('styles.css'))
    //.pipe(minify())
    .pipe(gulp.dest('./tifis_platform/general/front/css'));
}
