var utils = require('./helper/utils');

module.exports = function() {
  this.Given(/^I am on "([^"]*)"$/, function(arg1, callback) {
    if (arg1.indexOf('www') === -1) {
      arg1 = baseUrl + '/' + arg1;
    }

    driver.get(arg1).then(callback);
  });

  /**
   * Wait for angular
   */
  this.Given(/^I wait for angular$/, function(callback) {
    browser.waitForAngular().then(function() {
      callback();
    });
  });


  this.Given(/^I wait$/, function(callback) {
    driver.sleep(500).then(function() {
      callback();
    });
  });

  /**
   * Wait for element
   */
  this.Given(/^I wait for "([^"]*)"$/, function(arg1, callback) {
    driver.wait(function() {
      return driver.executeScript('return ' + arg1 + ';');
    }, 5000, 'Taking too long to wait for ' + arg1).then(function() {
      callback();
    }, function() {
      callback.fail(e.message);
    });
  });

  /**
   * Dump an elements contents
   */
  this.Given(/^I dump "([^"]*)"$/, function(arg1, callback) {
    utils.findElement(arg1).then(function(el) {
      return el.getOuterHtml();
    }).then(function(html) {
      console.log(html);
      callback();
    });
  });



  /**
   * Force an element to be visible
   */
  this.Given(/^I show "([^"]*)"$/, function(arg1, callback) {
    driver.executeScript('$("' + arg1 + '").css({"opacity": 1, "display": "block", "visibility": "visible"});').then(callback);
  });

  /**
   * Confirm a dialog
   */
  this.Given(/^I confirm$/, function(callback) {
    browser.sleep(500).then(function() {
      return driver.findElement(by.xpath('//div[contains(@class, \'ez-confirm\')]/descendant::button[text()="Yes"]'));
    }).then(function(button) {
      return button.click();
    }).then(callback);
  });

};







