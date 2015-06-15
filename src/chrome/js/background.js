// Necessary to launch the app as a Chrome app
// The path is relatie to the /build directory

chrome.app.runtime.onLaunched.addListener(function() {
  chrome.app.window.create('../index.html', {
    bounds: {
      width: 720,
      height: 500
    }
  });
});