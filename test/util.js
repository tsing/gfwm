var util = require('../lib/util');
var should = require('should');

describe('getMatchedDomain', function() {
  it('match same domain', function() {
    domains = ['google.com'];
    matched = util.getMatchedDomain(domains, 'google.com');
    matched.should.be.eql('google.com');
  });

  it('match subdomain', function() {
    domains = ['google.com'];
    matched = util.getMatchedDomain(domains, 'www.google.com');
    matched.should.be.eql('google.com');
  });

  it("don't match middle domain", function() {
    domains = ['google'];
    matched = util.getMatchedDomain(domains, 'www.google.com');
    matched.should.be.false;
  });
});
