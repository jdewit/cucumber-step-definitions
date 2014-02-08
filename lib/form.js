var getIndex = require('./utils/getIndex');



module.exports = function() {
  this.Given(/^I submit the form$/, function(callback) {
    return driver.findElement(by.css('button[type="submit"]')).click().then(function() {
      callback();
    });
  });

  /**
   * Fill in a text input or textarea with some text
   * @param string Matches either the inputs name attribute or its label text
   * @param string The text to input
   */
  this.Given(/^I fill in "([^"]*)" with "([^"]*)"$/, function(arg1, arg2, callback) {
    var action = function(input) {
      input.clear();
      input.sendKeys(arg2).then(function() {
        callback();
      });
    };

    if (arg2.indexOf('%') !== -1) {
      arg2 = parameters[arg2.replace(/%/g, '')];
    }

    if (arg1.indexOf('#') !== -1) {
      arg1 = arg1.replace('#', '');
      driver.findElement(by.id(arg1)).then(function(input) {
        action(input);
      }).addErrback(function(e) {
        callback.fail(e.message);
      });
    } else {
      driver.findElement(by.xpath('//input[name="' + arg1 + '"]')).then(function(input) {
        action(input);
      }).addErrback(function(e) {
        driver.findElement(by.xpath('//label[text()="' + arg1 + '"]')).then(function(label) {
          label.getAttribute('for').then(function(id) {
            browser.findElement(by.id(id)).then(function(input) {
              action(input);
            });
          });
        }).addErrback(function(e) {
          callback.fail(e.message);
        });
      });
    }
  });

  this.Given(/^I select "([^"]*)" from "([^"]*)"$/, function(arg1, arg2, callback) {
    var option,
        opts;

    if (arg2.match(/\..*/)) { // find by class
      opts = browser.findElements(by.css(arg2 + ' option'));
    } else { //find by select name
      opts = browser.findElements(by.css('select[name="' + arg2 + '"] option'));
    }

    opts.then(function(elems) {
      elems.forEach(function(v, i) {
        v.getText().then(function(text) {
          if (text === arg1) {
            option = v;
            v.click().then(function() {
              callback();
            });
          }
        });
      });
    });
  });

  this.Given(/^I select "([^"]*)" and "([^"]*)" from "([^"]*)"$/, function(arg1, arg2, arg3, callback) {
    var selectCount = 0,
        opts;

    if (arg3.match(/\..*/)) { // find by class
      opts = browser.findElements(by.css(arg3 + ' option'));
    } else { //find by select name
      opts = browser.findElements(by.css('select[name="' + arg3 + '"] option'));
    }

    opts.then(function(elems) {
      elems.forEach(function(v, i) {
        v.getText().then(function(text) {
          if (text === arg1 || text === arg2) {
            v.click().then(function() {
              selectCount++;
              if (selectCount === 2) {
                callback();
              }
            });
          }
        });
      });
    });
  });

  this.Then(/^I fill in the "([^"]*)" "([^"]*)" input with "([^"]*)"$/, function(arg1, arg2, arg3, callback) {
    browser.findElements(by.css(arg2)).then(function(elems) {
      var el = elems[getIndex(arg1)];
      el.clear();
      el.sendKeys(arg3).then(function() {
        callback();
      });
    });
  });

  /**
   * Simulate a file upload
   * @param string   arg1 Matches either the inputs name attribute or its label text
   * @param string   arg1 The text to input
   * @param function callback
   */
  this.Given(/^I upload "([^"]*)" with "([^"]*)"$/, function(arg1, arg2, callback) {
    var action = function(input) {
      input.sendKeys(arg2).then(function() {
        callback();
      });
    };

    if (arg2.indexOf('%') !== -1) {
      arg2 = parameters[arg2.replace(/%/g, '')];
    }

    if (arg1.indexOf('#') !== -1) {
      arg1 = arg1.replace('#', '');
      driver.findElement(by.id(arg1)).then(function(input) {
        action(input);
      }).addErrback(function(e) {
        callback.fail(e.message);
      });
    } else {
      driver.findElement(by.xpath('//input[name="' + arg1 + '"]')).then(function(input) {
        action(input);
      }).addErrback(function(e) {
        driver.findElement(by.xpath('//label[text()="' + arg1 + '"]')).then(function(label) {
          label.getAttribute('for').then(function(id) {
            browser.findElement(by.id(id)).then(function(input) {
              action(input);
            });
          });
        }).addErrback(function(e) {
          callback.fail(e.message);
        });
      });
    }
  });

  this.Given(/^I choose "([^"]*)" from "([^"]*)"$/, function(arg1, arg2, callback) {
    browser.findElement(by.css('select[name="' + arg2 + '"]')).then(function(elem) {
      elem.getAttribute('id').then(function(id) {
        browser.findElement(by.id(id + '_chosen')).then(function(chosenContainer) {
          chosenContainer.click().then(function() {
            browser.findElement(by.xpath('//li[text()="' + arg1 + '"]')).then(function(option) {
              option.click().then(function() {
                callback();
              });
            });
          });
        });
      });
    });
  });

  this.Given(/^I choose "([^"]*)" and "([^"]*)" from "([^"]*)"$/, function(arg1, arg2, arg3, callback) {
    browser.findElement(by.css('select[name="' + arg3 + '"]')).then(function(elem) {
      elem.getAttribute('id').then(function(id) {
        browser.findElement(by.id(id + '_chosen')).then(function(chosenContainer) {
          chosenContainer.click().then(function() {
            browser.findElement(by.xpath('//li[text()="' + arg1 + '"]')).then(function(option) {
              option.click().then(function() {
                chosenContainer.click().then(function() {
                  browser.findElement(by.xpath('//li[text()="' + arg2 + '"]')).then(function(option) {
                    option.click().then(function() {
                      callback();
                    });
                  });
                });
              });
            });
          });
        });
      });
    });
  });
};
