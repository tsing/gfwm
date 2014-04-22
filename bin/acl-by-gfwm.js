#!/usr/bin/env node --harmony-generators

var co = require('co');
var thunkify = require('thunkify');
var request = require('request');
var eventsource = require('../lib/eventsource');

var get = thunkify(request.get);

var debug = require('debug')('gfwm');
var endpoint = process.env.ENDPOINT;
if (!endpoint) {
  process.stderr.write('env ENDPOINT is required');
  process.exit(1);
}

var util = require('../lib/util');

var rules = null;
var fetch = function*() {
  if (rules) return rules;
  var response = yield get(endpoint + '/rules', {json: true});
  debug('fetch', response[0].statusCode, response[0].body);
  if (response[0].statusCode == 200) {
    rules = response[0].body;
  } else {
    rules = {};
  }
  return rules;
};

var watch = function() {
  eventsource(endpoint + '/rules/events', function(data) {
    rules = null;
    fetch();
  });
};

var main = function () {
  process.stdin.setEncoding('utf-8');

  process.stdin.on('end', function() {
    process.exit();
  });

  process.stdin.on('data', function (chunk) {
    co(function *() {
      var rules = yield fetch();
      var domain = chunk.trim();
      var matched_domain = util.getMatchedDomain(Object.keys(rules), domain);
      if (matched_domain) {
        process.stdout.write("OK tag=" + rules[matched_domain] + "\n");
      } else {
        process.stdout.write("ERR\n");
      }
    })();
  });

  watch();
};

main();
