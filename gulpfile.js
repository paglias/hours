var gulp = require('gulp');
var browserify = require('browserify');
var babelify = require('babelify');
var watchify = require('watchify');
var source = require('vinyl-source-stream');
var buffer = require('vinyl-buffer');
var uglify = require('gulp-uglify');
var sourcemaps = require('gulp-sourcemaps');
var browserSync = require('browser-sync');
var minifyCss = require('gulp-minify-css');

// TODO clean

var bundler = watchify(browserify('./src/js/index.js', {
  debug: true,
  cache: {}, // required for watchify
  packageCache: {}, // required for watchify
  fullPaths: true // required to be true only for watchify
}));

bundler.transform(babelify);
bundler.on('log', console.log);

function js(){
  return bundler
    .bundle()
    .on('error', function(err){
      console.log('Browserify error: ' + err.message); 
    })
    // TODO sourcemaps https://github.com/gulpjs/gulp/blob/master/docs/recipes/fast-browserify-builds-with-watchify.md
    .pipe(source('index.js'))
    .pipe(gulp.dest('./dist/js'))
    .pipe(browserSync.stream());
};

gulp.task('js', js);

// TODO lots of repetitions here, refactor
gulp.task('build:js', function(){
  return browserify('./src/js/index.js', {
    debug: true
  })
    .transform(babelify)
    .bundle()
    .pipe(source('index.js'))
    .pipe(buffer())
    //.pipe(sourcemaps.init({loadMaps: true}))
    //.pipe(uglify())
    .on('error', function(err){
      console.log('Browserify error: ' + err.message); 
    })
    //.pipe(sourcemaps.write('./'))
    .pipe(gulp.dest('./build/js/'));
});

gulp.task('build:css', function(){
  return gulp.src('./src/css/index.css')
    .pipe(sourcemaps.init({loadMaps: true}))
    .pipe(minifyCss({
      keepSpecialComments: 0,
      rebase: false
    }))
    .pipe(sourcemaps.write('./'))
    .pipe(gulp.dest('./build/css'));
});

gulp.task('build:copy', function(){
  gulp.src('./node_modules/materialize-css/font/**/*', {base: './node_modules/materialize-css'})
    .pipe(gulp.dest('./build/'));

  gulp.src('./src/index.html')
    .pipe(gulp.dest('./build/'));

  gulp.src('./src/chrome/manifest.json')
    .pipe(gulp.dest('./build/'));

  gulp.src('./src/chrome/js/background.js')
    .pipe(gulp.dest('./build/js'));

  gulp.src('./src/chrome/icons/**/*')
    .pipe(gulp.dest('./build/icons'));
});

gulp.task('build', ['build:copy', 'build:css', 'build:js']);

gulp.task('serve', ['js'], function(){
  browserSync({
    server: {
      baseDir: ['dist', 'src'],
      routes: {
        '/node_modules': 'node_modules'
      }
    }
  });

  // Starts watching for file changes
  bundler.on('update', js);
  gulp.watch(['./src/css/**/*.css']).on('change', browserSync.reload);
  gulp.watch(['./src/index.html']).on('change', browserSync.reload);
});