module.exports = function() {
  this.Given(/^I am on "([^"]*)"$/, function(arg1, callback) {
    if (arg1.indexOf('www') === -1) {
      arg1 = baseUrl + '/' + arg1;
    }

    driver.get(arg1).then(function() {
      callback();
    });
  });

  this.Given(/^I wait$/, function(callback) {
    browser.sleep(500).then(function() {
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
    });
  });


  /**
   * Force an element to be visible
   */
  this.Given(/^I show "([^"]*)"$/, function(arg1, callback) {
    driver.executeScript('$("' + arg1 + '").removeClass("hide").css("opacity", 1).css("display", "block");').then(function() {
      callback();
    });
  });

  /**
   * Confirm a dialog
   */
  this.Given(/^I confirm$/, function(callback) {
    driver.wait(function(){
      return driver.executeScript('return !!$(".ez-confirm button").is(":visible");');
    }, 5000, 'Taking too long to find an confirm dialog').then(function() {
      driver.findElement(by.xpath('//div[contains(@class, \'ez-confirm\')]/descendant::button[text()="Yes"]')).then(function(elem) {
        elem.click().then(function() {
          callback();
        }).addErrback(function(e) {
          callback.fail('Unable to click Yes button');
        });
      }).addErrback(function(e) {
        callback.fail('Unable to find Yes button');
      });
    });
  });


};







