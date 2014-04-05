/*
 * click.js
 *
 * Provides step definitions for click behaviour
 *
 * @author Joris de Wit <joris.w.dewit@gmail.com>
 */

var getIndex = require('./utils/getIndex');

/**
 * click helper function
 *
 * @param {function} _by
 * @param {int}      errCount
 */
var click = function(_by, errCount, callback) {
  browser.findElements(_by).then(function(elems) {
    elems[elems.length - 1].click().then(function() {
      callback();
    }).addErrback(function(e) {
      callback.fail(e.message);
    });
  }).addErrback(function(e) {
    if (errCount < 10) {
      errCount++;
      click(_by, errCount, callback);
    } else {
      callback.fail(e.message);
    }
  });
};

module.exports = function() {

  /**
   * Press a button with specified text
   *
   * Usage: Given I press "Submit"
   *
   * @params {string} arg1 The specified button text
   */
  this.Given(/^I press "([^"]*)"$/, function(arg1, callback) {
    if (arg1.match(/#.*/)) {
      driver.findElement(by.id(arg1.replace('#', ''))).then(function(el) {
        return el.click();
      }).then(function() {
        callback();
      });
    } else {
      driver.findElements(by.xpath('//button[text()="' + arg1 + '"]')).then(function(elems) {
        // click the last save button in case there are multiple forms
        return elems[elems.length - 1].click();
      }).then(function() {
        callback();
      });
    }
  });

  /**
   * Click on an element with by id, class, or link text
   *
   * Usage: Given I click on "#someButton"
   * Usage: Given I click on ".some-button"
   * Usage: Given I click on "Hey Man"
   *
   * @param {string} arg1 The text to match
   */
  this.Given(/^I click on "([^"]*)"$/, function(arg1, callback) {
    if (arg1.match(/^#.*/)) { // find by id
      driver.findElement(by.id(arg1.replace('#', ''))).then(function(el) {
        return el.click();
      }).then(function() {
        callback();
      });
    } else if (arg1.match(/^\..*/)) { // find by class
      driver.findElements(by.css(arg1)).then(function(els) {
        return els[els.length - 1].click();
      }).then(function() {
        callback();
      });
    } else { // find by link text
      driver.findElements(by.linkText(arg1)).then(function(els) {
        return els[els.length - 1].click();
      }).then(function() {
        callback();
      });
    }
  });

  /**
   * Click on an element with specified text
   *
   * Usage: Given I click on the element with text "Hey Man"
   *
   * @param {string} arg1 The text to match
   */
  this.Given(/^I click on element with text "([^"]*)"$/, function(arg1, callback) {
    click(by.xpath('//*[text()="' + arg1 + '"]'), 0, callback);
  });

  /**
   * Click on an element by index
   *
   * Usage: Given I click on the "first" ".list-button" element
   *
   * @param {string} arg1 The elements index
   * @param {string} arg2 The css locator
   */
  this.Given(/^I click on the "([^"]*)" "([^"]*)" element$/, function(arg1, arg2, callback) {
    browser.findElements(by.css(arg2)).then(function(elems) {
      elems[getIndex(arg1)].click().then(function() {
        callback();
      });
    });
  });

  /**
   * Click on a button by index
   *
   * Usage: Given I click on the "first" "Admin" button
   *
   * @param {string} arg1 The elements index
   * @param {string} arg2 The button text
   */
  this.Given(/^I click on the "([^"]*)" "([^"]*)" button$/, function(arg1, arg2, callback) {
    browser.findElements(by.linkText(arg2)).then(function(elems) {
      elems[getIndex(arg1)].click().then(function() {
        callback();
      });
    });
  });


  /**
   * Follow an elements href attribute
   *
   * Usage: Given I follow "#someLink"
   *
   * @param {string} arg1 The elements id
   */
  this.Given(/^I follow "([^"]*)"$/, function(arg1, callback) {
    if (arg1.indexOf('#') !== -1) {
      arg1 = arg1.replace('#', '');
      driver.findElement(by.id(arg1)).then(function(el) {
        el.getAttribute('href').then(function(href) {
          driver.get(href).then(function(v) {
            callback();
          });
        });
      }).addErrback(function(e) {
        callback.fail(e.message);
      });
    } else {
      callback.fail('TODO');
    }
  });

};
