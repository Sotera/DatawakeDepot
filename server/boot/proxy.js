'use strict';
var http = require('http');
// to enable these logs set `DEBUG=boot:proxy` or `DEBUG=boot:*`
var log = require('debug')('boot:proxy');
module.exports = function (app) {
  var appSettings = require('../appSettings');
  appSettings.getSetting('PROXY_PORT')
    .then(function (proxyPortModel) {
      var proxyPort = proxyPortModel.value;
      log('Starting proxy server @ ' + proxyPort);
      http.createServer(serverCallback).listen(proxyPort);
    })
    .catch(function (err) {
      log(err);
    });
};
function serverCallback(req, res) {
  if (!security_filter(req, res)) {
    return;
  }
  req = prevent_loop(req, res);
  if (!req) {
    return;
  }
  var ip = req.connection.remoteAddress;
  log(ip + ": " + req.method + " " + req.headers.host + "=>" + req.url);
  //get authorization token
  var authorization = authenticate(req);
  //calc new host info
  var action = handle_proxy_route(req.headers.host, authorization);
  var host = encode_host(action);
  //handle action
  if (action.action == "redirect") {
    action_redirect(res, host);
  } else if (action.action == "proxyto") {
    action_proxy(res, req, host);
  } else if (action.action == "authenticate") {
    action_authenticate(res, action.msg);
  }
}
function security_filter(req, res) {
  //HTTP 1.1 protocol violation: no host, no method, no url
  if (req.headers.host === undefined ||
    req.method === undefined ||
    req.url === undefined) {
    security_log(req, res, "Either host, method or url is poorly defined");
    return false;
  }
  return true;
}
function security_log(req, res, errMsg) {
  var ip = req.connection.remoteAddress;
  msg = "**SECURITY VIOLATION**, " + ip + "," + (req.method || "!NO METHOD!");
  msg += " " + (req.headers.host || "!NO HOST!");
  msg += "=>" + (req.url || "!NO URL!") + "," + errMsg;
  log(msg);
}
function prevent_loop(req, res) {
  if (req.headers.proxy == "node.datawake") {//if request is already tatooed => loop
    log("Loop detected");
    res.writeHead(500);
    res.write("Proxy loop!");
    res.end();
    return null;
  } else {//append a tattoo to it
    req.headers.proxy = "node.datawake";
    return req;
  }
}
function authenticate(req) {
  var token = {
    "login": "anonymous",
    "pass": ""
  };
  if (req.headers.authorization && req.headers.authorization.search('Basic ') === 0) {
    // fetch login and password
    var basic = (new Buffer(req.headers.authorization.split(' ')[1], 'base64').toString());
    log("Authentication token received: " + basic);
    basic = basic.split(':');
    token.login = basic[0];
    token.pass = "";
    for (i = 1; i < basic.length; i++) {
      token.pass += basic[i];
    }
  }
  return token;
}
function handle_proxy_route(host, token) {
  //extract target host and port
  var action = decode_host(host);
  action.action = "proxyto";//default action
  return action;
}
function decode_host(host) {
  var retVal = {};
  host = host.split(':');
  retVal.host = host[0];
  retVal.port = host[1] || 80;
  return retVal;
}
function encode_host(host) {
  return host.host + ((host.port == 80) ? "" : ":" + host.port);
}
