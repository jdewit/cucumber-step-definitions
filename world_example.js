var assert = require('chai').assert,
    path = require('path'),
    browser = process.env.browser || 'phantomjs',
    protractor = require('protractor'),
    webdriver = require('selenium-webdriver')
;

var driver = new webdriver.Builder().usingServer('http://localhost:4444/wd/hub').withCapabilities(webdriver.Capabilities[browser]()).build();

driver.manage().timeouts().setScriptTimeout(100000);

module.exports.World = function World(callback) {
  this.browser = protractor.wrapDriver(driver);
  this.By = protractor.By;
  this.p = protractor;
  this.assert = assert;
  this.baseUrl = 'http://localhost:3000';

  callback();
};

