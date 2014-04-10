/*
 * click.js
 *
 * Provides step definitions for click behaviour
 *
 * @author Joris de Wit <joris.w.dewit@gmail.com>
 */
module.exports = function() {

  /**
   * Press a button with specified text
   *
   * Usage: Given I press "Submit"
   *
   * @params {string} arg1 The specified button text
   */
  this.Given(/^I press "([^"]*)"$/, function(arg1, callback) {
    findElement(arg1).then(function(button) {
      return button.click();
    }).then(callback);
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
    findElement(arg1).then(function(el) {
      return el.click();
    }).then(callback);
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
    findElement(arg2, getIndex(arg1)).then(function(el) {
      return el.click();
    }).then(callback);
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
    findElement(getIndex(arg1), arg2).then(function(el) {
      return el.click();
    }).then(callback);
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
