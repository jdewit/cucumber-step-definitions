module.exports = function() {
  this.Given(/^I am on "([^"]*)"$/, function(arg1, callback) {
    if (arg1.indexOf('www') === -1) {
      arg1 = baseUrl + '/' + arg1;
    }

    driver.get(arg1).then(callback);
  });

  this.Given(/^I wait$/, function(callback) {
    browser.sleep(500).then(callback);
  });

  /**
   * Wait for element
   */
  this.Given(/^I wait for "([^"]*)"$/, function(arg1, callback) {
    driver.wait(function() {
      return driver.executeScript('return ' + arg1 + ';');
    }, 5000, 'Taking too long to wait for ' + arg1).then(callback);
  });


  /**
   * Force an element to be visible
   */
  this.Given(/^I show "([^"]*)"$/, function(arg1, callback) {
    driver.executeScript('$("' + arg1 + '").removeClass("hide").css("opacity", 1).css("display", "block");').then(callback);
  });

  /**
   * Confirm a dialog
   */
  this.Given(/^I confirm$/, function(callback) {
    driver.wait(function(){
    }, 500).then(function() {
      return driver.findElement(by.xpath('//div[contains(@class, \'ez-confirm\')]/descendant::button[text()="Yes"]'));
    }).then(function(button) {
      return button.click();
    }).then(callback);
  });

};







