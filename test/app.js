var app = require('../app');
var request = require('supertest').agent(app.listen());
var fs = require('fs');


beforeEach(function() {
  fs.truncateSync('domains.json');
});

describe('get domains', function() {
  it('should return [] when no records', function(done) {
    request
      .get('/domains/')
      .expect(200)
      .expect('[]', done);
  });

  it('should return domains', function(done) {
    domains = ['facebook.com', 'google.com'];
    fs.writeFileSync('domains.json',
      JSON.stringify(domains));
    request
      .get('/domains')
      .expect(200)
      .expect(JSON.stringify(domains), done);
  });
});

describe('put domains', function() {
  it('should save domain', function(done) {
    request
      .put('/domains/google.com')
      .expect(201, done);
  });

  it('shoule save multiple domains', function(done) {
    fs.writeFileSync('domains.json', JSON.stringify(['google.com']));
    request
      .put('/domains/facebook.com')
      .expect(201, done);
  });

  describe('conflict', function() {
    beforeEach(function() {
      fs.writeFileSync('domains.json', JSON.stringify(['google.com']));
    });
    it('should return 409 for duplicated domain', function(done) {
      request
        .put('/domains/google.com')
        .expect(409, done);
    });

    it('should return 409 for subdomain', function(done) {
      request
        .put('/domains/www.google.com')
        .expect(409, done);
    });

    it('should return 409 for parent domain', function(done) {
      request
        .put('/domains/com')
        .expect(409, done);
    });
  });
});

describe('delete domains', function() {
  it('should delete domain', function(done) {
    fs.writeFileSync('domains.json', JSON.stringify(['google.com']));

    request
      .delete('/domains/google.com')
      .expect(204, done);
  });

  it('should return 404 when domain not recorded', function(done) {
    request
      .delete('/domains/google.com')
      .expect(404, done);
  });
});
