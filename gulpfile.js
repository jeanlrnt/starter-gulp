// plugins
const gulp = require('gulp');
const del = require('del');
const htmlmin = require('gulp-htmlmin');
const minifyCss = require('gulp-clean-css');
const sass = require('gulp-dart-sass');
const plumber = require('gulp-plumber');
const imagemin = require('gulp-imagemin');
const autoprefixer = require('gulp-autoprefixer');
const sourcemaps = require('gulp-sourcemaps');
const babel = require('gulp-babel');
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
    src: [`${assetsFolder}css/sass.css`, `${assetsFolder}css/*.css`],
    dest: './dist/assets/css/',
  },
  scss: {
    src: './src/assets/scss/styles.scss',
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
  return del([distFolder, `${assetsFolder}css/sass.css`]);
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
      .src(paths.css.src)
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
      .pipe(concat('sass.css'))
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

// Tâche permettant de minimifier les polices et de les copier vers dist/assets/fonts/
function font() {
  return (
    gulp
      .src(paths.font.src)
      .pipe(plumber())
      .pipe(gulp.dest(paths.font.dest))
      .pipe(browsersync.stream())
  );
}

// Tâche permettant de minimifier les fichiers js et de les copier vers dist/assets/js/
function js() {
  return (
    gulp
      .src(paths.js.src)
      .pipe(sourcemaps.init())
      .pipe(babel({
        presets: ['@babel/preset-env'],
      }))
      .pipe(concat('all.js'))
      .pipe(sourcemaps.write('.'))
      .pipe(gulp.dest(paths.js.dest))
      .pipe(browsersync.stream())
  );
}

// Idem watch() avec les images en plus pour le build
function watchFiles() {
  gulp.watch(paths.html.src, html);
  gulp.watch(paths.scss.src, scss);
  gulp.watch(paths.js.src, js);
  gulp.watch(paths.css.src, css);
  gulp.watch(paths.font.src, font);
  gulp.watch(paths.images.src, images);
}

const serie = gulp.series(clear, scss, html, css, js, images, font);
const build = gulp.series(serie, gulp.parallel(watchFiles, browserSync));

// exports
exports.clear = clear;
exports.build = build;
exports.default = build;
