var getIndex = require('./utils/getIndex');

module.exports = function() {
  this.Given(/^I submit the form$/, function(callback) {
    return this.browser.findElement(this.By.css('button[type="submit"]')).click().then(function() {
      callback();
    });
  });

  this.Given(/^I fill in "([^"]*)" with "([^"]*)"$/, function(arg1, arg2, callback) {
    var el = this.browser.findElement(this.By.css('input[name="' + arg1 + '"]'));
    el.clear();
    el.sendKeys(arg2).then(function() {
      callback();
    });
  });

  this.Given(/^I type in "([^"]*)" with "([^"]*)"$/, function(arg1, arg2, callback) {
    var el = this.browser.findElement(this.By.css('textarea[name="' + arg1 + '"]'));
    el.clear();
    el.sendKeys(arg2).then(function() {
      callback();
    });
  });

  this.Given(/^I select "([^"]*)" from "([^"]*)"$/, function(arg1, arg2, callback) {
    var self = this,
        option,
        opts;

    if (arg2.match(/\..*/)) { // find by class
      opts = self.browser.findElements(self.By.css(arg2 + ' option'));
    } else { //find by select name
      opts = self.browser.findElements(self.By.css('select[name="' + arg2 + '"] option'));
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
    var self = this,
        selectCount = 0,
        opts;

    if (arg3.match(/\..*/)) { // find by class
      opts = self.browser.findElements(self.By.css(arg3 + ' option'));
    } else { //find by select name
      opts = self.browser.findElements(self.By.css('select[name="' + arg3 + '"] option'));
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
    var self = this;
    self.browser.findElements(self.By.css(arg2)).then(function(elems) {
      var el = elems[getIndex(arg1)];
      el.clear();
      el.sendKeys(arg3).then(function() {
        callback();
      });
    });
  });

  this.Given(/^I choose "([^"]*)" from "([^"]*)"$/, function(arg1, arg2, callback) {
    var self = this;
    self.browser.findElement(self.By.css('select[name="' + arg2 + '"]')).then(function(elem) {
      elem.getAttribute('id').then(function(id) {
        self.browser.findElement(self.By.id(id + '_chosen')).then(function(chosenContainer) {
          chosenContainer.click().then(function() {
            self.browser.findElement(self.By.xpath('//li[text()="' + arg1 + '"]')).then(function(option) {
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
    var self = this;
    self.browser.findElement(self.By.css('select[name="' + arg3 + '"]')).then(function(elem) {
      elem.getAttribute('id').then(function(id) {
        self.browser.findElement(self.By.id(id + '_chosen')).then(function(chosenContainer) {
          chosenContainer.click().then(function() {
            self.browser.findElement(self.By.xpath('//li[text()="' + arg1 + '"]')).then(function(option) {
              option.click().then(function() {
                chosenContainer.click().then(function() {
                  self.browser.findElement(self.By.xpath('//li[text()="' + arg2 + '"]')).then(function(option) {
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
