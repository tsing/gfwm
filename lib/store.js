module.exports = Store;

var fs = require('fs');
var thunkify = require('thunkify');

var read = thunkify(fs.readFile);
var write = thunkify(fs.writeFile);
var debug = require('debug')('gfwm');

var util = require('./util');

function Store(filename) {
  this.filename = filename;
}

Store.prototype.load = function *() {
  try {
    var data = yield read(this.filename, 'utf-8');
    return data ? JSON.parse(data) : {};
  } catch (err) {
    return {};
  }
};

Store.prototype.add = function *(domain) {
  domains = yield this.load();
  debug('domains', domains);
  if (domain in domains) {
    return false;
  }

  conflict = this.isConflict(domains, domain);
  if (conflict) {
    return false;
  }

  domains[domain] = 'default';
  yield this.save(domains);
  return true;
};

Store.prototype.save = function *(domains) {
  debug('save', domains);
  yield write(this.filename, JSON.stringify(domains));
};

Store.prototype.delete = function *(domain) {
  domains = yield this.load();
  if (domain in domains) {
    delete domains[domain];
    yield this.save(domains);
    return true;
  } else {
    return false;
  }
};

Store.prototype.index = function *() {
  return yield this.load();
};

Store.prototype.isConflict = function(rules, domain) {
  var domains = Object.keys(rules);
  if (util.getMatchedDomain(domains, domain)) {
    return true;
  }

  for (var ii=0; ii<domains.length; ii++) {
    if (util.getMatchedDomain([domain], domains[ii])) {
      return true;
    }
  }

  return false;
};
