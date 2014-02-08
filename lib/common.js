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

  this.Given(/^I show "([^"]*)"$/, function(arg1, callback) {
    //driver.executeScript('$("' + arg1 + '").css("display", "block !important");').then(function() {
    driver.executeScript('$("' + arg1 + '").removeClass("hide");').then(function() {
      callback();
    });
  });


};







