'use strict';
return;
//********************--> Factor this memstream code out (BEGIN)
var stream = require('stream');
var util = require('util');
var fs = require('fs');
// use Node.js Writable, otherwise load polyfill
var Writable = stream.Writable || require('readable-stream').Writable;
var memStore = {};
/* Writable memory stream */
function WritableMemoryStream(key, options) {
  // allow use without new operator
  if (!(this instanceof WritableMemoryStream)) {
    return new WritableMemoryStream(key, options);
  }
  Writable.call(this, options); // init super
  this.key = key; // save key
  memStore[key] = new Buffer(''); // empty
}
util.inherits(WritableMemoryStream, Writable);
WritableMemoryStream.prototype._write = function (chunk, enc, cb) {
  // our memory store stores things in buffers
  var buffer = (Buffer.isBuffer(chunk)) ?
    chunk :  // already is Buffer use it
    new Buffer(chunk, enc);  // string, convert
  // concat to the buffer already there
  memStore[this.key] = Buffer.concat([memStore[this.key], buffer]);
  cb();
};
/*var memStreamProxySocket = new WritableMemoryStream('memStreamProxySocket');
 var memStreamSocketRequest = new WritableMemoryStream('memStreamSocketRequest');*/
var memStreamProxySocket = fs.createWriteStream('/tmp/proxySocket.bin');
var memStreamSocketRequest = fs.createWriteStream('/tmp/socketRequest.bin');
/*var memoryStream = new WritableMemoryStream('foo');
 memoryStream.on('finish',function(){
 var md = memStore;
 });
 memoryStream.write('hello');
 memoryStream.write('world');
 memoryStream.end();*/
//********************--> Factor this memstream code out (END)
//JReeme: Lifted from http://www.catonmat.net/http-proxy-in-nodejs/
var http = require('http');
var net = require('net');
var appSettings = require('../appSettings');
var debugging = 0;
var regex_hostport = /^([^:]+)(:([0-9]+))?$/;
// to enable these logs set `DEBUG=boot:proxy` or `DEBUG=boot:*`
var log = require('debug')('boot:proxy');
//Disable proxy server
module.exports = function (app) {
};
//Enable proxy server
var module_exports = function (app) {
  appSettings.getSetting('PROXY_PORT')
    .then(function (proxyPortModel) {
      var proxyPort = proxyPortModel.value;
      log('Starting proxy server @ ' + proxyPort);
      var server = http.createServer(httpUserRequest).listen(proxyPort);
      // add handler for HTTPS (which issues a CONNECT to the proxy)
      server.addListener(
        'connect',
        function (request, socketRequest, bodyhead) {
          var url = request['url'];
          var httpVersion = request['httpVersion'];
          var hostport = getHostPortFromString(url, 443);
          if (debugging) {
            log('  = will connect to %s:%s', hostport[0], hostport[1]);
          }
          // set up TCP connection
          var proxySocket = new net.Socket();
          proxySocket.connect(
            parseInt(hostport[1]), hostport[0],
            function () {
              if (debugging) {
                log('  < connected to %s/%s', hostport[0], hostport[1]);
                log('  > writing head of length %d', bodyhead.length);
              }
              proxySocket.write(bodyhead);
              // tell the caller the connection was successfully established
              socketRequest.write("HTTP/" + httpVersion + " 200 Connection established\r\n\r\n");
            }
          );
          proxySocket.on(
            'data',
            function (chunk) {
              if (debugging) {
                log('  < data length = %d', chunk.length);
              }
              memStreamSocketRequest.write(chunk);
              socketRequest.write(chunk);
            }
          );
          proxySocket.on(
            'end',
            function () {
              if (debugging) {
                log('  < end');
              }
              socketRequest.end();
            }
          );
          socketRequest.on(
            'data',
            function (chunk) {
              if (debugging) {
                log('  > data length = %d', chunk.length);
              }
              memStreamProxySocket.write(chunk);
              proxySocket.write(chunk);
            }
          );
          socketRequest.on(
            'end',
            function () {
              if (debugging) {
                log('  > end');
              }
              proxySocket.end();
            }
          );
          proxySocket.on(
            'error',
            function (err) {
              socketRequest.write("HTTP/" + httpVersion + " 500 Connection error\r\n\r\n");
              if (debugging) {
                log('  < ERR: %s', err);
              }
              socketRequest.end();
            }
          );
          socketRequest.on(
            'error',
            function (err) {
              if (debugging) {
                log('  > ERR: %s', err);
              }
              proxySocket.end();
            }
          );
        }
      ); // HTTPS connect listener
    })
    .catch(function (err) {
      log(err);
    });
};
function getHostPortFromString(hostString, defaultPort) {
  var host = hostString;
  var port = defaultPort;
  var result = regex_hostport.exec(hostString);
  if (result != null) {
    host = result[1];
    if (result[2] != null) {
      port = result[3];
    }
  }
  return ( [host, port] );
}
// handle a HTTP proxy request
function httpUserRequest(userRequest, userResponse) {
  //log('  > httpUserRequest--> request: %s', userRequest.url);
  if (debugging) {
    log('  > request: %s', userRequest.url);
  }
  var httpVersion = userRequest['httpVersion'];
  var hostport = getHostPortFromString(userRequest.headers['host'], 80);
  // have to extract the path from the requested URL
  var path = userRequest.url;
  var result = /^[a-zA-Z]+:\/\/[^\/]+(\/.*)?$/.exec(userRequest.url);
  if (result) {
    if (result[1].length > 0) {
      path = result[1];
    } else {
      path = "/";
    }
  }
  var options = {
    'host': hostport[0],
    'port': hostport[1],
    'method': userRequest.method,
    'path': path,
    'agent': userRequest.agent,
    'auth': userRequest.auth,
    'headers': userRequest.headers
  };
  if (debugging) {
    log('  > options: %s', JSON.stringify(options, null, 2));
  }
  var proxyRequest = http.request(
    options,
    function (proxyResponse) {
      if (debugging) {
        log('  > request headers: %s', JSON.stringify(options['headers'], null, 2));
      }
      if (debugging) {
        log('  < response %d headers: %s', proxyResponse.statusCode, JSON.stringify(proxyResponse.headers, null, 2));
      }
      userResponse.writeHead(
        proxyResponse.statusCode,
        proxyResponse.headers
      );
      proxyResponse.on(
        'data',
        function (chunk) {
          if (debugging) {
            log('  < chunk = %d bytes', chunk.length);
          }
          userResponse.write(chunk);
        }
      );
      proxyResponse.on(
        'end',
        function () {
          if (debugging) {
            log('  < END');
          }
          userResponse.end();
        }
      );
    }
  );
  proxyRequest.on(
    'error',
    function (error) {
      userResponse.writeHead(500);
      userResponse.write(
        "<h1>500 Error</h1>\r\n" +
        "<p>Error was <pre>" + error + "</pre></p>\r\n" +
        "</body></html>\r\n"
      );
      userResponse.end();
    }
  );
  userRequest.addListener(
    'data',
    function (chunk) {
      if (debugging) {
        log('  > chunk = %d bytes', chunk.length);
      }
      proxyRequest.write(chunk);
    }
  );
  userRequest.addListener(
    'end',
    function () {
      proxyRequest.end();
    }
  );
}
