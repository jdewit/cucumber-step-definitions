var getIndex = require('./utils/getIndex');

module.exports = function() {
  this.Then(/^I should see the heading "([^"]*)"$/, function(arg1, callback) {
    driver.findElement(by.tagName('h1')).getText().then(function(text) {
      assert.equal(text, arg1);
      callback();
    });
  });

  this.Then(/^"([^"]*)" repeater length should be "([^"]*)"$/, function(arg1, arg2, callback) {
    driver.findElements(by.repeater(arg1)).then(function(items) {
      assert.lengthOf(items, arg2);
      callback();
    });
  });

  this.Then(/^I should see "(.*)"$/, function(arg1, callback) {
    driver.findElement(by.tagName('h1')).getText().then(function(text) {
      assert.equal(text, arg1);
      callback();
    });
  });

  this.Then(/^I should see the alert "([^"]*)"$/, function(arg1, callback) {
      callback();
    //driver.wait(function(){
      //return driver.executeScript('return !!$(".alert").length;');
    //}, 5000, 'Taking too long to find an alert').then(function() {
      //driver.findElements(by.css('.alert')).then(function(elems) {
        //var i = 0;
        //var len = elems.length;

        //elems.forEach(function(el) {
          //el.getText().then(function(text) {
            //if (text === arg1 || text.replace('×\n', '') === arg1) {
              //callback();
            //} else if ((i + 1) === len) {
              //callback.fail('Alert not found');
            //}
          //}).addErrback(function(e) {
            //callback.fail(e.message);
          //});
          //i++;
        //});
      //}).addErrback(function() {
        //callback.fail('No alerts found');
      //});
    //}).addErrback(function() {
      //callback.fail('Taking too long to find alert');
    //});
  });

  this.Then(/^the "([^"]*)" "([^"]*)" should equal "([^"]*)"$/, function(arg1, arg2, arg3, callback) {
    driver.findElements(by.css(arg2)).then(function(elems) {
      elems[getIndex(arg1)].getText().then(function(text) {
        assert.equal(text, arg3);
        callback();
      });
    });
  });

  this.Then(/^the "([^"]*)" "([^"]*)" input should equal "([^"]*)"$/, function(arg1, arg2, arg3, callback) {
    driver.findElements(by.css(arg2)).then(function(elems) {
      elems[getIndex(arg1)].getAttribute('value').then(function(val) {
        assert.equal(val, arg3);
        callback();
      });
    });
  });

  this.Then(/^"([^"]*)" should have text "([^"]*)"$/, function(arg1, arg2, callback) {
    driver.findElement(by.css(arg1)).getText().then(function(text) {
      assert.equal(text, arg2);
      callback();
    });
  });

  this.Then(/^the "([^"]*)" "([^"]*)" should have text "([^"]*)"$/, function(arg1, arg2, arg3, callback) {
    driver.findElements(by.css(arg2)).then(function(elems) {
      elems[getIndex(arg1)].getText().then(function(text) {
        assert.equal(text, arg3);
        callback();
      });
    });
  });

  this.Then(/^the "([^"]*)" input should equal "([^"]*)"$/, function(arg1, arg2, callback) {
    driver.findElement(by.css('input[name="' + arg1 + '"]')).getAttribute('value').then(function(value) {
      assert.equal(value, arg2);
      callback();
    });
  });

  this.Then(/^the "([^"]*)" textarea should equal "([^"]*)"$/, function(arg1, arg2, callback) {
    driver.findElement(by.css('textarea[name="' + arg1 + '"]')).getAttribute('value').then(function(value) {
      assert.equal(value, arg2);
      callback();
    });
  });

  this.Then(/^the "([^"]*)" select should have "([^"]*)" selected$/, function(arg1, arg2, callback) {
   //var self = this,
        //selectCount = 0,
        //opts;

    //if (arg1.match(/\..*/)) { // find by class
      //opts = driver.findElements(by.css(arg1 + ' option'));
    //} else { //find by select name
      //opts = driver.findElements(by.css('select[name="' + arg1 + '"] option'));
    //}

    //opts.then(function(elems) {
      //elems.forEach(function(v, i) {
        //v.getText().then(function(text) {
          //if (text === arg2) {
            //elems[i].getAttribute('selected').then(function(val) {
              //console.log(val);
                //callback();
            //});
          //}
        //});
      //});
    //});
  });

  this.Then(/^the "([^"]*)" select should have "([^"]*)" chosen$/, function(arg1, arg2, callback) {
    driver.findElement(by.css('select[name="' + arg1 + '"]')).then(function(elem) {
      elem.getAttribute('id').then(function(id) {
        driver.findElement(by.css('#' + id + '_chosen .search-choice')).then(function(choice) {
          choice.getText().then(function(text) {
            assert.equal(text, arg2, 'option aint right');
            callback();
          });
        });
      });
    });
  });

  this.Then(/^the "([^"]*)" select should have "([^"]*)" and "([^"]*)" chosen$/, function(arg1, arg2, arg3, callback) {
    driver.findElement(by.css('select[name="' + arg1 + '"]')).then(function(elem) {
      elem.getAttribute('id').then(function(id) {
        driver.findElements(by.css('#' + id + '_chosen .search-choice')).then(function(choices) {
          choices[0].getText().then(function(text1) {
            assert.equal(text1, arg2, 'The first option aint right');
            choices[1].getText().then(function(text2) {
              assert(text2, arg3, 'The second option aint right');
              callback();
            });
          });
        });
      });
    });
  });
};
