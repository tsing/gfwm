var app = require('../app');
var request = require('supertest').agent(app.listen());
var fs = require('fs');
var should = require('should');

beforeEach(function() {
  fs.truncateSync('rules.json');
});

afterEach(function() {
  fs.truncateSync('rules.json');
});

describe('get rules', function() {
  it('should return {} when no records', function(done) {
    request
      .get('/rules/')
      .expect(200)
      .expect('{}', done);
  });

  it('should return rules', function(done) {
    rules = {'facebook.com': 'us', 'google.com': 'us'};
    fs.writeFileSync('rules.json',
      JSON.stringify(rules));
    request
      .get('/rules')
      .expect(200)
      .expect(JSON.stringify(rules), done);
  });
});

describe('put rules', function() {
  it('require .colo', function(done) {
    request
      .put('/rules/google.com')
      .set('Content-Type', 'application/json')
      .send({})
      .expect(400, done);
  });
  it('should save domain', function(done) {
    request
      .put('/rules/google.com')
      .set('Content-Type', 'application/json')
      .send({'colo': 'foo'})
      .expect(201, done);
  });

  it('shoule save multiple rules', function(done) {
    fs.writeFileSync('rules.json', JSON.stringify({'google.com': 'us'}));
    request
      .put('/rules/facebook.com')
      .set('Content-Type', 'application/json')
      .send({'colo': 'foo'})
      .expect(201, done);
  });

  describe('conflict', function() {
    beforeEach(function() {
      fs.writeFileSync('rules.json', JSON.stringify({'google.com': 'us'}));
    });
    it('should return 409 for duplicated domain', function(done) {
      request
        .put('/rules/google.com')
        .set('Content-Type', 'application/json')
        .send({'colo': 'foo'})
        .expect(409, done);
    });

    it('should return 409 for subdomain', function(done) {
      request
        .put('/rules/www.google.com')
        .set('Content-Type', 'application/json')
        .send({'colo': 'foo'})
        .expect(409, done);
    });

    it('should return 409 for parent domain', function(done) {
      request
        .put('/rules/com')
        .set('Content-Type', 'application/json')
        .send({'colo': 'foo'})
        .expect(409, done);
    });
  });
});

describe('delete rules', function() {
  it('should delete domain', function(done) {
    fs.writeFileSync('rules.json', JSON.stringify({'google.com': 'us'}));

    request
      .delete('/rules/google.com')
      .expect(204, done);
  });

  it('should return 404 when domain not recorded', function(done) {
    request
      .delete('/rules/google.com')
      .expect(404, done);
  });
});

describe('get pac', function() {
  it('should return pac file', function(done) {
    var rules = {'google.com': 'us', 'foo.bar': 'us'};
    fs.writeFileSync('rules.json', JSON.stringify(rules));

    var config = require('../config.json');
    request
      .get('/pac/foo.pac')
      .expect(200)
      .expect('content-type', 'application/x-ns-proxy-autoconfig')
      .end(function(err, res) {
        if (err) return done(err);
        res.text.should.containEql(config.proxy);
        res.text.should.containEql(JSON.stringify(rules));
        done();
      });
  });
});
