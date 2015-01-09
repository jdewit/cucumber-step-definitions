/**
 * Finds an input through various methods and retries if needed
 *
 * @params {string} arg1 The argument to search for
 * @params {string} index The elements index ("null" returns the last element, "true" return all elements)
 * @params {int} attempts The amount of retry attempts
 * @returns WebdriverElement
 */
module.exports.findElement = function(arg1, index, attempts) {
  var self = this;
  index = index || null;
  attempts = attempts || 0;

  return (function() {
    if (/^[\w][\w\s]+/.test(arg1)) { // matches text of translation keys
      if ((attempts + 1) % 2) {
        return driver.findElements(by.xpath('//*[text()="' + arg1 + '"]'));
      } else {
        return driver.findElements(by.linkText(arg1));
      };

    } else if (/^#[\w\-]+/.test(arg1)) { // find by id if hash is found
      return driver.findElements(by.id(arg1.replace('#', '')));
    } else { // by css selector
      console.log('by css');
      return driver.findElements(by.css(arg1));
    }
  }()).then(function(elements) {
    if (attempts > 15) {
      throw new Error('Element not found with arg "' + arg1 + '"');
    }

    if (index === null) {
      var elem = elements[elements.length - 1];

      if (!!elem) {
        return elem.isDisplayed().then(function(isDisplayed) {
          if (!isDisplayed) {
            return self.findElement(arg1, index, (attempts + 1));
          } else {
            return elem;
          }
        });
      }
    } else if (index === true) {
      if (elements.length > 0) {
        return elements;
      }
    } else if (elements[index]) {
      return elements[index];
    }

    return self.findElement(arg1, index, (attempts + 1));
  }, function(e) {
    if (attempts < 5) {
      return self.findElement(arg1, index, (attempts + 1));
    } else {
      return e;
    }
  });
};

/**
 * Finds an input through various methods and retries if needed
 *
 * @params {string} arg1 The input query term
 * @params {int} attempts The amount of retry attempts
 * @returns WebdriverElement
 */
module.exports.findInput = function(arg1, attempts) {
  var self = this;
  attempts = attempts || 0;

  return (function() {
    if (arg1.match(/^#.*/)) { // find by id if hash is found
      return driver.findElement(by.id(arg1.replace('#', '')));
    } else if (arg1.match(/^\..*/)) { // find by css if . is found
      return driver.findElement(by.css(arg1));
    } else if (/[A-Z]/.test(arg1[0])) { // find by label if first letter of arg1 is capitalized
      return driver.findElement(by.xpath('//label[text()="' + arg1 + '"]')).then(function(label) {
        return label.getAttribute('for');
      }).then(function(id) {
        return driver.findElement(by.id(id));
      });
    } else {  // find by name attribute
      return driver.findElement(by.xpath('//*[@name="' + arg1 + '"]'));
    }
  }()).then(function(input) {
    return input;
  }, function(e) {
    if (attempts < 5) {
      return self.findInput(arg1, (attempts + 1));
    } else {
      return e;
    }
  });
};

/**
 * Replace placeholder with parameters
 *
 * placeholder should be between %  ex. %my_param%
 * @params {string} arg1 The text to replace with a placeholder
 */
module.exports.resolveParameter = function(arg1) {
  if (arg1.indexOf('%') !== -1) { // replace placeholder with parameter value if needed
   arg1 = parameters[arg1.replace(/%/g, '')];
  }
  return arg1;
};

/**
 * Convert text index into numerical equivalent
 *
 * @params {string} arg The index in text format
 * @return {integer} The index as an integer
 */
module.exports.getIndex = function(arg) {
  var index;

  switch (arg) {
    case 'first':
      index = 0;
    break;
    case 'second':
      index = 1;
    break;
    case 'third':
      index = 2;
    break;
    case 'fourth':
      index = 3;
    break;
    case 'fifth':
      index = 4;
    break;
  }

  return index;
};


