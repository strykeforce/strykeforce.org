import gulp from 'gulp';
import {
  spawn
} from 'child_process';
import hugoBin from 'hugo-bin';
import gutil from 'gulp-util';
import flatten from 'gulp-flatten';
import postcss from 'gulp-postcss';
import rename from 'gulp-rename';
import BrowserSync from 'browser-sync';
import webpack from 'webpack';
import webpackConfig from './webpack.conf';
import csso from 'gulp-csso';
import log from 'fancy-log';

const browserSync = BrowserSync.create();

// Hugo arguments
const hugoArgsDefault = ['-d', '../dist', '-s', 'site', '-v'];
const hugoArgsPreview = ['--buildDrafts', '--buildFuture'];

// Development tasks
function hugo(cb) {
  buildSite(cb);
}

// Build/production tasks
gulp.task('build', gulp.parallel(css, js, fonts, (cb) => buildSite(cb, [], 'production')));
gulp.task('build-preview', gulp.parallel(css, js, fonts, (cb) => buildSite(cb, hugoArgsPreview, 'production')));
gulp.task('style', css);

const postcssPlugins = [
  require('postcss-easy-import')({
    from: './src/css/main.sss',
    extensions: '.sss',
    prefix: 'imports/_'
  }),
  require('postcss-normalize')({
    forceImport: true
  }),
  require('postcss-nested-props'),
  require('precss'),
  require('autoprefixer')
];

if (process.env.NODE_ENV === 'production') {
  postcssPlugins.push(require('cssnano')({
    preset: 'default'
  }))
}

// Compile CSS with PostCSS
function css() {
  return gulp.src('./src/css/*.sss')
    .pipe(postcss(postcssPlugins, {
      parser: require('sugarss'),
      map: process.env.NODE_ENV !== 'production'
    }))
    .pipe(rename({
      extname: '.css'
    }))
    .pipe(gulp.dest('./dist/css'))
    .pipe(browserSync.stream())
    .on('end', function() {
      log('hi ' + process.env.NODE_ENV)
    })

}

// Compile Javascript
function js(cb) {
  const myConfig = Object.assign({}, webpackConfig);

  webpack(myConfig, (err, stats) => {
    if (err) throw new gutil.PluginError('webpack', err);
    gutil.log('[webpack]', stats.toString({
      colors: true,
      progress: true
    }));
    browserSync.reload();
    cb();
  });
}

// Move all fonts in a flattened directory
function fonts() {
  return gulp.src('./src/fonts/**/*')
    .pipe(flatten())
    .pipe(gulp.dest('./dist/fonts'))
    .pipe(browserSync.stream())
}

function watch() {
  browserSync.init({
    server: {
      baseDir: './dist'
    }
  });
  gulp.watch('./src/js/**/*.js', js);
  gulp.watch('./src/css/**/*.sss', css);
  gulp.watch('./src/fonts/**/*', fonts);
  gulp.watch('./site/**/*', hugo);
}

// Development server with browsersync
gulp.task('server', gulp.series(gulp.parallel(hugo, css, js, fonts), watch));

/**
 * Run hugo and build the site
 */
function buildSite(cb, options, environment = 'development') {
  const args = options ? hugoArgsDefault.concat(options) : hugoArgsDefault;

  process.env.NODE_ENV = environment;

  return spawn(hugoBin, args, {
    stdio: 'inherit'
  }).on('close', (code) => {
    if (code === 0) {
      browserSync.reload();
      cb();
    } else {
      browserSync.notify('Hugo build failed :(');
      cb('Hugo build failed');
    }
  });
}

gulp.task('lint-css', function lintCssTask() {
  const gulpStylelint = require('gulp-stylelint');

  return gulp
    .src('src/**/*.css')
    .pipe(gulpStylelint({
      reporters: [{
        formatter: 'string',
        console: true
      }]
    }));
});
