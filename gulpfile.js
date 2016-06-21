var gulp = require('gulp');
var less = require('gulp-less');
var rename = require('gulp-rename');
var includer = require('gulp-htmlincluder');
var server = require('gulp-connect');
var livereload = require('gulp-livereload');
var sourcemaps = require('gulp-sourcemaps');
var lessAutoPrefix = require('less-plugin-autoprefix');
var lessCleanCss = require('less-plugin-clean-css');
var autoprefixPlugin = new lessAutoPrefix({browsers: ["last 2 versions"]});
var cleanCssPlugin = new lessCleanCss({sourceMap: true});

gulp.task('connect', function(){
    server.server({
        root: 'build/',
        livereload: true
    });
});

gulp.task('mover', function(){
	gulp.src('dev/fonts/*.*').pipe(gulp.dest('build/fonts/'));
	gulp.src('dev/img/*.*').pipe(gulp.dest('build/img/'));
	gulp.src('dev/js/*.js').pipe(gulp.dest('build/js/'));
});

gulp.task('cssCreator', function(){
	gulp.src('dev/less/general.less')
	.pipe(sourcemaps.init())
	.pipe(less({
		plugins: [autoprefixPlugin]
	}))
	.pipe(sourcemaps.write())
	.pipe(gulp.dest('build/css'))
	.pipe(server.reload());
})
gulp.task('htmlCreator', function(){
	gulp.src('dev/html/**/*.html')
	.pipe(includer())
	.pipe(gulp.dest('build/'))
	.pipe(server.reload());
});

gulp.task('default', function(){
    gulp.start('connect', 'htmlCreator', 'cssCreator', 'mover');

    gulp.watch(['dev/html/**/*.html'], function() {
        gulp.start('htmlCreator');
    });
    gulp.watch(['dev/less/**/**/*.less'], function() {
        gulp.start('cssCreator');
    });
});