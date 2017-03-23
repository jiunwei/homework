// Front-End Engineer Exercise: String Compression Unit Tests
// Jiun Wei Chia
// 2017-03-22

var assert = require('assert');

var compress = require('../compress.js')

describe('compress()', function() {
	it('should return \'a4b2a4b1a1b3c12\' when the input is \'aaaabbaaaababbbcccccccccccc\'', function() {
	  assert.equal('a4b2a4b1a1b3c12', compress('aaaabbaaaababbbcccccccccccc'));
	});
  it('should return \'a1b1c1d1e1f1\' when the input is \'abcdef\'', function() {
    assert.equal('a1b1c1d1e1f1', compress('abcdef'));
  });
  it('should return \'a1b1c1d1e2f5g9\' when the input is \'abcdeefffffggggggggg\'', function() {
    assert.equal('a1b1c1d1e2f5g9', compress('abcdeefffffggggggggg'));
  });
  it('should return \'j1\' when the input is \'j\'', function() {
    assert.equal('j1', compress('j'));
  });
  it('should work correctly for large inputs', function() {
    var input = 'z'.repeat(99999999) + 'x' + 'w'.repeat(99999999);
    assert.equal('z99999999x1w99999999', compress(input));
  });
});
