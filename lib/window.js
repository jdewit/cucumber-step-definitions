module.exports = function() {

  /**
   * Switch to an iframe
   *
   * @param {string|number} name The iframes name or index
   */
  this.Given(/^I switch to "([^"]*)" iframe$/, function(arg1, callback) {
    driver.switchTo().frame(arg1).then(callback);
  });

  /**
   * Switch selenium context to last browser tab
   */
  this.Given(/^I switch to the last tab$/, function(callback) {
    driver.getAllWindowHandles().then(function(handles) {
      return driver.switchTo().window(handles[handles.length - 1]).then(function() {
        driver.executeScript('window.focus();');
      }).then(callback);
    });
  });

};
