var select = function(arg1, arg2, index, callback) {
  return findInput(arg2, index).then(function(select) {
    return select.findElement(by.xpath('//option[text()="'+ arg1 +'"]'));
  }).then(function(option) {
    return option.click();
  }).then(callback);
};


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
    findInput(arg1).then(function(input) {
      return input.clear().then(function() {
        return input.sendKeys(resolveParameter(arg2)).then(function() {
          return input.sendKeys(protractor.Key.TAB);
        });
      });
    }).then(callback);
  });


  /**
   * Select an option of a select element
   *
   * Step: Given I select "Some option text" from ".some-select-input"
   *
   * @params {string} arg1 The options text
   * @params {string} arg2 The selector [id, css selectors, label text]
   */
  this.Given(/^I select "([^"]*)" from "([^"]*)"$/, function(arg1, arg2, callback) {
    select(arg1, arg2, null, callback);
  });

  /**
   * Select an option of a select element by index
   *
   * @Spec: Given I select "Option Name" from the "first" ".select-input"
   *
   * @param {string} arg1 The options text
   * @param {string} arg2 The elements index
   * @param {string} arg3 The select elements css selector
   */
  this.Given(/^I select "([^"]*)" from the "([^"]*)" "([^"]*)"$/, function(arg1, arg2, arg3, callback) {
    select(arg1, arg3, getIndex(arg2), callback);
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



  /**
   * Fill in an input by index
   *
   * Spec: Given I fill the "second" ".item" input with "foo"
   *
   * @param {string} arg1 The index in text format [first, second, third, last]
   * @param {string} arg2 The CSS selector
   * @param {string} arg3 The text to insert in the input
   */
  this.Then(/^I fill in the "([^"]*)" "([^"]*)" input with "([^"]*)"$/, function(arg1, arg2, arg3, callback) {
    browser.findElements(by.css(arg2)).then(function(inputs) {
      return inputs[getIndex(arg1)];
    }).then(function(input) {
      return input.clear().then(function() {
        return input.sendKeys(arg3).then(function() {
          return input.sendKeys(protractor.Key.TAB);
        });
      });
    }).then(function() {
      callback();
    });
  });

  /**
   * Simulate a file upload
   * @param string   arg1 Matches either the inputs name attribute or its label text
   * @param string   arg1 The text to input
   * @param function callback
   */
  this.Given(/^I upload "([^"]*)" with "([^"]*)"$/, function(arg1, arg2, callback) {
    findInput(arg1).then(function(input) {
      return input.sendKeys(arg2);
    }).then(function() {
      callback();
    });
  });

  /**
   * Pick an option from jdewit/ez-select
   *
   * Spec: Given I ez-select "Some option text" from "Label Name"
   *
   * @param {string} arg1 The options text
   * @param {string} arg2 The inputs selector
   */
  this.Given(/^I ez-select "([^"]*)" from "([^"]*)"$/, function(arg1, arg2, callback) {
    findInput(arg2).then(function(ezSelect) {
      return ezSelect.findElement(by.css('.tag-container')).then(function(tagContainer) {
        return tagContainer.click().then(function() {
          return ezSelect;
        });
      });
    }).then(function(ezSelect) {
      return ezSelect.findElements(by.linkText(arg1)).then(function(els) {
        return els[els.length -1];
      });
    }).then(function(link) {
      return link.click();
    }).then(callback);
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
