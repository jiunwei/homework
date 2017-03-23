// Front-End Engineer Exercise: URI Comparison Unit Tests
// Jiun Wei Chia
// 2017-03-22

var assert = require('assert');

var checkURIs = require('../checkURIs.js')

describe('QueryString()', function() {
  it('should parse \'\' correctly', function() {
    var query = new checkURIs.QueryString('');
    assert.equal(1, query.pairs.length);
    assert.equal('', query.pairs[0][0]);
    assert.equal(1, query.pairs[0][1].length);
    assert.equal(null, query.pairs[0][1][0]);
  });
  it('should parse \'no delimiters\' correctly', function() {
    var query = new checkURIs.QueryString('no delimiters');
    assert.equal(1, query.pairs.length);
    assert.equal('no delimiters', query.pairs[0][0]);
    assert.equal(1, query.pairs[0][1].length);
    assert.equal(null, query.pairs[0][1][0]);
  });
  it('should parse \'one&delimiter\' correctly', function() {
    var query = new checkURIs.QueryString('one&delimiter');
    assert.equal(2, query.pairs.length);
    // Keys are sorted in locale order
    assert.equal('delimiter', query.pairs[0][0]);
    assert.equal(1, query.pairs[0][1].length);
    assert.equal(null, query.pairs[0][1][0]);
    assert.equal('one', query.pairs[1][0]);
    assert.equal(1, query.pairs[1][1].length);
    assert.equal(null, query.pairs[1][1][0]);
  });
  it('should parse \'more&than&one&delimiter\' correctly', function() {
    var query = new checkURIs.QueryString('more&than&one&delimiter');
    assert.equal(4, query.pairs.length);
    // Keys are sorted in locale order
    assert.equal('delimiter', query.pairs[0][0]);
    assert.equal(1, query.pairs[0][1].length);
    assert.equal(null, query.pairs[0][1][0]);
    assert.equal('more', query.pairs[1][0]);
    assert.equal(1, query.pairs[1][1].length);
    assert.equal(null, query.pairs[1][1][0]);
    assert.equal('one', query.pairs[2][0]);
    assert.equal(1, query.pairs[2][1].length);
    assert.equal(null, query.pairs[2][1][0]);
    assert.equal('than', query.pairs[3][0]);
    assert.equal(1, query.pairs[3][1].length);
    assert.equal(null, query.pairs[3][1][0]);
  });
  it('should parse \'a=1&b=2\' correctly', function() {
    var query = new checkURIs.QueryString('a=1&b=2');
    assert.equal(2, query.pairs.length);
    assert.equal('a', query.pairs[0][0]);
    assert.equal(1, query.pairs[0][1].length);
    assert.equal('1', query.pairs[0][1][0]);
    assert.equal('b', query.pairs[1][0]);
    assert.equal(1, query.pairs[1][1].length);
    assert.equal('2', query.pairs[1][1][0]);
  });
  it('should parse \'b=2&a=1\' correctly', function() {
    var query = new checkURIs.QueryString('a=1&b=2');
    assert.equal(2, query.pairs.length);
    assert.equal('a', query.pairs[0][0]);
    assert.equal(1, query.pairs[0][1].length);
    assert.equal('1', query.pairs[0][1][0]);
    assert.equal('b', query.pairs[1][0]);
    assert.equal(1, query.pairs[1][1].length);
    assert.equal('2', query.pairs[1][1][0]);
  });
  it('should parse \'a=1&b=2&a=3\' correctly', function() {
    var query = new checkURIs.QueryString('a=1&b=2&a=3');
    assert.equal(2, query.pairs.length);
    assert.equal('a', query.pairs[0][0]);
    assert.equal(2, query.pairs[0][1].length);
    assert.equal('1', query.pairs[0][1][0]);
    assert.equal('3', query.pairs[0][1][1]);
    assert.equal('b', query.pairs[1][0]);
    assert.equal(1, query.pairs[1][1].length);
    assert.equal('2', query.pairs[1][1][0]);
  });
  it('should parse \'a=3&a=1&b=2\' correctly', function() {
    var query = new checkURIs.QueryString('a=3&a=1&b=2');
    assert.equal(2, query.pairs.length);
    assert.equal('a', query.pairs[0][0]);
    assert.equal(2, query.pairs[0][1].length);
    assert.equal('3', query.pairs[0][1][0]);
    assert.equal('1', query.pairs[0][1][1]);
    assert.equal('b', query.pairs[1][0]);
    assert.equal(1, query.pairs[1][1].length);
    assert.equal('2', query.pairs[1][1][0]);
  });
  it('should parse \'=\' correctly', function() {
    var query = new checkURIs.QueryString('=');
    assert.equal(1, query.pairs.length);
    assert.equal('', query.pairs[0][0]);
    assert.equal(1, query.pairs[0][1].length);
    assert.equal('', query.pairs[0][1][0]);
  });
  it('should parse \'&&\' correctly', function() {
    var query = new checkURIs.QueryString('&&');
    assert.equal(1, query.pairs.length);
    assert.equal('', query.pairs[0][0]);
    assert.equal(3, query.pairs[0][1].length);
    assert.equal(null, query.pairs[0][1][0]);
    assert.equal(null, query.pairs[0][1][1]);
    assert.equal(null, query.pairs[0][1][2]);
  });

  describe('#equals()', function() {
    it('should return that \'one&delimiter\' and \'more&than&one&delimiter\' do not match', function() {
      assert.equal(false, new checkURIs.QueryString('one&delimiter').equals(new checkURIs.QueryString('more&than&one&delimiter')));
    });
    it('should return that \'one&delimiter\' and \'delimiter&one\' match', function() {
      assert.equal(true, new checkURIs.QueryString('one&delimiter').equals(new checkURIs.QueryString('delimiter&one')));
    });
    it('should return that \'a=1&b=2\' and \'b=2&a=1\' match', function() {
      assert.equal(true, new checkURIs.QueryString('a=1&b=2').equals(new checkURIs.QueryString('b=2&a=1')));
    });
    it('should return that \'a=1&b=2&a=3\' and \'a=3&a=1&b=2\' do not match', function() {
      assert.equal(false, new checkURIs.QueryString('a=1&b=2&a=3').equals(new checkURIs.QueryString('a=3&a=1&b=2')));
    });
  });

});

describe('URI()', function() {
  it('should parse \'http://abc.com:80/~smith/home.html\' correctly', function() {
    var uri = new checkURIs.URI('http://abc.com:80/~smith/home.html');
    assert.equal(80, uri.port);
    assert.equal('http', uri.scheme);
    assert.equal(null, uri.user);
    assert.equal(null, uri.password);
    assert.equal('abc.com', uri.host);
    assert.equal('/~smith/home.html', uri.path);
    assert.equal(null, uri.hash);
    assert.equal(null, uri.query);
  });
  it('should parse \'http://ABC.com/%7Esmith/home.html\' correctly', function() {
    var uri = new checkURIs.URI('http://ABC.com/%7Esmith/home.html');
    assert.equal(80, uri.port);
    assert.equal('http', uri.scheme);
    assert.equal(null, uri.user);
    assert.equal(null, uri.password);
    assert.equal('abc.com', uri.host);
    assert.equal('/~smith/home.html', uri.path);
    assert.equal(null, uri.hash);
    assert.equal(null, uri.query);
  });
  it('should parse \'http://abc.com/drill/down/foo.html\' correctly', function() {
    var uri = new checkURIs.URI('http://abc.com/drill/down/foo.html');
    assert.equal(80, uri.port);
    assert.equal('http', uri.scheme);
    assert.equal(null, uri.user);
    assert.equal(null, uri.password);
    assert.equal('abc.com', uri.host);
    assert.equal('/drill/down/foo.html', uri.path);
    assert.equal(null, uri.hash);
    assert.equal(null, uri.query);
  });
  it('should parse \'http://abc.com/drill/further/../down/./foo.html\' correctly', function() {
    var uri = new checkURIs.URI('http://abc.com/drill/further/../down/./foo.html');
    assert.equal(80, uri.port);
    assert.equal('http', uri.scheme);
    assert.equal(null, uri.user);
    assert.equal(null, uri.password);
    assert.equal('abc.com', uri.host);
    assert.equal('/drill/down/foo.html', uri.path);
    assert.equal(null, uri.hash);
    assert.equal(null, uri.query);
  });
  it('should parse \'http://abc.com/foo.html?a=1&b=2\' correctly', function() {
    var uri = new checkURIs.URI('http://abc.com/foo.html?a=1&b=2');
    assert.equal(80, uri.port);
    assert.equal('http', uri.scheme);
    assert.equal(null, uri.user);
    assert.equal(null, uri.password);
    assert.equal('abc.com', uri.host);
    assert.equal('/foo.html', uri.path);
    assert.equal(null, uri.hash);
    assert.equal('a=1&b=2', uri.query);
  });
  it('should parse \'http://abc.com/foo.html?b=2&a=1\' correctly', function() {
    var uri = new checkURIs.URI('http://abc.com/foo.html?b=2&a=1');
    assert.equal(80, uri.port);
    assert.equal('http', uri.scheme);
    assert.equal(null, uri.user);
    assert.equal(null, uri.password);
    assert.equal('abc.com', uri.host);
    assert.equal('/foo.html', uri.path);
    assert.equal(null, uri.hash);
    assert.equal('b=2&a=1', uri.query);
  });
  it('should parse \'http://abc.com/foo.html?a=1&b=2&a=3\' correctly', function() {
    var uri = new checkURIs.URI('http://abc.com/foo.html?a=1&b=2&a=3');
    assert.equal(80, uri.port);
    assert.equal('http', uri.scheme);
    assert.equal(null, uri.user);
    assert.equal(null, uri.password);
    assert.equal('abc.com', uri.host);
    assert.equal('/foo.html', uri.path);
    assert.equal(null, uri.hash);
    assert.equal('a=1&b=2&a=3', uri.query);
  });
  it('should parse \'http://abc.com/foo.html?a=3&a=1&b=2\' correctly', function() {
    var uri = new checkURIs.URI('http://abc.com/foo.html?a=3&a=1&b=2');
    assert.equal(80, uri.port);
    assert.equal('http', uri.scheme);
    assert.equal(null, uri.user);
    assert.equal(null, uri.password);
    assert.equal('abc.com', uri.host);
    assert.equal('/foo.html', uri.path);
    assert.equal(null, uri.hash);
    assert.equal('a=3&a=1&b=2', uri.query);
  });
  it('should parse \'xyz://a:1234/./working%20copy/../\' correctly', function() {
    var uri = new checkURIs.URI('xyz://a:1234/');
    assert.equal(1234, uri.port);
    assert.equal('xyz', uri.scheme);
    assert.equal(null, uri.user);
    assert.equal(null, uri.password);
    assert.equal('a', uri.host);
    assert.equal('/', uri.path);
    assert.equal(null, uri.hash);
    assert.equal(null, uri.query);
  });
  it('should parse \'xyz://u:p@a:1234/\' correctly', function() {
    var uri = new checkURIs.URI('xyz://u:p@a:1234/');
    assert.equal(1234, uri.port);
    assert.equal('xyz', uri.scheme);
    assert.equal('u', uri.user);
    assert.equal('p', uri.password);
    assert.equal('a', uri.host);
    assert.equal('/', uri.path);
    assert.equal(null, uri.hash);
    assert.equal(null, uri.query);
  });
  it('should parse \'a://a/\' correctly', function() {
    var uri = new checkURIs.URI('a://a/');
    assert.equal(80, uri.port);
    assert.equal('a', uri.scheme);
    assert.equal(null, uri.user);
    assert.equal(null, uri.password);
    assert.equal('a', uri.host);
    assert.equal('/', uri.path);
    assert.equal(null, uri.hash);
    assert.equal(null, uri.query);
  });
  it('should parse \'a://a/?a\' correctly', function() {
    var uri = new checkURIs.URI('a://a/?a');
    assert.equal(80, uri.port);
    assert.equal('a', uri.scheme);
    assert.equal(null, uri.user);
    assert.equal(null, uri.password);
    assert.equal('a', uri.host);
    assert.equal('/', uri.path);
    assert.equal(null, uri.hash);
    assert.equal('a', uri.query);
  });
  it('should parse \'a://a/#a\' correctly', function() {
    var uri = new checkURIs.URI('a://a/#a');
    assert.equal(80, uri.port);
    assert.equal('a', uri.scheme);
    assert.equal(null, uri.user);
    assert.equal(null, uri.password);
    assert.equal('a', uri.host);
    assert.equal('/', uri.path);
    assert.equal('a', uri.hash);
    assert.equal(null, uri.query);
  });
  it('should parse \'a://a/?q#h\' correctly', function() {
    var uri = new checkURIs.URI('a://a/?q#h');
    assert.equal(80, uri.port);
    assert.equal('a', uri.scheme);
    assert.equal(null, uri.user);
    assert.equal(null, uri.password);
    assert.equal('a', uri.host);
    assert.equal('/', uri.path);
    assert.equal('h', uri.hash);
    assert.equal('q', uri.query);
  });
  it('should parse \'a://a/#h?q\' correctly', function() {
    var uri = new checkURIs.URI('a://a/#h?q');
    assert.equal(80, uri.port);
    assert.equal('a', uri.scheme);
    assert.equal(null, uri.user);
    assert.equal(null, uri.password);
    assert.equal('a', uri.host);
    assert.equal('/', uri.path);
    assert.equal('h?q', uri.hash);
    assert.equal(null, uri.query);
  });
  it('should throw an exception when parsing \'xyz://%aa%BB%cc/\'', function() {
    assert.throws(function() { new checkURIs.URI('xyz://%aa%BB%cc/'); }, URIError);
  });
  it('should throw an exception when parsing \'xyz://abc\'', function() {
    assert.throws(function() { new checkURIs.URI('xyz://abc'); }, /URI parse error/);
  });
  it('should throw an exception when parsing \'xyz://a:abc/\'', function() {
    assert.throws(function() { new checkURIs.URI('xyz://a:abc/'); }, /URI parse error/);
  });
});

describe('checkURIs()', function() {
	it('should return that \'http://abc.com:80/~smith/home.html\' and \'http://ABC.com/%7Esmith/home.html\' match', function() {
	  assert.equal(true, checkURIs.checkURIs('http://abc.com:80/~smith/home.html', 'http://ABC.com/%7Esmith/home.html'));
	});
  it('should return that \'http://abc.com/drill/down/foo.html\' and \'http://abc.com/drill/further/../down/./foo.html\' match', function() {
    assert.equal(true, checkURIs.checkURIs('http://abc.com/drill/down/foo.html', 'http://abc.com/drill/further/../down/./foo.html'));
  });
  it('should return that \'http://abc.com/foo.html?a=1&b=2\' and \'http://abc.com/foo.html?b=2&a=1\' match', function() {
    assert.equal(true, checkURIs.checkURIs('http://abc.com/foo.html?a=1&b=2', 'http://abc.com/foo.html?b=2&a=1'));
  });
  it('should return that \'http://abc.com/foo.html?a=1&b=2&a=3\' and \'http://abc.com/foo.html?a=3&a=1&b=2\' do not match', function() {
    assert.equal(false, checkURIs.checkURIs('http://abc.com/foo.html?a=1&b=2&a=3', 'http://abc.com/foo.html?a=3&a=1&b=2'));
  });
  it('should return that \'a://a/\' and \'a://a/?\' match', function() {
    assert.equal(true, checkURIs.checkURIs('a://a/', 'a://a/?'));
  });
  it('should return that \'a://a/\' and \'a://a/#\' match', function() {
    assert.equal(true, checkURIs.checkURIs('a://a/', 'a://a/#'));
  });
  it('should return that \'a://a/\' and \'a://a/?a\' do not match', function() {
    assert.equal(false, checkURIs.checkURIs('a://a/', 'a://a/?a'));
  });
  it('should return that \'a://a/\' and \'a://a/#a\' do not match', function() {
    assert.equal(false, checkURIs.checkURIs('a://a/', 'a://a/#a'));
  });
  it('should return that \'xyz://u:p@a:1234/\' and \'XYZ://u:p@A:1234/%23/../\' match', function() {
    assert.equal(true, checkURIs.checkURIs('xyz://u:p@a:1234/', 'XYZ://u:p@A:1234/%23/../'));
  });
  it('should throw an exception when checking \'xyz://a:1234\' and \'xyz://a:abc/\'', function() {
    assert.throws(function() { checkURIs.checkURIs('xyz://a:1234', 'xyz://a:abc/'); }, /URI parse error/);
  });
});
