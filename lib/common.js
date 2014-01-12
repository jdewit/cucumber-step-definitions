module.exports = function() {
  this.Given(/^I am on "([^"]*)"$/, function(arg1, callback) {
    if (arg1.indexOf('www') === -1) {
      arg1 = this.baseUrl + '/' + arg1;
    }

    this.browser.get(arg1).then(function() {
      callback();
    });
  });
};







