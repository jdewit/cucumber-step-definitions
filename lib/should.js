var getIndex = require('./utils/getIndex');

module.exports = function() {
  this.Then(/^I should see the heading "([^"]*)"$/, function(arg1, callback) {
    driver.findElement(by.tagName('h1')).getText().then(function(text) {
      assert.equal(text, arg1);
      callback();
    });
  });

  this.Then(/^"([^"]*)" repeater length should be "([^"]*)"$/, function(arg1, arg2, callback) {
    browser.element.all(by.repeater(arg1)).then(function(items) {
      assert.lengthOf(items, arg2);
      callback();
    });
  });

  this.Then(/^I should see "(.*)"$/, function(arg1, callback) {
    var errCount = 0;
    var action = function() {
      driver.findElement(by.xpath('//*[text()="' + arg1 + '"]')).then(function(el) {
        callback();
      }, function(e) {
        if (errCount < 10) {
          errCount += 1;
          action();
        } else {
          callback.fail('"' + arg1 + '" not found anywhere on the page');
        }
      });
    };

    action();
  });

  this.Then(/^I should not see "(.*)"$/, function(arg1, callback) {
    browser.findElements(by.xpath('//*[text()="' + arg1 + '"]')).then(function(el) {
      if (el.length === 0) {
        callback();
      } else {
        callback.fail('"' + arg1 + '" should not be seen');
      }
    }, function(e) {
      callback();
    });
  });

  this.Then(/^I should see the alert "([^"]*)"$/, function(arg1, callback) {
    driver.wait(function(){
      return driver.executeScript('return !!$(".alert").length;');
    }, 3000, 'Taking too long to find alert').then(function() {
      return browser.findElement(by.xpath('//div[text()="' + arg1 + '"]'));
    }).then(function(el) {
      // clean up alert
      return driver.executeScript('$(".alert").remove();');
    }).then(function() {
      callback();
    }, function() {
      callback.fail('alert with text "' + arg1 + '" not found');
    });
  });

  this.Then(/^model "([^"]*)" should be "([^"]*)"$/, function(arg1, arg2, callback) {
    var v = browser.element(by.model(arg1));
    v.getText(function(text) {
      if (text === arg2) {
        callback();
      } else {
        callback.fail('Expected "' + arg1 + '" to be "' + arg2 + '"');
      }
    });
  });

  this.Then(/^model "([^"]*)" should have length "([^"]*)"$/, function(arg1, arg2, callback) {
     ptor.findElement(by.model(arg1)).then(function(el) {
      if (el.length === arg2) {
        callback();
      } else {
        callback.fail('Expected "' + arg1 + '" to have length "' + arg2 + '"');
      }
    });
  });


  this.Then(/^the "([^"]*)" "([^"]*)" should equal "([^"]*)"$/, function(arg1, arg2, arg3, callback) {
    driver.findElements(by.css(arg2)).then(function(elems) {
      return elems[getIndex(arg1)];
    }).then(function(el) {
      return el.getText();
    }).then(function(text) {
      assert.equal(text, arg3);
      callback();
    });
  });

  this.Then(/^the "([^"]*)" "([^"]*)" input should equal "([^"]*)"$/, function(arg1, arg2, arg3, callback) {
    browser.findElements(by.css(arg2)).then(function(elems) {
      return elems[getIndex(arg1)];
    }).then(function(el) {
      return el.getAttribute('value');
    }).then(function(val) {
      assert.equal(val, arg3);
      callback();
    });
  });

  /**
   * Spec: ".some-element-class" should have text "Some text"
   *
   * @params {string} arg1 CSS selector
   * @params {string} arg2 Text to match
   */
  this.Then(/^"([^"]*)" should have text "([^"]*)"$/, function(arg1, arg2, callback) {
    driver.findElement(by.css(arg1)).then(function(el) {
      return el.getText();
    }).then(function(text) {
      assert.equal(text, arg2);
    }).then(callback);
  });

  this.Then(/^executing "([^"]*)" should return true$/, function(arg1, callback) {
    driver.wait(function(){
      return driver.executeScript('return ' + arg1 + ';');
    }, 5000, 'Taking too long to execute until true').then(function() {
      callback();
    });
  });

  /**
   * Find an element by index and verify its text
   *
   * Spec: Then the "first" ".list-item" should have text "something"
   *
   * @param {string} arg1 The elements index ie first, second, third, last
   * @param {string} arg2 CSS locator
   * @param {arg3}   arg3 The text to match
   */
  this.Then(/^the "([^"]*)" "([^"]*)" should have text "([^"]*)"$/, function(arg1, arg2, arg3, callback) {
    driver.findElements(by.css(arg2)).then(function(elems) {
      return elems[getIndex(arg1)];
    }).then(function(el) {
      return el.getText();
    }).then(function(text) {
      assert.equal(text, arg3);
      callback();
    }, function(e) {
      callback.fail(e.message);
    });
  });

  this.Then(/^the "([^"]*)" input should equal "([^"]*)"$/, function(arg1, arg2, callback) {
    driver.findElement(by.css('input[name="' + arg1 + '"]')).then(function(el) {
      return el.getAttribute('value');
    }).then(function(value) {
      assert.equal(value, arg2);
      callback();
    });
  });

  this.Then(/^the "([^"]*)" textarea should equal "([^"]*)"$/, function(arg1, arg2, callback) {
    driver.findElement(by.css('textarea[name="' + arg1 + '"]')).getAttribute('value').then(function(value) {
      assert.equal(value, arg2);
      callback();
    });
  });

  this.Then(/^"([^"]*)" should be visible$/, function(arg1, callback) {
    browser.findElement(by.css(arg1)).then(function(elem) {
      callback();
    }).addErrback(function() {
      callback.fail(arg1 + ' not visible');
    });
  });

  this.Then(/^"([^"]*)" should have "([^"]*)" selected$/, function(arg1, arg2, callback) {
    var selectCount = 0,
        opts;

    if (arg1.match('^#')) {
      opts = driver.findElements(by.css(arg1 + ' option'));
    } else { //find by select name
      opts = driver.findElements(by.css('select[name="' + arg1 + '"] option'));
    }

    opts.then(function(elems) {
      elems.forEach(function(v, i) {
        v.getText().then(function(text) {
          if (text === arg2) {
            callback();
          }
        });
      });
    });
  });

  this.Then(/^the "([^"]*)" "([^"]*)" should have "([^"]*)" selected$/, function(arg1, arg2, arg3, callback) {
    // express the regexp above with the code you wish you had
    callback.pending();
  });


  this.Then(/^the "([^"]*)" select should have "([^"]*)" chosen$/, function(arg1, arg2, callback) {
    driver.findElement(by.css('select[name="' + arg1 + '"]')).then(function(elem) {
      elem.getAttribute('id').then(function(id) {
        driver.findElement(by.css('#' + id + '_chosen .search-choice')).then(function(choice) {
          choice.getText().then(function(text) {
            assert.equal(text, arg2, 'option aint right');
            callback();
          });
        });
      });
    });
  });

  this.Then(/^the "([^"]*)" select should have "([^"]*)" and "([^"]*)" chosen$/, function(arg1, arg2, arg3, callback) {
    driver.findElement(by.css('select[name="' + arg1 + '"]')).then(function(elem) {
      elem.getAttribute('id').then(function(id) {
        driver.findElements(by.css('#' + id + '_chosen .search-choice')).then(function(choices) {
          choices[0].getText().then(function(text1) {
            assert.equal(text1, arg2, 'The first option aint right');
            choices[1].getText().then(function(text2) {
              assert(text2, arg3, 'The second option aint right');
              callback();
            });
          });
        });
      });
    });
  });

  /**
   * Assert the pages title
   *
   * @param {string} arg1 The expected page title
   */
  this.Then(/^the page title should be "([^"]*)"$/, function(arg1, callback) {
    driver.wait(function() {
      return driver.executeScript('return (document.getElementsByTagName("title")[0] && document.getElementsByTagName("title")[0].innerHTML === "' + arg1 + '");');
    }, 10000, 'Taking too long to find title').then(function() {
      callback();
    });
  });

  /**
   * Assert an element exists on the page
   *
   * @param {string} id or CSS selector
   */
  this.Then(/^"([^"]*)" should exist$/, function(arg1, callback) {
    var action = function(_by) {
      browser.findElement(_by).then(function(el) {
        callback();
      }).addErrback(function(e) {
        callback.fail(e.message);
      });
    };

    if (arg1.match(/^#.*/)) { // find by id
      arg1 = arg1.replace('#', '');
      action(by.id(arg1));
    } else { // find by class
      action(by.css(arg1));
    }
  });

  /**
   * Assert an element does not exist on the page
   *
   * @param {string} id or CSS selector
   */
  this.Then(/^"([^"]*)" should not exist$/, function(arg1, callback) {
    var action = function(_by) {
      browser.findElement(_by).then(function(el) {
        callback.fail(arg1 + ' should not exist');
      }).addErrback(function(e) {
        callback();
      });
    };

    if (arg1.match(/^#.*/)) { // find by id
      arg1 = arg1.replace('#', '');
      action(by.id(arg1));
    } else { // find by class
      action(by.css(arg1));
    }
  });

};
