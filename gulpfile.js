import gulp from 'gulp';
import cache from 'gulp-cached';
import changed from 'gulp-changed';
import fs from 'fs/promises';
import pug from 'gulp-pug';
import pugLint from 'gulp-pug-linter';
import eslint from 'gulp-eslint-new';
import gulpSass from 'gulp-sass';
import * as sassPkg from 'sass';
import postcss from 'gulp-postcss';
import postcssReporter from 'postcss-reporter';
import scssSyntax from 'postcss-scss';
import autoprefixer from 'autoprefixer';
import stylelint from 'stylelint';
import prettier from 'gulp-prettier';
import imageMinify, { svgo, optipng, gifsicle } from 'gulp-imagemin';
import mozjpeg from 'imagemin-mozjpeg';
import pngquant from 'imagemin-pngquant';
import { create } from 'browser-sync';

const sass = gulpSass(sassPkg);

const paths = {
  pug: 'src/pug/**/*.pug',
  scss: 'src/scss/**/*.scss',
  js: 'src/js/**/*.js',
  img: 'src/img/**/*.{png,jpg,jpeg,gif,svg,webp}',
  public: 'src/public/**/*',
  dist: 'dist'
};

async function clean () {
  try {
    await fs.rm(paths.dist, { recursive: true, force: true });
  } catch (error) {
    throw new Error(`Error deleting dist: ${error.message}`);
  }
}

function compilePug () {
  return gulp.src([paths.pug].concat(['!src/pug/_*/**'])).pipe(pug({ pretty: true })).pipe(gulp.dest('dist'));
}

function lintPug () {
  return gulp.src(paths.pug).pipe(pugLint({ reporter: 'default' }));
}

const compileSass = () => gulp.src(paths.scss)
  .pipe(sass().on('error', sass.logError))
  .pipe(postcss([autoprefixer()]))
  .pipe(gulp.dest(`${paths.dist}/css`));

const lintSass = () => gulp.src(paths.scss)
  .pipe(cache('sassLinting'))
  .pipe(prettier({
    'printWidth': 160,
    'tabWidth': 2,
    'useTabs': false,
    'semi': true,
    'singleQuote': false,
    'trailingComma': 'none',
    'bracketSpacing': true,
    'jsxBracketSameLine': false,
    'arrowParens': 'always',
    'insertPragma': false,
    'requirePragma': false,
    'proseWrap': 'preserve',
    'endOfLine': 'lf'
  }))
  .pipe(postcss([
    stylelint({
      configFile: '.stylelintrc.json',
      formatter: 'string',
      ignoreDisables: false,
      failOnError: false,
      outputFile: '',
      reportNeedlessDisables: false,
      quietDeprecationWarnings: true,
      fix: true,
      syntax: 'scss'
    }),
    postcssReporter({ clearReportedMessages: true })
  ], { syntax: scssSyntax }))
  .pipe(gulp.dest('src/scss'));

const compileJs = () => gulp.src(paths.js)
  .pipe(gulp.dest(`${paths.dist}/js`));

const lintJs = () => gulp.src(paths.js)
  .pipe(eslint({
    configType: 'flat',
    overrideConfigFile: 'eslint.config.js',
    fix: true
  }))
  .pipe(eslint.fix())
  .pipe(eslint.format())
  .pipe(eslint.failAfterError());

const processImages = () => gulp.src(paths.img, { encoding: false })
  .pipe(changed(`${paths.dist}/img`))
  .pipe(imageMinify([
    pngquant({
      quality: [0.7, 0.8],
      speed: 1
    }),
    mozjpeg({ progressive: true, quality: 70 }),
    svgo({
      name: 'preset-default',
      params: {
        overrides: {
          removeViewBox: false
        }
      }
    }),
    optipng(),
    gifsicle({ optimizationLevel: 3 })
  ]))
  .pipe(gulp.dest(`${paths.dist}/img`));

const copyPublic = () => gulp.src(paths.public, { encoding: false })
  .pipe(gulp.dest(paths.dist));

const watchFiles = () => {
  gulp.watch(paths.pug, gulp.series(lintPug, compilePug));
  gulp.watch(paths.scss, gulp.series(lintSass, compileSass));
  gulp.watch(paths.js, gulp.series(lintJs, compileJs));
  gulp.watch(paths.img, processImages);
};

const webServer = () => {
  create().init({
    server: {
      baseDir: './dist',
      logLevel: 'silent',
      notify: false,
      reloadDelay: 1000,
      reloadDebounce: 1000
    },
    files: './dist',
    ui: false,
    port: 3000,
    open: 'local'
  });
};

const bs = gulp.series(webServer);

const build = gulp.series(
  clean,
  gulp.parallel(lintPug, lintSass, lintJs),
  gulp.parallel(compilePug, compileJs, compileSass, processImages),
  gulp.parallel(bs, watchFiles)
);

const develop = gulp.series(
  gulp.parallel(compilePug, compileJs, compileSass, processImages),
  gulp.parallel(bs, watchFiles)
);

const watch = gulp.series(
  gulp.parallel(bs, watchFiles)
);

const imagemin = gulp.series(
  processImages
);

const copy = gulp.series(
  copyPublic
);

const lint = gulp.series(
  gulp.parallel(lintPug, lintSass, lintJs),
  gulp.parallel(compilePug, compileJs, compileSass)
);

const lintPugAndBuild = gulp.series(
  lintPug,
  compilePug
);

const lintSassAndBuild = gulp.series(
  lintSass,
  compileSass
);

const lintJsAndBuild = gulp.series(
  lintJs,
  compileJs
);

export default build;

export {
  watch,
  develop,
  imagemin,
  copy,
  lint,
  lintPugAndBuild,
  lintSassAndBuild,
  lintJsAndBuild
};
