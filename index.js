module.exports = function() {
  require('./lib/click').call(this);
  require('./lib/common').call(this);
  require('./lib/login').call(this);
  require('./lib/should').call(this);
  require('./lib/form').call(this);
  require('./lib/window').call(this);
};
