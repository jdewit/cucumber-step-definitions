module.exports = function() {
  this.Given(/^I am logged in as "([^"]*)"$/, function(arg1, callback) {
    var users = db.get('User');

    users.findOne({firstName: arg1}).on('success', function(user) {
      if (!user) { callback.fail(arg1 + ' not found in user collection'); }

      driver.get(baseUrl + '/login');
      driver.findElement(by.id('emailInput')).sendKeys(user.email);
      driver.findElement(by.id('passwordInput')).sendKeys('password');
      driver.findElement(by.tagName('button')).click().then(function() {
        return callback();
      });
    });
  });
};

