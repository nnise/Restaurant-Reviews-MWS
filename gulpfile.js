const gulp = require('gulp');
const browserSync = require('browser-sync');
const del = require('del');
const runSequence = require('run-sequence');
const fs = require('fs');
const workboxBuild = require('workbox-build');
const imagemin = require('gulp-imagemin');
const webp = require('gulp-webp');


/*
	TOP LEVEL FUNCTIONS
	gulp.task - Define tasks
	gulp.src - Point to files to use
	gulp.dest - Point to folder to output
	gulp.watch - Watch files and folders for changes

*/

// Logs Message
gulp.task('message', () =>
	console.log('Gulp is running...')
);

//Minify images
gulp.task('imageMin', () =>
    gulp.src('img/*')
        .pipe(imagemin())
        .pipe(gulp.dest('dist/img'))
);


//Serve Images in Next-Gen Formats WebP
gulp.task('formatWebP', () =>
    gulp.src('src/img/*.jpg')
        .pipe(webp())
        .pipe(gulp.dest('dist/img'))
);


//https://www.npmjs.com/package/run-sequence
// This will run in this order:
// * build-clean
// * build-scripts and build-styles in parallel
// * build-html
// * Finally call the callback function
/*gulp.task('build', function(callback) {
  runSequence('build-clean',
              ['build-scripts',],
              'build-html',
              callback);
});
 
// configure build-clean, build-scripts, build-styles, build-html as you wish,
// but make sure they either return a stream or promise, or handle the callback
// Example:
 
gulp.task('build-clean', function() {
    // Return the Promise from del()
    return del([BUILD_DIRECTORY]);
//  ^^^^^^
//   This is the key here, to make sure asynchronous tasks are done!
});
 
gulp.task('build-scripts', function() {
    // Return the stream from gulp
    return gulp.src(SCRIPTS_SRC).pipe(...)...
//  ^^^^^^
//   This is the key here, to make sure tasks run to completion!
});
 
gulp.task('callback-example', function(callback) {
    // Use the callback in the async function
    fs.readFile('...', function(err, file) {
        console.log(file);
        callback();
//      ^^^^^^^^^^
//       This is what lets gulp know this task is complete!
    });
});
*/




// Building the production service worker https://codelabs.developers.google.com/codelabs/workbox-indexeddb/index.html?index=..%2F..%2Findex#3
gulp.task('service-worker', () => {
    return workboxBuild.injectManifest({
        globDirectory: 'dist',
        globPatterns: [
            '**/*.{html,css,js,webp}'
        ],
        swDest: 'dist/sw.js',
        swSrc: 'src/sw.js',
    }).then(({warnings}) => {
        // In case there are any warnings from workbox-build, log them.
        for (const warning of warnings) {
          console.warn(warning);
        }
        console.info('Service worker generation completed.');
      }).catch((error) => {
        console.warn('Service worker generation failed:', error);
      });
});


gulp.task('clean', () => {
    return del('dist');
})


gulp.task('copyCss', () => {
    return gulp.src('src/css/styles.css')
    .pipe(gulp.dest('dist/css'));
})

gulp.task('copyHtml', () => {
    gulp.src(['src/index.html', 'src/restaurant.html'])
        .pipe(gulp.dest('dist'))
});

//Afterwars minify and uglify js
gulp.task('copyJS', () => {
    gulp.src(['src/js/dbhelper.js', 'src/js/idb.js', 'src/js/main.js', 'src/js/restaurant_info.js' ])
        .pipe(gulp.dest('dist/js'))
});


gulp.task('copy-manifest', () => {
    gulp.src('src/manifest.json')
    .pipe(gulp.dest('dist'));
})

gulp.task('copy-icons', () => {
    gulp.src('src/img/icons/*.png')
    .pipe(gulp.dest('dist/img/icons'));
})

// This is the default task and app's build process
gulp.task('default', ['clean'], cb => {
  runSequence(
    'copyCss',
    'copyHtml',
    'copyJS',
    'copy-manifest',
    'imageMin',
    'formatWebP',
    'copy-icons',
    'service-worker',
    cb
  );
});


