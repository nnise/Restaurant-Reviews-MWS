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
        .pipe(gulp.dest('src/img'))
);


//https://www.npmjs.com/package/run-sequence
// This will run in this order:
// * build-clean
// * build-scripts and build-styles in parallel
// * build-html
// * Finally call the callback function
gulp.task('build', function(callback) {
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



// Building the production service worker https://codelabs.developers.google.com/codelabs/workbox-indexeddb/index.html?index=..%2F..%2Findex#3
gulp.task('service-worker', () => {
  return workboxBuild.injectManifest({
    swSrc: 'app/sw.js',
    swDest: 'build/sw.js',
    globDirectory: 'build',
    globPatterns: [
      'css/styles.css',
      'index.html',
      'js/idb.js',
      'js/main.js',
      'img/**/*.*',
      'manifest.json'
    ]
  }).catch(err => {
    console.log('[ERROR]: ' + err);
  });
});

// This is the default task and app's build process
gulp.task('default', ['clean'], cb => {
  runSequence(
    'service-worker',
    cb
  );
});

