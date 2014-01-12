var getIndex = require('./utils/getIndex');

module.exports = function() {
  this.Given(/^I press "([^"]*)"$/, function(arg1, callback) {
    if (arg1.match(/#.*/)) {
      arg1 = arg1.replace('#', '');
      this.browser.findElement(this.By.id(arg1)).click().then(function() {
        callback();
      });
    } else {
      this.browser.findElements(this.By.xpath('//button[text()="' + arg1 + '"]')).then(function(elems) {
        // click the last save button in case a form is displayed over another
        var i = elems.length - 1;
        elems[i].click().then(function() {
          callback();
        });
      });
    }
  });

  this.Given(/^I click on "([^"]*)"$/, function(arg1, callback) {
    var self = this;
    if (arg1.match(/#.*/)) {
      arg1 = arg1.replace('#', '');
      self.browser.findElement(self.By.id(arg1)).click().then(function() {
        callback();
      });
    } else {
      self.browser.findElement(self.By.linkText(arg1)).click().then(function() {
        callback();
      });
    }
  });

  this.Given(/^I click on the "([^"]*)" "([^"]*)" element$/, function(arg1, arg2, callback) {
    var self = this;
    this.browser.findElements(this.By.css(arg2)).then(function(elems) {
      elems[getIndex(arg1)].click().then(function() {
        callback();
      });
    });
  });
};
