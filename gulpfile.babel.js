import gulp from "gulp";
import {
  spawn
} from "child_process";
import hugoBin from "hugo-bin";
import gutil from "gulp-util";
import flatten from "gulp-flatten";
import postcss from "gulp-postcss";
import sourceMaps from "gulp-sourcemaps";
import cssImport from "postcss-import";
import lost from "lost";
import cssnext from "postcss-cssnext";
import BrowserSync from "browser-sync";
import webpack from "webpack";
import webpackConfig from "./webpack.conf";

const browserSync = BrowserSync.create();

// Hugo arguments
const hugoArgsDefault = ["-d", "../dist", "-s", "site", "-v"];
const hugoArgsPreview = ["--buildDrafts", "--buildFuture"];

// Development tasks
function hugo(cb) {
  buildSite(cb);
}

// Build/production tasks
gulp.task('build', gulp.parallel(css, js, fonts, (cb) => buildSite(cb, [], 'production')));
gulp.task('build-preview', gulp.parallel(css, js, fonts, (cb) => buildSite(cb, hugoArgsPreview, 'production')));

// Compile CSS with PostCSS
function css() {
  return gulp.src("./src/css/*.css")
    .pipe(sourceMaps.init())
    .pipe(postcss([
      cssImport({
        from: "./src/css/main.css"
      }),
      lost(),
      cssnext()
    ]))
    .pipe(sourceMaps.write('.'))
    .pipe(gulp.dest('./dist/css'))
    .pipe(browserSync.stream())
}

// Compile Javascript
function js(cb) {
  const myConfig = Object.assign({}, webpackConfig);

  webpack(myConfig, (err, stats) => {
    if (err) throw new gutil.PluginError("webpack", err);
    gutil.log("[webpack]", stats.toString({
      colors: true,
      progress: true
    }));
    browserSync.reload();
    cb();
  });
}

// Move all fonts in a flattened directory
function fonts() {
  return gulp.src("./src/fonts/**/*")
    .pipe(flatten())
    .pipe(gulp.dest("./dist/fonts"))
    .pipe(browserSync.stream())
}

function watch() {
  browserSync.init({
    server: {
      baseDir: "./dist"
    }
  });
  gulp.watch("./src/js/**/*.js", js);
  gulp.watch("./src/css/**/*.css", css);
  gulp.watch("./src/fonts/**/*", fonts);
  gulp.watch("./site/**/*", hugo);
}

// Development server with browsersync
gulp.task('server', gulp.series(gulp.parallel(hugo, css, js, fonts), watch));

/**
 * Run hugo and build the site
 */
function buildSite(cb, options, environment = "development") {
  const args = options ? hugoArgsDefault.concat(options) : hugoArgsDefault;

  process.env.NODE_ENV = environment;

  return spawn(hugoBin, args, {
    stdio: "inherit"
  }).on("close", (code) => {
    if (code === 0) {
      browserSync.reload();
      cb();
    } else {
      browserSync.notify("Hugo build failed :(");
      cb("Hugo build failed");
    }
  });
}
