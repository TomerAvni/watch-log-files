var express = require('express');  
var app = express();  
var server = require('http').createServer(app);  
var io = require('socket.io')(server);
Tail = require('tail').Tail;
fileName = './mylogfile.log';


app.use(express.static(__dirname + '/www'));  
app.get('/', function(req, res,next) {  
    res.sendFile(__dirname + '/index.html');
});

app.get('/api/log', function(req, res, next) {
	var url = require('url');
	var url_parts = url.parse(req.url, true);
	var fileName = __dirname + '/' + url_parts.query.file;
    require('./readLines.js').getLines(fileName, null, url_parts.query.top ? url_parts.query.top : 20)
    	.then(function(result) {
    		res.json(result);
    	})
    	.fail(function(err) {

    	})

});

// io.on('connection', function(client) {  
//     console.log('Client connected...');

//     client.on('join', function(data) {
//         console.log(data);
//     });

//     client.on('messages', function(data) {
//     	console.log(data);
//            client.emit('broad', data);
//            client.broadcast.emit('broad',data);
//     });

// });



io.sockets.on('connection', function(client) {
	client.on('watch', function(fileName) {
		if (client.tailObj) {
			console.log("unwatching!");
			console.log(client.tailObj.unwatch);
			client.tailObj.unwatch();
			delete client.tailObj;
		}

		client.tailObj = registerTail(fileName, client);
	});

	return client.emit('broad', {
		channel: 'stdout',
		value: "" //"tail file " + fileName
	});
});

// io.sockets.on('watch', function(socket) {
// 	console.log("socket");
// });




function registerTail(fileName, socket) {
	tail = new Tail(fileName);
	tail.on('line', function(data) {
		console.log("changed! - " + fileName);
		socket.emit('broad', {
			value: data
		});
	});

	return tail;
}


server.listen(4200);
