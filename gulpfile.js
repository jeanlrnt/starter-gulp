// plugins
const gulp = require('gulp');
const del = require('del');
const htmlmin = require('gulp-htmlmin');
const minifyCss = require('gulp-clean-css');
const sass = require('gulp-dart-sass');
const plumber = require('gulp-plumber');
const imagemin = require('gulp-imagemin');
const autoprefixer = require('gulp-autoprefixer');
const minifyJS = require('gulp-minify');
const concat = require('gulp-concat');
const browsersync = require('browser-sync').create();

const distFolder = './dist/';

// variables
const assetsFolder = './src/assets/';
const paths = {
  html: {
    src: './src/**/*.html',
    dest: './dist/',
  },
  css: {
    src: [`${assetsFolder}css/reset.css`, `${assetsFolder}css/*.css`],
    dest: './dist/assets/css/',
  },
  scss: {
    src: './src/assets/scss/**/*',
    dest: './src/assets/css/',
  },
  images: {
    src: './src/assets/img/**/*.*',
    dest: './dist/assets/img/',
  },
  font: {
    src: './src/assets/fonts/**/*',
    dest: './dist/assets/fonts/',
  },
  js: {
    src: './src/assets/js/**/*.js',
    dest: './dist/assets/js/',
  },
};

function browserSync() {
  browsersync.init({
    // BrowserSync
    server: {
      baseDir: distFolder,
    },
    port: 3000,
  });
}

// Permet de supprimer le répertoire distFolder
function clear() {
  return del([distFolder]);
}

// Tâche permettant de minimifier les fichiers html et de les copier vers dist/
function html() {
  return (
    gulp
      .src(paths.html.src, { since: gulp.lastRun(html) })
      .pipe(plumber())
      .pipe(htmlmin({ collapseWhitespace: true }))
      .pipe(gulp.dest(paths.html.dest))
      .pipe(browsersync.stream())
  );
}

// Tâche permettant de minimifier les css et de les copier vers dist/assets/css/

function css() {
  return (
    gulp
      .src(paths.css.src, { since: gulp.lastRun(css) })
      .pipe(plumber())
      .pipe(autoprefixer())
      .pipe(minifyCss())
      .pipe(concat('style.min.css'))
      .pipe(gulp.dest(paths.css.dest))
      .pipe(browsersync.stream())
  );
}

// Tâche permettant de transpiler et de minimifier les scss et de les copier vers dist/assets/css/
function scss() {
  return (
    gulp
      .src(paths.scss.src)
      .pipe(plumber())
      .pipe(sass())
      .pipe(gulp.dest(paths.scss.dest))
      .pipe(browsersync.stream())
  );
}

// Tâche permettant de minimifier les images et de les copier vers dist/assets/img/

function images() {
  return (
    gulp
      .src(paths.images.src)
      .pipe(plumber())
      .pipe(imagemin())
      .pipe(gulp.dest(paths.images.dest))
      .pipe(browsersync.stream())
  );
}

// Tâche permettant de minimifier les images et de les copier vers dist/assets/img/
function font() {
  return (
    gulp
      .src(paths.font.src, { since: gulp.lastRun(font) })
      .pipe(plumber())
      .pipe(gulp.dest(paths.font.dest))
      .pipe(browsersync.stream())
  );
}

// Tâche permettant de minimifier les fichiers js et de les copier vers dist/assets/js/
function js() {
  return (
    gulp
      .src(paths.js.src, { since: gulp.lastRun(js) })
      .pipe(minifyJS())
      .pipe(gulp.dest(paths.js.dest))
      .pipe(browsersync.stream())
  );
}

function watchAll() {
  gulp.watch(paths.scss.src, scss);
  gulp.watch(paths.css.src, css);
  gulp.watch(paths.js.src, js);
  gulp.watch(paths.font.src, font);
  gulp.watch(paths.images.src, images);
}

// Idem watch() avec les images en plus pour le build
function watchFiles() {
  gulp.watch(paths.html.src, html);
  watchAll();
}

const serie = gulp.series(clear, scss, html, css, js, images, font);
const build = gulp.series(serie, gulp.parallel(watchFiles, browserSync));

// exports
exports.clear = clear;
exports.build = build;
exports.default = build;
