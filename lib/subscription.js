var Readable = require('stream').Readable;
var inherits = require('util').inherits;

inherits(Subscription, Readable);

function Subscription(options) {
  if (!(this instanceof Subscription)) return new Subscription(options);

  options = options || {};
  Readable.call(this, options);

  this.value = 0;
}

Subscription.prototype._read = function() {
};

var subscription = Subscription({objectMode: true});
exports.subscribe = function () {
    return subscription;
};

exports.notify = function(data) {
  subscription.push(data);
};

