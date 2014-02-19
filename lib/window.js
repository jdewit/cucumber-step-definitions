module.exports = function() {

  /**
   * Switch to an iframe
   *
   * @param {string|number} name The iframes name or index
   */
  this.Given(/^I switch to "([^"]*)" iframe$/, function(arg1, callback) {
    driver.switchTo().frame(arg1).then(function() {
      callback();
    });
  });

  /**
   * Switch selenium context to last browser tab
   */
  this.Given(/^I switch to the last tab$/, function(callback) {
    driver.getAllWindowHandles().then(function(handles) {
      driver.switchTo().window(handles[handles.length - 1]);
      driver.executeScript('window.focus();').then(function() {
        callback();
      });
    });
  });

};
