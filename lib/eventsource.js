var EventSource = require('eventsource');
var debug = require('debug')('gfwm');

module.exports = subscribe;

function subscribe(url, fn) {
  var source = new EventSource(url);
  source.onmessage = function(e) {
    fn(e.data);
  };
  source.onerror = function(e) {
    if (source.readystate == EventSource.CLOSED) return;
    debug('EventSource', e.message);
  };
  return source.close.bind(source);
}
