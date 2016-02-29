var scssInput = './sass/**/*.scss';
var output = './build/css';
var jsInput = './js/**/*.js';
var htmlFiles = './*.html';


var sassOptions = {
  errLogToConsole: true,
  outputStyle: 'expanded'
};

var gulp = require('gulp');
var gp_concat = require('gulp-concat');
var gp_uglify = require('gulp-uglify');
var sass = require('gulp-sass');
var sourcemaps = require('gulp-sourcemaps');
var autoprefixer = require('gulp-autoprefixer');
var autoprefixerOptions = {
  browsers: ['ie >= 8']
};
var sassdoc = require('sassdoc');
var sassdocOptions = {
  dest: './sassdoc'
};
var connect = require('gulp-connect');
var $ = require('gulp-load-plugins')();
var jQuery = require('jquery');
var modernizr = require('gulp-modernizr');
gulp.task('modernizr', function() {
  gulp.src('./js/*.js')
    .pipe(modernizr({
      "options": ["mq"]
    }))
    .pipe(gp_uglify())
    .pipe(gulp.dest("./build/js"))
});

gulp.task('js-fef', function() {
  var scripts = [
    {
      input : ['node_modules/jquery/dist/jquery.min.js',
              'node_modules/bootstrap-sass/assets/javascripts/bootstrap.min.js',
              jsInput],
      output : 'script.js'
    }
  ];
  scripts.forEach(function(script){
    gulp.src(script.input)
    .pipe(gp_concat(script.output))
    .pipe(gp_uglify())
    .pipe(gulp.dest("./build/js"))
    .pipe($.livereload());
  });
});


gulp.task('sass', function () {
  return gulp
    .src(scssInput)
    .pipe(sourcemaps.init())
    .pipe(sass(sassOptions).on('error', sass.logError))

    .pipe(autoprefixer(autoprefixerOptions))
    .pipe(gulp.dest(output))
    .pipe($.livereload());
});

gulp.task('sassdoc', function () {
  // See: http://sassdoc.com/gulp/#drain-event
  return gulp
    .src(scssInput)
    .pipe(sassdoc(sassdocOptions))
    .resume();
});

gulp.task('connect', function() {
        var netPort = 1337;
        $.connect.server({
            port: netPort,
            livereload: true
        });

    });

gulp.task('watch', function() {
  $.livereload.listen();
  return gulp
    // Watch the input folder for change,
    // and run `sass` task when something happens
    .watch([htmlFiles,scssInput,jsInput], ['sass', 'js-fef'])
    // When there is a change,
    // log a message in the console
    .on('change', function(event) {
      console.log('File ' + event.path + ' was ' + event.type + ', running tasks...');
    });
});

gulp.task('build', ['sassdoc', 'modernizr', 'js-fef'], function () {
  return gulp
    .src(scssInput)
    .pipe(sass({ outputStyle: 'compressed' }))
    .pipe(autoprefixer(autoprefixerOptions))
    .pipe(gulp.dest(output));
});

gulp.task('default', ['sass', 'watch', 'modernizr', 'js-fef', 'connect']);