var batch = require('gulp-batch');
var gulp = require('gulp');
var mocha = require('gulp-mocha');

gulp.task('default', function() {
    return gulp.watch(['**/**'], batch(function (events, cb) {
        return gulp.src(['test/*.js'])
        .pipe(mocha({ reporter: 'list' }))
        .on('error', function (err) {
            //console.log(err.stack);
        });
    }));
});
