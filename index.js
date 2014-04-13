var koa = require('koa');
var route = require('koa-route');
var Store = require('./lib/store');

var app = koa();
var store = new Store('domains.json');

app.use(route.get('/domains', function *() {
  this.body = yield store.index();
}));

app.use(route.put('/domains/:domain', function *(domain) {
  var result = yield store.add(domain);
  this.status = result ? 204 : 409;
}));

app.use(route.del('/domains/:domain', function *(domain) {
  var result = yield store.delete(domain);
  this.status = result ? 204 : 404;
}));

var port = 3000;
app.listen(port);
console.log('Listening at http://localhost:' + port);
