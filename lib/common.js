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
    setTimeout(function() {
      callback();
    }, 1000);
  });

  this.Given(/^I go$/, function(next) {
    driver.get('http://www.google.ca');
      next();
  });


};







