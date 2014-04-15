var koa = require('koa');
var route = require('koa-route');
var Store = require('./lib/store');

var app = koa();
var store = new Store('domains.json');

app.use(route.get('/domains', function *() {
  this.body = yield store.index();
}));

app.use(route.put('/domains/:domain', function *(domain) {
  try {
    var result = yield store.add(domain);
    this.status = result ? 201 : 409;
  } catch (err) {
    this.status = 409;
    this.body = err.message;
  }
}));

app.use(route.del('/domains/:domain', function *(domain) {
  var result = yield store.delete(domain);
  this.status = result ? 204 : 404;
}));


module.exports = exports = app;
