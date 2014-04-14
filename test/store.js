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

describe('Store.isContained', function() {
  var store = new Store('abc.json');

  it('conflict when subdomain is in domains', function() {
    var conflicted = store.isConflict(['www.google.com'], 'google.com');
    conflicted.should.be.eql(['www.google.com', 'google.com']);
  });

  it('should return [] when nothing conflict', function() {
    var conflicted = store.isConflict(['www.google.com'], 'www.google.cn');
    conflicted.should.be.eql([]);
  });

  it('conflict when subdomain is provided', function() {
    var conflicted = store.isConflict(['google.com'], 'www.google.com');
    conflicted.should.be.eql(['google.com', 'www.google.com']);
  });
});
