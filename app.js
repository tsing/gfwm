var koa = require('koa');
var route = require('koa-route');
var Store = require('./lib/store');
var views = require('koa-views');

var app = koa();
var store = new Store(process.env.STORE_FILE || 'rules.json');
var config = require('./config.json');

app.use(views('./views', 'pac', {
  pac: 'underscore'
}));

app.use(route.get('/rules', function *() {
  this.body = yield store.index();
}));

app.use(route.put('/rules/:domain', function *(domain) {
  try {
    var result = yield store.add(domain);
    this.status = result ? 201 : 409;
  } catch (err) {
    this.status = 409;
    this.body = err.message;
  }
}));

app.use(route.del('/rules/:domain', function *(domain) {
  var result = yield store.delete(domain);
  this.status = result ? 204 : 404;
}));

app.use(route.get('/pac/(:user).pac', function *(user) {
  this.type = 'application/x-ns-proxy-autoconfig';

  var domains = yield store.load();
  yield this.render('pac', {
    domains: domains,
    proxy: config.proxy
  });
}));

module.exports = exports = app;
