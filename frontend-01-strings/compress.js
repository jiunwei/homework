// Front-End Engineer Exercise: String Compression
// Jiun Wei Chia
// 2017-03-22

function compress(str) {
  // Pre-conditions:
  // 1. str matches /[a-z]+/, and
  // 2. length of str can be stored as an exact integer using a JavaScript Number

  var result = '';
  var count = 0;      // Number of consecutive times previous character has appeared so far.
  var previous = '';  // The previous character, or '' if none.

  for (var i = 0; i < str.length; ++i) {
    var current = str.charAt(i);
    if (current !== previous) {
      // Start of input or current character has changed.
      if (count > 0) {
        result += previous + count;
      }
      previous = current;
      count = 1;
    } else {
      // Current character is same as previous.
      ++count;
    }
  }
  if (count > 0) {
    result += previous + count;
  }

  return result;
}

// Non-core JavaScript below is for testing purposes only.
if (module) {
  module.exports = compress;
}
