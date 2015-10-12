var express = require('express');  
var app = express();  
var server = require('http').createServer(app);  
var io = require('socket.io')(server);
Tail = require('tail').Tail;
var bodyParser = require('body-parser');
var session = require('express-session');
var sha1 = require('sha1');

app
  .use(bodyParser.urlencoded({
    extended: true
  }))
  .use(bodyParser.json())
  .use(require('cookie-parser')('mr-ripley'))
  .use(session(
  		{
    		secret: "TlT10477A93d54HJY5",
    		saveUninitialized: true, // (default: true)
    		resave: true, // (default: true)
	  	})
  )
  .use(express.static(__dirname + '/www'));

app.get('/', function(req, res,next) {
	if (!isLoggedIn(req)) {
		res.redirect('/login');
	} else {
		res.sendFile(__dirname + '/index.html');
	}

});

app.get('/login', function(req, res,next) {
	res.sendFile(__dirname + '/login.html');
});

app.get('/sign-out', function(req, res, next) {
	delete req.session.user;
 	res.redirect('/login');
})

app.post('/sign-in', function(req, res, next) {
	 if (sha1(req.body.username) !== sha1('1') || sha1(req.body.password) != sha1('1')) {
    	res.sendFile(__dirname + '/login.html');
	 } else {
	 	req.session.user = sha1(new Date().yyyymmdd());
	 	res.redirect('/');
	 }
});

function isLoggedIn(req) {
	return req.session.user && req.session.user == sha1(new Date().yyyymmdd());
}

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

Date.prototype.yyyymmdd = function() {
	var yyyy = this.getFullYear().toString();
	var mm = (this.getMonth()+1).toString(); // getMonth() is zero-based
	var dd  = this.getDate().toString();
	return yyyy + (mm[1]?mm:"0"+mm[0]) + (dd[1]?dd:"0"+dd[0]); // padding
};

server.listen(4200);
