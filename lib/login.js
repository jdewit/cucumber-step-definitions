module.exports = function() {
  this.Given(/^I am logged in as "([^"]*)"$/, function(arg1, callback) {
    var users = db.get(models.users || 'users');

    users.findOne({firstName: arg1}).on('success', function(user) {
      if (!user) { callback.fail(arg1 + ' not found in user collection'); }

      driver.get(baseUrl + '/login').then(function() {
        return driver.findElement(by.id('emailInput'));
      }).then(function(el) {
        return el.sendKeys(user.email);
      }).then(function() {
        return driver.findElement(by.id('passwordInput'));
      }).then(function(el) {
        return el.sendKeys('password');
      }).then(function() {
        return driver.findElement(by.tagName('button'));
      }).then(function(button) {
        return button.click();
      }).then(function() {
        return driver.sleep(500);
      }).then(function() {
        callback();
      });
    });
  });
};

