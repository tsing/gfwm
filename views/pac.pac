var DIRECT = 'DIRECT';
var PROXY = '<%= proxy %>';

var domains = <%= JSON.stringify(domains) %>;

function isLocalIP(host) {
  if (isInNet(host, '192.168.0.0', '255.255.0.0') ||
    isInNet(host, '10.0.0.0', '255.0.0.0') ||
    isInNet(host, '172.16.0.0', '255.240.0.0') ||
    isInNet(host, '127.0.0.0', '255.255.255.0')) {
    return true;
  }
  return false;
}

function FindProxyForURL(url, host) {
  if (isPlainHostName(host)) {
    return DIRECT;
  }

  for (var ii = 0, jj = list.length; ii < jj; ii++) {
    var domain = list[ii];
    if (!domain.length) {
      continue;
    }
    if (host == domain || dnsDomainIs(host, "." + domain)) {
      return PROXY;
    }
  }
  return DIRECT;
}
