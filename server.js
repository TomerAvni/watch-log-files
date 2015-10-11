var express = require('express');
var app = express();
var Tail = require('tail').Tail;


app.get('/', function (req, res) {
  res.send('Hello World!');
});

var server = app.listen(3000, function () {
  var host = server.address().address;
  var port = server.address().port;

  console.log('Example app listening at http://%s:%s', host, port);
});

// var Tail, app, connect, fileName, io, socketio, tail,serveStatic;
// Tail = require('tail').Tail;

// var http = require('http');
// var express = require('express'),
//     app = module.exports.app = express();

// var server = http.createServer(app);
// var io = require('socket.io').listen(server);  //pass a http.Server instance
// var port = 9999;
// server.listen(port);

// console.log("Server listening on port " + port);

// fileName = './mylogfile.log';

// tail = new Tail(fileName);

// tail.on('line', function(data) {
//   return io.sockets.emit('new-data', {
//     channel: 'stdout',
//     value: data
//   });
// });

// io.sockets.on('connection', function(socket) {
//   return socket.emit('new-data', {
//     channel: 'stdout',
//     value: "tail file " + fileName
//   });
// });
