var koa = require('koa');

var app = koa();
var port = 3000;

app.listen(port);
console.log('Listening at http://localhost:' + port);
