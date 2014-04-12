module.exports = Domain;

var fs = require('fs');
var thunkify = require('thunkify');

var read = thunkify(fs.readFile);
var write = thunkify(fs.writeFile);

function Domain(filename) {
  this.filename = filename;
}

Domain.prototype.load = function *() {
  try {
    var data = yield read(this.filename, 'utf-8');
    return data ? JSON.parse(data) : [];
  } catch (err) {
    return [];
  }
};

Domain.prototype.add = function *(domain) {
  domains = yield this.load();
  if (domains.indexOf(domain) == -1) {
    domains.push(domain);
    yield this.save(domains);
    return true;
  } else {
    return false;
  }
};

Domain.prototype.save = function *(domains) {
  yield write(this.filename, JSON.stringify(domains));
};

Domain.prototype.delete = function *(domain) {
  domains = yield this.load();
  if (domains.indexOf(domain) != -1) {
    domains.splice(domains.indexOf(domain), 1);
    yield this.save(domains);
    return true;
  } else {
    return false;
  }
};

Domain.prototype.index = function *() {
  return yield this.load();
};
