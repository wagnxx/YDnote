const gulp = require('gulp');
const babel = require('gulp-babel');
const watch = require('gulp-watch');
// const rollup = require('gulp-rollup');
// const replace = require('rollup-plugin-replace');
// const eslint = require('gulp-eslint');
// const gulpSequence = require('gulp-sequence');

 
gulp.task('buliddev', () => {
  return watch(
    './src/server/**/*.js',
    {
      ignoreInitial: false,
    },
    () => {
      gulp
        .src('./src/server/**/*.js')
        .pipe(
          babel({
            babelrc: false,
            plugins: [
              ['@babel/plugin-proposal-decorators', { legacy: true }],
              'transform-es2015-modules-commonjs',
            ],
          })
        )
        .pipe(gulp.dest('dist'));
    }
  );
});

// gulp.task('buildprod') // 3.01

gulp.task('default', gulp.series('buliddev'))
