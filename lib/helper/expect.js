module.exports = function(arg1, arg2, callback) {
  if (arg1 !== arg2) {
    callback.fail('Expected "' + arg1 + '" to equal "' + arg1 + '"');
  } else {
    callback();
  }
};
