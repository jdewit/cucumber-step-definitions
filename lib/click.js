var getIndex = require('./utils/getIndex');

module.exports = function() {
  this.Given(/^I press "([^"]*)"$/, function(arg1, callback) {
    if (arg1.match(/#.*/)) {
      arg1 = arg1.replace('#', '');
      driver.findElement(by.id(arg1)).click().then(function() {
        callback();
      });
    } else {
      driver.findElements(by.xpath('//button[text()="' + arg1 + '"]')).then(function(elems) {
        // click the last save button in case a form is displayed over another
        var i = elems.length - 1;
        elems[i].click().then(function() {
          callback();
        });
      });
    }
  });

  this.Given(/^I click on "([^"]*)"$/, function(arg1, callback) {
    if (arg1.indexOf('#') !== -1) {
      arg1 = arg1.replace('#', '');
      driver.findElement(by.id(arg1)).then(function(el) {
        el.click().then(function() {
          callback();
        }).addErrback(function(e) {
          callback.fail(e.message);
        });
      }).addErrback(function(e) {
        callback.fail(e.message);
      });
    } else {
      driver.findElement(by.linkText(arg1)).then(function(el) {
        el.click().then(function() {
          callback();
        }).addErrback(function(e) {
          callback.fail(e.message);
        });
      }).addErrback(function(e) {
        callback.fail(e.message);
      });
    }
  });

  this.Given(/^I click on the "([^"]*)" "([^"]*)" element$/, function(arg1, arg2, callback) {
    driver.findElements(by.css(arg2)).then(function(elems) {
      elems[getIndex(arg1)].click().then(function() {
        callback();
      });
    }).addErrback(function(e) {
      callback.fail(e.message);
    });
  });

  this.Given(/^I follow "([^"]*)"$/, function(arg1, callback) {
    if (arg1.indexOf('#') !== -1) {
      arg1 = arg1.replace('#', '');
      driver.findElement(by.id(arg1)).then(function(el) {
        el.getAttribute('href').then(function(href) {
          driver.get(href).then(function(v) {
            callback();
          });
        });
      }).addErrback(function(e) {
        callback.fail(e.message);
      });
    } else {
      callback.fail('TODO');
    }
  });

};
