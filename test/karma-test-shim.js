/*global jasmine, __karma__, window*/
Error.stackTraceLimit = Infinity;
jasmine.DEFAULT_TIMEOUT_INTERVAL = 3000;

__karma__.loaded = function () {
};

var distPath = '/base/dist/';

function isJsFile(path) {
  return path.slice(-3) == '.js';
}

function isSpecFile(path) {
  return path.slice(-8) == '.spec.js';
}

function isAngular2FlexFile(path) {
  return isJsFile(path) && path.indexOf('vendor') == -1;
}

var allSpecFiles = Object.keys(window.__karma__.files)
  .filter(isSpecFile)
  .filter(isAngular2FlexFile);

// Load our SystemJS configuration.
System.config({
  baseURL: distPath
});

System.import(distPath + 'angular2-flex/system-config-spec.js').then(function() {
  // Load and configure the TestComponentBuilder.
  return Promise.all([
    System.import('@angular/core/testing'),
    System.import('@angular/platform-browser-dynamic/testing')
  ]).then(function (providers) {
    var testing = providers[0];
    var testingBrowser = providers[1];

    jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;

    testing.TestBed.initTestEnvironment(
        testingBrowser.BrowserDynamicTestingModule,
        testingBrowser.platformBrowserDynamicTesting());
  });
}).then(function() {
  // Finally, load all spec files.
  // This will run the tests directly.
  return Promise.all(
    allSpecFiles.map(function (moduleName) {
      return System.import(moduleName).then(function(module) {
        return module;
      });
    }));
}).then(__karma__.start, __karma__.error);
