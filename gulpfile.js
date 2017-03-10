/// <binding />
// The above line of code enables Visual Studio to automatically start Gulp tasks at certain key moments. The 'clean'
// task is run on solution clean, the 'build' task is run on solution build and the 'watch' task is run on opening the
// solution. You can also edit the above using the Task Runner Explorer window in Visual Studio
// (See http://docs.asp.net/en/latest/client-side/using-gulp.html)
'use strict'; // Enable strict mode for JavaScript (See https://developer.mozilla.org/en/docs/Web/JavaScript/Reference/Strict_mode).

// Set up imported packages.
var gulp = require('gulp'),
  fs = require('fs'), // NPM file system API (https://nodejs.org/api/fs.html)
  path = require('path'),
  autoprefixer = require('gulp-autoprefixer'), // Auto-prefix CSS (https://www.npmjs.com/package/gulp-autoprefixer)
  concat = require('gulp-concat'), // Concatenate files (https://www.npmjs.com/package/gulp-concat/)
  csslint = require('gulp-csslint'), // CSS linter (https://www.npmjs.com/package/gulp-csslint/)
  cssnano = require('gulp-cssnano'), // Minifies CSS (https://www.npmjs.com/package/gulp-cssnano/)
  gulpif = require('gulp-if'), // If statement (https://www.npmjs.com/package/gulp-if/)
  imagemin = require('gulp-imagemin'), // Optimizes images (https://www.npmjs.com/package/gulp-imagemin/)
  jscs = require('gulp-jscs'), // JavaScript style linter (https://www.npmjs.com/package/gulp-jscs)
  eslint = require('eslint'), // JavaScript linter (https://www.npmjs.com/package/gulp-jshint/)
//mocha = require('gulp-mocha-phantomjs'),    // JavaScript test runner (https://www.npmjs.com/package/gulp-mocha-phantomjs/).
  plumber = require('gulp-plumber'), // Handles Gulp errors (https://www.npmjs.com/package/gulp-plumber)
  rename = require('gulp-rename'), // Renames file paths (https://www.npmjs.com/package/gulp-rename/)
  replace = require('gulp-replace'), // String replace (https://www.npmjs.com/package/gulp-replace/)
  size = require('gulp-size'), // Prints size of files to console (https://www.npmjs.com/package/gulp-size/)
  sourcemaps = require('gulp-sourcemaps'), // Creates source map files (https://www.npmjs.com/package/gulp-sourcemaps/)
  uglify = require('gulp-uglify'), // Minifies JavaScript (https://www.npmjs.com/package/gulp-uglify/)
  gutil = require('gulp-util'), // Gulp utilities (https://www.npmjs.com/package/gulp-util/)
  merge = require('merge-stream'), // Merges one or more gulp streams into one (https://www.npmjs.com/package/merge-stream/)
  rimraf = require('rimraf'), // Deletes files and folders (https://www.npmjs.com/package/rimraf/)
  sass = require('gulp-sass'), // Compile SCSS to CSS (https://www.npmjs.com/package/gulp-sass/)
  sasslint = require('gulp-sass-lint'), // SASS linter (https://www.npmjs.com/package/gulp-sass-lint/)
  tslint = require('gulp-tslint'), // TypeScript linter (https://www.npmjs.com/package/gulp-tslint/)
  typescript = require('gulp-typescript'), // TypeScript compiler (https://www.npmjs.com/package/gulp-typescript/)
  umd = require('gulp-umd'), // JavaScript files as Universal Module Definition, aka UMD.(https://www.npmjs.com/package/gulp-umd)
  inject = require('gulp-inject'),
  cache = require('gulp-cache'),
  connect = require('gulp-connect'),
  _ = require('autostrip-json-comments'), // Strips JSON comments so the next two lines work (https://www.npmjs.com/package/autostrip-json-comments)
  hosting = require('./build/appsettings.json'), // Read the appsettings.json file into the appsettings variable.
  launch = require('./build/launchSettings.json'); // Read the launchSettings.json file into the launch variable.

// Holds information about the hosting environment.
var environment = {
  // The names of the different environments.
  development: 'Development',
  staging: 'Staging',
  production: 'Production',
  // Gets the current hosting environment the app is running under. Looks for the ASPNETCORE_ENVIRONMENT environment
  // variable, if not found looks at the launchSettings.json file which if not found defaults to Development.
  current: function () {
    var environ = process.env.ASPNETCORE_ENVIRONMENT ||
      launch && launch.profiles['IIS Express'].environmentVariables.ASPNETCORE_ENVIRONMENT ||
      this.development;
    gutil.log('Current Environment: ' + environ);
    return environ;
  },
  // Are we running under the development environment.
  isDevelopment: function () {
    return this.current() === this.development;
  },
  // Are we running under the staging environment.
  isStaging: function () {
    return this.current() === this.staging;
  },
  // Are we running under the production environment.
  isProduction: function () {
    return this.current() === this.production;
  }
};

// Initialize directory paths.
var paths = {
  // Source Directory Paths
  npm: './node_modules/',
  scripts: 'Scripts/',
  scriptsVendor: 'Scripts/vendor/',
  scss: 'src/scss/',
  images: 'src/icons/',
  assets: 'src/',
  examples: 'examples/',
  tests: 'Tests/',

  // Destination Directory Paths
  wwwroot: './' + hosting.webroot + '/',
  css: './' + hosting.webroot + '/css/',
  fonts: './' + hosting.webroot + '/fonts/',
  img: './' + hosting.webroot + '/icons/',
  js: './' + hosting.webroot + '/js/',
  vendor: './' + hosting.webroot + '/js/vendor/',
  umdUtils: './' + hosting.webroot + '/js/utils/'
};

// Initialize the mappings between the source and output files.
var sources = {
  // An array containing objects required to build a single CSS file.
  css: [{
    name: 'font-awesome.css',
    copy: true,
    paths: paths.npm + 'font-awesome/css/font-awesome.min.css'
  }, {
    name: 'bootstrap.select2.css',
    copy: true,
    paths: paths.npm + 'select2/dist/css/select2.css'
  }, {
    name: 'bootstrap.fileupload.css',
    copy: true,
    paths: paths.scriptsVendor + 'fileLoad@9.12.5/css/jquery.fileupload.css'
  }, {
    name: 'nprogress.css',
    copy: true,
    paths: paths.npm + 'nprogress/nprogress.css'
  }],
  // An array containing objects required to copy font files.
  fonts: [{
    // The name of the folder the fonts will be output to.
    name: 'bootstrap',
    // The source directory to get the font files from. Note that we support all font file types.
    path: paths.npm + 'bootstrap-sass/**/*.{ttf,svg,woff,woff2,otf,eot}'
  }, {
    name: 'font-awesome',
    path: paths.npm + 'font-awesome/**/*.{ttf,svg,woff,woff2,otf,eot}'
  }, {
    name: 'iconfont',
    path: paths.assets + 'fonts/iconfont/**/*.{ttf,svg,woff,woff2,otf,eot}'
  }],
  // An array of paths to images to be optimized.
  img: [
    paths.images + '**/*.{png,jpg,jpeg,gif,svg}'
  ],
  // An array containing objects required to build a single JavaScript file.
  js: [{
    copy: true,
    paths: [paths.scripts + '/**/*.js', '!' + paths.scriptsVendor + "**/*.js", '!' + paths.scripts + '/utils/jquery.pagination.js']
  }],
  vendor: [{
    name: 'require.js',
    copy: true,
    paths: paths.npm + 'requirejs/require.js'
  }, {
    name: 'jquery.js',
    copy: true,
    paths: paths.npm + 'jquery/dist/jquery.js'
  }, {
    name: 'jquery.scrollbar.js',
    copy: true,
    paths: paths.npm + 'jquery.nicescroll/jquery.nicescroll.min.js'
  }, {
    name: 'jquery.select2.js',
    copy: true,
    paths: paths.npm + 'select2/dist/js/select2.js'
  }, {
    name: 'jquery.bootstrap.datepicker.js',
    copy: true,
    paths: paths.npm + 'bootstrap-datepicker/dist/js/bootstrap-datepicker.min.js'
  }, {
    name: 'jquery.sizzle.js',
    copy: true,
    paths: paths.npm + 'jquery/src/sizzle/dist/sizzle.js'
  }, {
    name: 'jquery.validate.js',
    copy: true,
    paths: paths.npm + 'jquery-validation/dist/jquery.validate.js'
  }, {
    name: 'jquery.validate.unobtrusive.js',
    copy: true,
    paths: paths.npm + 'jquery-validation-unobtrusive/jquery.validate.unobtrusive.js'
  }, {
    name: 'jquery.sortable.js',
    copy: true,
    paths: paths.npm + 'jquery-sortable/source/js/jquery-sortable.js'
  }, {
    name: 'jquery.highcharts.js',
    copy: true,
    paths: paths.npm + 'highcharts/highcharts.js'
  }, {
    name: 'jquery.fileupload.js',
    copy: true,
    paths: paths.scriptsVendor + 'fileLoad@9.12.5/js/jquery.fileupload.js'
  }, {
    name: 'jquery.ui.widget.js',
    copy: true,
    paths: paths.scriptsVendor + 'fileLoad@9.12.5/js/jquery.ui.widget.js'
  }, {
    name: 'jquery.download.js',
    copy: true,
    paths: paths.npm + 'jquery-multidownload/jquery-multidownload.js'
  }, {
    name: 'howler.js',
    copy: true,
    paths: paths.npm + 'howler/dist/howler.min.js'
  }, {
    name: 'nprogress.js',
    copy: true,
    paths: paths.npm + 'nprogress/nprogress.js'
  }, {
    name: 'pinyin.js',
    copy: true,
    paths: paths.scriptsVendor + 'pinyin.js'
  }, {
    name: 'jquery.fullscreen.js',
    copy: true,
    paths: paths.scriptsVendor + 'jquery.fullscreen.js'
  }],
  umdVendor: [{
    name: 'jquery.bootstrap.js',
    copy: true,
    paths: paths.npm + 'bootstrap-sass/assets/javascripts/bootstrap.min.js'
  }],
  umdUtils: [{
    name: 'jquery.pagination.js',
    copy: true,
    paths: paths.scripts + 'utils/jquery.pagination.js'
  }]
};

// Initialize the mappings between the source and output files.
var lintSources = {
  css: paths.scss + '**/*.css',
  scss: paths.scss + '**/*.scss',
  js: [paths.scripts + 'views/**/*.js']
};

// Calls and returns the result from the gulp-size plugin to print the size of the stream. Makes it more readable.
function sizeBefore(title) {
  return size({
    title: 'Before: ' + title
  });
}

function sizeAfter(title) {
  return size({
    title: 'After: ' + title
  });
}

/*
 * Deletes all files and folders within the css directory.
 */
gulp.task('clean-css', function (cb) {
  return rimraf(paths.css, cb);
});

/*
 * Deletes all files and folders within the fonts directory.
 */
gulp.task('clean-fonts', function (cb) {
  return rimraf(paths.fonts, cb);
});

/*
 * Deletes all files and folders within the js directory.
 */
gulp.task('clean-js', function (cb) {
  return rimraf(paths.js, cb);
});

/*
 * Deletes all files and folders within the css, fonts and js directories.
 */
gulp.task('clean', ['clean-css', 'clean-fonts', 'clean-js']);

/*
 * Report warnings and errors in your CSS and SCSS files (lint them) under the scss folder.
 */
gulp.task('lint-css', function () {
  return merge([ // Combine multiple streams to one and return it so the task can be chained.
    gulp.src(lintSources.css) // Start with the source .css files.
      .pipe(plumber()) // Handle any errors.
      .pipe(csslint()) // Get any CSS linting errors.
      .pipe(csslint.reporter()), // Report any CSS linting errors to the console.
    gulp.src(lintSources.scss) // Start with the source .scss files.
      .pipe(plumber()) // Handle any errors.
      .pipe(sasslint()) // Run SCSS linting.
      .pipe(sasslint.format()) // Report any SCSS linting errors to the console.
      .pipe(sasslint.failOnError()) // Fail the task if an error is found.
  ]);
});

/*
 * Report warnings and errors in your JavaScript files (lint them) under the Scripts folder.
 */
gulp.task('lint-js', function () {
  return merge([ // Combine multiple streams to one and return it so the task can be chained.
    gulp.src(lintSources.js) // Start with the source .js files.
      .pipe(plumber()) // Handle any errors.
      .pipe(jshint()) // Get any JavaScript linting errors.
      .pipe(jshint.reporter('default', { // Report any JavaScript linting errors to the console.
        verbose: true
      })),
    gulp.src(lintSources.ts) // Start with the source .ts files.
      .pipe(plumber()) // Handle any errors.
      .pipe(tslint()) // Get any TypeScript linting errors.
      .pipe(tslint.report('verbose')), // Report any TypeScript linting errors to the console.
    gulp.src(lintSources.js) // Start with the source .js files.
      .pipe(plumber()) // Handle any errors.
      .pipe(jscs()) // Get and report any JavaScript style linting errors to the console.
  ]);
});

/*
 * Report warnings and errors in your scss and scripts (lint them).
 */
gulp.task('lint', [
  'lint-css',
  'lint-js'
]);

/*
 * Bulid JavaScript with UMD.
 * jQuery.Bootstrap.js
 */
gulp.task('umd-vendor', function () {
  // 处理jquery的全局变量名
  var jqueryFileName = function (file) {
    var name = path.basename(file.path, path.extname(file.path));
    return name.replace(/jquery/gi, 'jQuery');
  };
  var tasks = sources.umdVendor.map(function (source) {
    return gulp
      .src(source.paths)
      .pipe(plumber())
      .pipe(gulpif(source.name !== undefined,
        rename({ // Rename the file to the source name.
          basename: source.name,
          extname: ''
        })))
      .pipe(umd({
        dependencies: function (file) {
          return [{
            name: 'jquery',
            amd: 'jquery',
            cjs: 'jquery',
            global: 'jQuery',
            param: 'jQuery'
          }];
        },
        namespace: function (file) {
          return jqueryFileName(file);
        },
        exports: function (file) {
          return jqueryFileName(file);
        }
      }))
      .pipe(gulp.dest(paths.vendor));
  });
  return merge(tasks);
});

/*
 * Bulid JavaScript with UMD.
 * jQuery.Bootstrap.js
 */
gulp.task('umd-utils', function () {
  // 处理jquery的全局变量名
  var jqueryFileName = function (file) {
    var name = path.basename(file.path, path.extname(file.path));
    return name.replace(/jquery/gi, 'jQuery');
  };
  var tasks = sources.umdUtils.map(function (source) {
    return gulp
      .src(source.paths)
      .pipe(plumber())
      .pipe(gulpif(source.name !== undefined,
        rename({ // Rename the file to the source name.
          basename: source.name,
          extname: ''
        })))
      .pipe(umd({
        dependencies: function (file) {
          return [{
            name: 'jquery',
            amd: 'jquery',
            cjs: 'jquery',
            global: 'jQuery',
            param: 'jQuery'
          }];
        },
        namespace: function (file) {
          return jqueryFileName(file);
        },
        exports: function (file) {
          return jqueryFileName(file);
        }
      }))
      .pipe(gulp.dest(paths.umdUtils));
  });
  return merge(tasks);
});

/*
 * Builds the CSS for the site.
 */
gulp.task('build-css', function () {
  var tasks = sources.css.map(function (source) { // For each set of source files in the sources.
    if (source.copy) { // If we are only copying files.
      return gulp
        .src(source.paths) // Start with the source paths.
        .pipe(plumber())
        .pipe(gulpif(source.name !== undefined,
          rename({ // Rename the file to the source name.
            basename: source.name,
            extname: ''
          })))
        .pipe(gulp.dest(paths.css)); // Saves the CSS file to the specified destination path.
    }
  });
  return merge(tasks); // Combine multiple streams to one and return it so the task can be chained.
});

/*
 * Builds the SCSS for the site.
 */
gulp.task('build-scss', function () {
  return gulp // Return the stream.
    .src([paths.scss + '**/*.scss']) // Start with the source paths.
    // .pipe(plumber())                    // Handle any errors.
    .pipe(sourcemaps.init())
    .pipe(sass()) // If the file is a SASS (.scss) file, compile it to CSS (.css).
    .pipe(autoprefixer({ // Auto-prefix CSS with vendor specific prefixes.
      browsers: [
        '> 1%', // Support browsers with more than 1% market share.
        'last 3 versions', // Support the last two versions of browsers.
        'ie >= 8'
      ]
    }))
    .pipe(sourcemaps.write('./.maps'))
    .pipe(gulp.dest(paths.css)) // Saves the CSS file to the specified destination path.
    .pipe(gulp.dest(paths.examples + 'css/'))
    .pipe(connect.reload());
});

/*
 * Builds the font files for the site.
 */
gulp.task('build-fonts', function () {
  var tasks = sources.fonts.map(function (source) { // For each set of source files in the sources.
    return gulp // Return the stream.
      .src(source.path) // Start with the source paths.
      .pipe(plumber()) // Handle any errors.
      .pipe(rename(function (path) { // Rename the path to remove an unnecessary directory.
        path.dirname = '';
      }))
      .pipe(gulp.dest(paths.fonts)) // Saves the font files to the specified destination path.
      .pipe(connect.reload());
  });
  return merge(tasks); // Combine multiple streams to one and return it so the task can be chained.
});

gulp.task('copy-vendor', function () {
  var tasks = sources.vendor.map(function (source) { // For each set of source files in the sources.
    if (source.copy) { // If we are only copying files.
      return gulp
        .src(source.paths) // Start with the source paths.
        .pipe(plumber())
        .pipe(gulpif(source.name !== undefined,
          rename({ // Rename the file to the source name.
            basename: source.name,
            extname: ''
          })))
        .pipe(gulp.dest(paths.vendor)); // Saves the JavaScript file to the specified destination path.
    }
  });
  return merge(tasks); // Combine multiple streams to one and return it so the task can be chained.
});

/*
 * Builds the JavaScript files for the site.
 */
gulp.task('build-js', function () {
  var tasks = sources.js.map(function (source) { // For each set of source files in the sources.
    if (source.copy) { // If we are only copying files.
      return gulp
        .src(source.paths) // Start with the source paths.
        .pipe(plumber())
        .pipe(gulpif(source.name,
          rename({ // Rename the file to the source name.
            basename: source.name,
            extname: ''
          })))
        .pipe(gulp.dest(paths.js)) // Saves the JavaScript file to the specified destination path.
        .pipe(connect.reload());
    }
  });
  return merge(tasks); // Combine multiple streams to one and return it so the task can be chained.
});

/*
 *  Build vendor in copy-vendor and umd-vendor
 */
gulp.task('build-vendor', ['copy-vendor', 'umd-vendor', 'umd-utils']);

/*
 * Cleans and builds the CSS, Font and JavaScript files for the site.
 */
gulp.task('build', [
  'build-css',
  'build-scss',
  'build-fonts',
  'build-js',
  'build-vendor',
  'optimize-images'
]);

gulp.task('test', function () {
  //return gulp
  //    .src(paths.tests + 'mocha.html')
  //    .pipe(mocha());
});

/*
 * Optimizes and compresses the GIF, JPG, PNG and SVG images for the site.
 */
gulp.task('optimize-images', function () {
  return gulp
    .src(sources.img) // Start with the source paths.
    .pipe(plumber()) // Handle any errors.
    .pipe(sizeBefore()) // Write the size of the file to the console before minification.
    .pipe(imagemin({ // Optimize the images.
      multipass: true, // Optimize SVG multiple times until it's fully optimized.
      optimizationLevel: 7 // The level of optimization (0 to 7) to make, the higher the slower it is.
    }))
    .pipe(gulp.dest(paths.img)) // Saves the image files to the specified destination path.
    .pipe(sizeAfter()); // Write the size of the file to the console after minification.
});


/*
 * Watch the scss folder for changes to .css, or .scss files. Build the CSS if something changes.
 */
gulp.task('watch-css', function () {
  return gulp
    .watch(
      paths.scss + '**/*.{css,scss}', // Watch the scss folder for file changes.
      ['build-scss']) // Run the build-css task if a file changes.
    .on('add', function (event) {
      gutil.log(gutil.colors.green('File ' + event.path + ' was ' + event.type + ', build-scss task started.'));
    })
    .on('change', function (event) { // Log the change to the console.
      gutil.log(gutil.colors.blue('File ' + event.path + ' was ' + event.type + ', build-scss task started.'));
    });
});

/*
 * Watch the scripts folder for changes to .js or .ts files. Build the JavaScript if something changes.
 */
gulp.task('watch-js', function () {
  return gulp
    .watch(
      paths.scripts + '**/*.{js,ts}', // Watch the scripts folder for file changes.
      ['build-js']) // Run the build-js task if a file changes.
    .on('change', function (event) { // Log the change to the console.
      gutil.log(gutil.colors.blue('File ' + event.path + ' was ' + event.type + ', build-js task started.'));
    });
});

/*
 * Watch the scripts and tests folder for changes to .js or .ts files. Run the JavaScript tests if something changes.
 */
gulp.task('watch-tests', function () {
  return gulp
    .watch([
      paths.scripts + '**/*.{js,ts}', // Watch the scripts folder for file changes.
      paths.tests + '**/*.{js,ts}' // Watch the tests folder for file changes.
    ], ['test']) // Run the test task if a file changes.
    .on('change', function (event) { // Log the change to the console.
      gutil.log(gutil.colors.blue('File ' + event.path + ' was ' + event.type + ', test task started.'));
    });
});

// 使用connect启动Web服务器
gulp.task('connect-examples', function () {
  connect.server({
    name: 'Pionner Modules',
    root: ['examples', 'dist'],
    port: 5555,
    livereload: true
  });
});

// 监听Html
gulp.task('html', function () {
  gulp.src(paths.examples + '**/*.html')
    .pipe(connect.reload());
});

// Watch Html
gulp.task('watch-html', function() {
  return gulp
    .watch([
      paths.examples + '**/*.html'
    ], ['html'])
    .on('add', function (event) {
      gutil.log(gutil.colors.green('File ' + event.path + ' was ' + event.type + ', build-html task started.'));
    })
    .on('change', function (event) { // Log the change to the console.
      gutil.log(gutil.colors.blue('File ' + event.path + ' was ' + event.type + ', build-html task started.'));
    });
});

/*
 * Watch the scss and scripts folders for changes. Build the CSS and JavaScript if something changes.
 */
gulp.task('watch', [ 'connect-examples', 'watch-css', 'watch-js', 'watch-html']);

/*
 * The default gulp task. This is useful for scenarios where you are not using Visual Studio. Does a full clean and
 * build before watching for any file changes.
 */
gulp.task(
  'default', [
    'clean',
    'build',
    'watch'
  ]);
