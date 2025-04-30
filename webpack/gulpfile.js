const gulp = require('gulp');
const exec = require('child_process').exec;
const browserSync = require('browser-sync').create();
const { file_path } = require('./library/constants/global');

// ✅ Set your local WordPress domain (NO PROXY)
const localDomain = "http://darker-than-blood-series.local/";

// ✅ File paths to watch
const paths = {
  php: `../**/*.php`,
  css: `../**/*.css`,
  scss: `../**/*.scss`,
  js: `../**/*.js`
};
function runWebpack(cb) { // ✅ Run Webpack
  exec('npm run build', function (err, stdout, stderr) {
    console.log(stdout);
    console.log(stderr);
    cb(err);
  });
}

// ✅ BrowserSync Task (Directly Reload `.local`)
function watchFiles() {
  browserSync.init({
    // Don't use proxy
    proxy: false,
    // Use snippet mode
    snippet: true,
    // Open this URL when starting
    urls: {
      local: "http://darker-than-blood-series.local/"
    },
    port: 800,
    // You can open specific paths
    startPath: "/components/your-component",
    // Add notify: false if you don't want the browserSync notification
    notify: true
  });

  // ✅ Watch PHP files → Full Page Reload
  gulp.watch(paths.php).on('change', browserSync.reload);

  // run webpack
  runWebpack();
  
}

// ✅ Default Gulp Task
exports.default = watchFiles;
