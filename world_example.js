var assert = require('chai').assert,
    path = require('path'),
    browserName = process.env.browser || 'chrome',
    protractor = require('protractor'),
    webdriver = require('selenium-webdriver'),
    exec = require('child_process').exec,
    util = require('util')
;

var driver = new webdriver.Builder().usingServer('http://localhost:4444/wd/hub').withCapabilities(webdriver.Capabilities[browserName]()).build();

driver.manage().timeouts().setScriptTimeout(100000);

var browser = protractor.wrapDriver(driver);

module.exports = function() {
  this.registerHandler('AfterFeatures', function(e, done) {
    if (browserName === 'chrome') {
      exec('pkill chromedriver');
    } else if (browserName === 'phantomjs') {
      exec('pkill phantomjs');
    }

    browser.quit();

    setTimeout(function() {
      done();
    }, 1000);
  });
};

global.driver = driver;
global.browser = browser;
global.p = protractor;
global.by = protractor.By;
global.assert = assert;
global.baseUrl = 'http://www.google.com';
