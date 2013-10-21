#!/usr/bin/env node

var fs   = require('fs')
  , http = require('http')
  , pkg  = require('./kanso.json');

var OUTPUT_FILENAME = 'captured.json';

function listen(port) {
  var _server = http.createServer(function(req, res) {
    console.log(req.method + ' ' + req.url);
    handleRequests(req, res, function() {
      _server.close();
    });
  });
  _server.listen(port);
  return _server;
}

function handleRequests(req, res, closeServerCb) {
  if (req.method === 'GET' && req.url.indexOf('/_session') === 0) {
    console.log(' .. handling session request');
    respond(req, res, {userCtx: {name: pkg.name}});
  }
  else if (req.method === 'HEAD') {
    console.log(' .. handling db HEAD request');
    respond(req, res, null);
  }
  else if (req.method === 'PUT') {
    console.log(' .. handling doc PUT request');
    req.pipe( createOutputStream() );
    req.on('end', function() {
      respond(req, res, {id: 'written/to/'+OUTPUT_FILENAME});
      console.log('Finished receiving the payload; shutting down server');
      closeServerCb();
    });
  }
}

function respond(req, res, response) {
  if (typeof response === 'object') {
    var responseStr = JSON.stringify(response);
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(responseStr);
  } else {
    res.statusCode = 204;
    res.end();
  }
}

function createOutputStream() {
  var filename = OUTPUT_FILENAME;
  console.log('Creating payload output stream to file: '+filename);
  return fs.createWriteStream(filename);
}

console.log('Waiting for ze payload...')
listen(5983);

