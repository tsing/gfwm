var fs = require('fs');
var Store = require('../lib/store');
var should = require('should');
var co = require('co');

describe('Store.load', function() {
  it('returns [] when raise error', function() {
    var store = new Store('abc.json');
    var gen = store.load();
    gen.next();
    ret = gen.next(new Error());
    ret.value.should.eql([]);
  });

  it('returns array', function() {
    var store = new Store('abc.json');
    var gen = store.load();
    gen.next();
    ret = gen.next(JSON.stringify(['google.com']));
    ret.value.should.be.eql(['google.com']);
  });
});
