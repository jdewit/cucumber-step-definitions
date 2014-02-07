Cucumber Step Definitions
=========================

A collection of step definitions for use with <a href="https://github.com/cucumber/cucumber-js">cucumberjs</a> and <href="https://github.com/angular/protractor">protractor</a>.
These steps are highly specific to my apps. They will likely only be useful to you as a reference. 

Usage
-----

Extend a particular set of steps like so:

```js
  // /project/features/step_definitions/form.js

  var form = require('cucumber-step-definitions').form;

  module.exports = function() {
    form.call(this);

    // you can override steps or add custom steps of your own

    //this.Given(/^I am on "([^"]*)"$/, function(arg1, callback) {
    //  driver.get(arg1 + 'some_custom_param').then(function() {
    //    callback();
    //  });
    //});
  };
```

##World.js
Checkout world_example.js
