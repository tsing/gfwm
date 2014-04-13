module.exports = Store;

var fs = require('fs');
var thunkify = require('thunkify');

var read = thunkify(fs.readFile);
var write = thunkify(fs.writeFile);

function Store(filename) {
  this.filename = filename;
}

Store.prototype.load = function *() {
  try {
    var data = yield read(this.filename, 'utf-8');
    return data ? JSON.parse(data) : [];
  } catch (err) {
    return [];
  }
};

Store.prototype.add = function *(domain) {
  domains = yield this.load();
  if (domains.indexOf(domain) == -1) {
    domains.push(domain);
    yield this.save(domains);
    return true;
  } else {
    return false;
  }
};

Store.prototype.save = function *(domains) {
  yield write(this.filename, JSON.stringify(domains));
};

Store.prototype.delete = function *(domain) {
  domains = yield this.load();
  if (domains.indexOf(domain) != -1) {
    domains.splice(domains.indexOf(domain), 1);
    yield this.save(domains);
    return true;
  } else {
    return false;
  }
};

Store.prototype.index = function *() {
  return yield this.load();
};
