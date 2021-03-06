var Transform = require('stream').Transform;
var inherits = require('util').inherits;

module.exports = SSE;

inherits(SSE, Transform);

function SSE(options) {
  if (!(this instanceof SSE)) return new SSE(options);

  options = options || {};
  Transform.call(this, options);
}

SSE.prototype._transform = function (data, enc, cb) {
  this.push('data: ' + data.toString('ut8') + '\n\n');
  cb();
};
