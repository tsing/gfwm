exports.getMatchedDomain = function(domain_patterns, domain) {
  for (var ii=0; ii<domain_patterns.length; ii++) {
    var pattern = domain_patterns[ii];
    var idx = domain.indexOf(pattern);
    if (idx == -1) continue;
    if (domain.substr(idx) == pattern) {
      return pattern;
    }
  }
  return false;
};
