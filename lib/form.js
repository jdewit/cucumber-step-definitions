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
    var action = function(_by) {
      driver.findElements(_by).then(function(inputs) {
        console.log('inputs count = ' + inputs.length);
        var input = inputs[inputs.length - 1];

        //input.isDisplayed().then(function() {
          input.clear().then(function() {
            input.sendKeys(arg2).then(function() {
              callback();
            });
          });
        //}).addErrback(function(e) {
          //action(_by);
        //});
      }).addErrback(function(e) {
        callback.fail(e.message);
      });
    };

    // replace parameter value
    if (arg2.indexOf('%') !== -1) {
      arg2 = parameters[arg2.replace(/%/g, '')];
    }

    if (arg1.match(/^#.*/)) { // find by id if hash is found
      arg1 = arg1.replace('#', '');
      action(by.id(arg1));
    } else if (arg1.match(/^\..*/)) { // find by css if . is found
      action(by.css(arg1));
    } else if (/[A-Z]/.test(arg1[0])) { // find by label if first letter of arg1 is capitalized
      driver.findElement(by.xpath('//label[text()="' + arg1 + '"]')).then(function(label) {
        label.getAttribute('for').then(function(id) {
          action(by.id(id));
        });
      }).addErrback(function(e) {
        callback.fail(e.message);
      });
    } else {  // find by name attribute
      action(by.xpath('//[name="' + arg1 + '"]'));
    }
  });

  this.Given(/^I select "([^"]*)" from "([^"]*)"$/, function(arg1, arg2, callback) {
    var option,
        opts;

    var action = function(opts) {
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
    };

    if (arg2.match(/\..*/)) { // find by class
      action(browser.findElements(by.css(arg2 + ' option')));
    } else if (/[A-Z]/.test(arg2[0])) { // find by label if first letter of arg1 is capitalized
      driver.findElements(by.xpath('//label[text()="' + arg2 + '"]')).then(function(labels) {
        labels[labels.length - 1].getAttribute('for').then(function(id) {
          action(browser.findElements(by.css('#' + id + ' option')));
        });
      });
    } else { //find by select name
      action(browser.findElements(by.css('select[name="' + arg2 + '"] option')));
    }
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

  this.Given(/^I check "([^"]*)"$/, function(arg1, callback) {
    var action = function(_by) {
      browser.findElement(_by).then(function(el) {
        el.click().then(function() {
          callback();
        }).addErrback(function(e) {
          callback.fail(e.message);
        });
      }).addErrback(function(e) {
        callback.fail(e.message);
      });
    };

    if (arg1.match(/^#.*/)) { // find by id
      arg1 = arg1.replace('#', '');
      action(by.id(arg1));
    } else if (arg1.match(/\..*/)) { // find by class
      console.log('css!');
      action(by.css(arg1));
    } else { // find by link text
      action(by.linkText(arg1));
    }
  });

  this.Given(/^I check the "([^"]*)" "([^"]*)"$/, function(arg1, arg2, callback) {
    var action = function(_by) {
      browser.findElements(_by).then(function(elems) {
        elems[getIndex(arg1)].click().then(function() {
          callback();
        }).addErrback(function(e) {
          callback.fail(e.message);
        });
      }).addErrback(function(e) {
        callback.fail(e.message);
      });
    };

    action(by.css(arg2));
  });



  this.Then(/^I fill in the "([^"]*)" "([^"]*)" input with "([^"]*)"$/, function(arg1, arg2, arg3, callback) {
    browser.findElements(by.css(arg2)).then(function(elems) {
      elems[getIndex(arg1)].then(function(el) {
        el.clear(function() {
          el.sendKeys(arg3).then(function() {
            callback();
          });
        });
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
        console.log('okok');
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
