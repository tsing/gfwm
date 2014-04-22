var koa = require('koa');
var route = require('koa-route');
var Store = require('./lib/store');
var views = require('koa-views');
var parse = require('co-body');
var debug = require('debug')('gfwm');

var app = koa();
var store = new Store(process.env.STORE_FILE || 'rules.json');
var config = require('./config.json');

var sse = require('sse-stream');
var subscription = require('./lib/subscription');

app.use(function *(next) {
  try {
    yield next;
  } catch (err) {
    debug('error', err);
    this.status = err.status;
    this.body = {error: err.message};
  }
});

app.use(views('./views', 'pac', {
  pac: 'underscore'
}));

app.use(route.get('/rules', function *() {
  this.body = yield store.index();
}));

app.use(route.put('/rules/:domain', function *(domain) {
  var body = yield parse(this, {limit: '1kb'});
  if (!body.colo) this.throw(400, '.colo required');
  try {
    yield store.add(domain, body.colo);
    this.status = 201;
    subscription.notify({action: 'add', domain: domain, colo: body.colo});
  } catch (err) {
    this.throw(409, err.message);
  }
}));

app.use(route.del('/rules/:domain', function *(domain) {
  var result = yield store.delete(domain);
  this.status = result ? 204 : 404;
  if (result) {
    subscription.notify({action: 'del', domain: domain});
  }
}));

app.use(route.get('/rules/events', function *() {
  this.req.setTimeout(Infinity);

  this.type = 'text/event-stream; charset=utf-8';
  this.set('Cache-Control', 'no-cache');
  this.set('Connection', 'keep-alive');

  var body = this.body = sse();
  var stream = subscription.subscribe();
  stream.pipe(body);

  var socket = this.socket;
  socket.on('error', close);
  socket.on('close', close);

  function close() {
    stream.unpipe(body);
    stream.removeListener('error', close);
    stream.removeListener('close', close);
  }
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
