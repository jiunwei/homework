// Front-End Engineer Exercise: URI Comparison
// Jiun Wei Chia
// 2017-03-22

/** Custom regular expression to parse URIs (does NOT conform to RFC 2396) */
var URI_PATTERN = /([A-Za-z][\w\+\.-]*):\/\/(?:([^:]*):([^@]*)@)?(\w[\w\.-]*)(?::(\d*))?(\/[^\?#]*)(?:\?([^#]*))?(?:#(.*))?/
//                 (scheme------------)        (user-) (password)(host------)    (port) (path-----)     (query)      (hash)

/** Represents a parsed query string. */
function QueryString(query) {
  // If there is no query string, set this.pairs to null and return.
  if (query === null) {
    this.pairs = null;
    return;
  }

  // Otherwise, parse query string to initialize this.pairs.
  var pairs = query.split(/&/).map(function(pair) {
    return pair.split(/=/, 2);
  }).sort(function(pair1, pair2) {
    return pair1[0].localeCompare(pair2[0])
  });
  this.pairs = [];
  var values = [];
  var previous = null;
  for (var i = 0; i < pairs.length; ++i) {
    var current = pairs[i][0];
    if (current !== previous) {
      if (previous !== null) {
        this.pairs.push([previous, values]);
        values = [];
      }
      previous = current;
    }
    values.push(pairs[i].length > 1 ? pairs[i][1] : null);
  }
  this.pairs.push([previous, values]);
}

/** Returns whether the two query strings match based on the question requirements. */
QueryString.prototype.equals = function(other) {
  if (other === null) return false;

  // Recursive function to perform deep comparison of two Arrays.
  function equalArrays(arr1, arr2) {
    if (arr1 === null || arr2 === null) return arr1 === arr2;
    if (arr1.length !== arr2.length) return false;
    for (var i = 0; i < arr1.length; ++i) {
      if (typeof (arr1[i]) === 'object') {
        if (!equalArrays(arr1[i], arr2[i])) return false;
      } else if (arr1[i] !== arr2[i]) {
        return false;
      }
    }
    return true;
  }

  return equalArrays(this.pairs, other.pairs);
}

/** Represents a parsed URI. */
function URI(uri) {
  var captures = URI_PATTERN.exec(decodeURI(uri));
  if (!captures) throw "URI parse error";
  this.scheme = captures[1].toLowerCase();
  this.user = captures[2] ? decodeURIComponent(captures[2]) : null;
  this.password = captures[3] ? decodeURIComponent(captures[3]) : null;
  this.host = decodeURIComponent(captures[4]).toLowerCase();              // Assumed to be mandatory (unlike RFC)
  this.port = captures[5] ? parseInt(captures[5]) : 80;
  this.path = decodeURIComponent(captures[6]);
  this.query = captures[7] ? decodeURIComponent(captures[7]) : null;
  this.hash = captures[8] ? decodeURIComponent(captures[8]) : null;

  // Normalise path by resolving traversal tokens
  this.path = this.path.replace(/\/\//, '/').replace(/\/\.\//, '/').replace(/\/[^\/]+\/\.\.\//, '/');
}

/** Returns whether this URI is equivalent the given other URI. */
URI.prototype.equals = function(other) {
  if (other === null) return false;
  return (this.scheme === other.scheme) &&
    (this.user === other.user) &&
    (this.password === other.password) &&
    (this.host === other.host) &&
    (this.port === other.port) &&
    (this.path === other.path) &&
    (this.hash === other.hash) &&
    new QueryString(this.query).equals(new QueryString(other.query));
}

/** Returns whether two URIs are equivalent. */
function checkURIs(uri1, uri2) {
  // Pre-condition: uri1 and uri2 are valid URIs that do not encode any reserved characters
  return new URI(uri1).equals(new URI(uri2));
}

// Non-core JavaScript below is for testing purposes only.
if (module) {
  module.exports = {
    QueryString: QueryString,
    URI: URI,
    checkURIs: checkURIs
  };
}
