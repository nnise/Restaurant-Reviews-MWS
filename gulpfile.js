const gulp = require('gulp');
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