import gulp from "gulp";
import changed from 'gulp-changed';
import { create } from 'browser-sync';
import fs from "fs/promises";
import pug from "gulp-pug";
import eslint, { fix as _fix, format, failAfterError } from 'gulp-eslint-new';
import prettier from 'gulp-prettier';
import pugLint from "gulp-pug-linter";
import stylelint from 'stylelint';

import gulpSass from 'gulp-sass';
import * as sassPkg from 'sass'
import postcss from 'gulp-postcss';
import scssSyntax from 'postcss-scss';

import autoprefixer from 'autoprefixer';
import postcssReporter from 'postcss-reporter';

import imageMinify, { svgo, optipng, gifsicle } from 'gulp-imagemin';
import mozjpeg from 'imagemin-mozjpeg';
import pngquant from 'imagemin-pngquant';

const sass = gulpSass(sassPkg);

const paths = {
  pug: "src/pug/**/*.pug",
  scss: "src/scss/**/*.scss",
  js: "src/js/**/*.js",
  img: "src/img/**/*.{png,jpg,jpeg,gif,svg,webp}",
  dist: "dist",
};

async function clean () {
  try {
    await fs.rm(paths.dist, { recursive: true, force: true });
  } catch (error) {
    console.error("Error deleting dist:", error);
  }
}

function compilePug () {
  return gulp.src([paths.pug].concat(['!src/pug/_*/**'])).pipe(pug({ pretty: true })).pipe(gulp.dest("dist"));
}

function lintPug () {
  return gulp.src(paths.pug).pipe(pugLint({ reporter: "default" }));
}

function compileSass () {
  return gulp.src(paths.scss)
    .pipe(sass().on('error', sass.logError))
    .pipe(postcss([autoprefixer()]))
    .pipe(gulp.dest(`${paths.dist}/css`));
}

const lintSass = (fix = false) => {
  // const isFix = (typeof fix === 'boolean' && fix === true) ? true : false;
  const filesToCheck = paths.scss;
  return gulp.src(filesToCheck)
    .pipe(postcss([
      stylelint({
        configFile: '.stylelintrc.json',
        formatter: 'string',
        ignoreDisables: false,
        failOnError: false, // Default: true
        outputFile: '',
        reportNeedlessDisables: false,
        quietDeprecationWarnings: true,
        fix: true,
        syntax: 'scss'
      }),
      postcssReporter({
        noIcon: true,
        noPlugin: true,
        throwError: false // Default: true
      })
    ], { syntax: scssSyntax })
    );
};

function compileJS () {
  return gulp.src(paths.js)
    .pipe(gulp.dest(`${paths.dist}/js`));
}

function lintJS () {
  return gulp.src([...paths.js])
    // .pipe(prettier({
    //   singleQuote: true,
    //   proseWrap: 'never',
    //   endOfLine: 'lf',
    //   printWidth: 80,
    //   trailingComma: 'none'
    // }))
    // .pipe(eslint({ fix: true }))
    .pipe(_fix())
    .pipe(format())
    .pipe(gulp.dest(`${paths.dist}/js`));
};

function processImages () {
  return gulp.src(paths.img, { encoding: false })
    .pipe(changed(`${paths.dist}/img`))
    .pipe(imageMinify([
      pngquant({
        quality: [0.7, 0.8],
        speed: 1,
      }),
      mozjpeg({ progressive: true, quality: 70 }),
      svgo({
        name: 'preset-default',
        params: {
          overrides: {
            removeViewBox: false,
          },
        },
      }),
      optipng(),
      gifsicle({ optimizationLevel: 3 }),
    ]))
    .pipe(gulp.dest(`${paths.dist}/img`));
}

function watchFiles () {
  gulp.watch(paths.pug, gulp.series(lintPug, compilePug));
  gulp.watch(paths.scss, gulp.series(lintSass, compileSass));
  gulp.watch(paths.js, gulp.series(lintJS, compileJS));
  gulp.watch(paths.img, processImages);
}




const webServer = () => {
  create().init({
    server: {
      baseDir: './dist',
      logLevel: 'silent',
      notify: false,
      reloadDelay: 1000,
      reloadDebounce: 1000,
    },
    files: './dist',
    ui: false,
    port: 3000,
    open: 'local',
  });
};

const bs = gulp.series(webServer);

const build = gulp.series(
  clean,
  gulp.parallel(lintPug, lintSass, lintJS),
  gulp.parallel(compilePug, compileJS, compileSass, processImages),
  gulp.parallel(bs, watchFiles)
);

const develop = gulp.series(
  gulp.parallel(compilePug, compileJS, compileSass, processImages),
  gulp.parallel(bs, watchFiles)
);

const watch = gulp.series(
  gulp.parallel(bs, watchFiles)
);

export default build;

export {
  develop,
  watch,
  lintPug,
  lintSass,
  lintJS,
};
