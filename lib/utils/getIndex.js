module.exports = function(arg) {
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

