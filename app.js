var express = require('express');  
var fs = require('fs');
var app = express();  
var server = require('http').createServer(app);  
var io = require('socket.io')(server);
var bodyParser = require('body-parser');
var session = require('express-session');
var sha1 = require('sha1');
var exphbs  = require('express-handlebars');
var url = require('url');

Tail = require('tail').Tail;

var configuration = {};
var configFile = __dirname + '/conf.json';

app.engine('handlebars', exphbs({defaultLayout: 'main'}));
app.set('view engine', 'handlebars');
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
  .use(express.static(__dirname + '/static'));

app.get('/', function(req, res,next) {
	if (!isLoggedIn(req)) {
		res.redirect('/login');
	} else {
		res.render('home', {logFiles: configuration.logFiles});
	}
});

app.get('/login', function(req, res,next) {
	var url_parts = url.parse(req.url, true);
	res.render('login', {logFiles: configuration.logFiles, layout: false, wrongPassword: url_parts.query.hasOwnProperty('wrong-password')});
	initConfFile(true);
});

app.get('/sign-out', function(req, res, next) {
	delete req.session.user;
 	res.redirect('/login');
})

app.post('/sign-in', function(req, res, next) {
	if (isValidCredentials(req.body.username, req.body.password)) {
	 	req.session.user = sha1(new Date().yyyymmdd());
		res.redirect('/');
	 } else {
		res.redirect('/login?wrong-password');
	 }
});

app.get('/api/log', function(req, res, next) {
	if (!isLoggedIn(req)) {
		res.status(401).send("Unauthorized");
		return;
	}

	var url_parts = url.parse(req.url, true);
	var fileName = '/' + convertFilenameToPath(url_parts.query.file);
    require('./readLines.js').getLines(fileName, null, url_parts.query.top ? url_parts.query.top : 20)
    	.then(function(result) {
    		res.json(result);
    	})
    	.fail(function(err) {
			res.status(500).send("Error getting logs. --- " + err.message);
    	})

});


function isValidCredentials(username, password) {
	return configuration.users.hasOwnProperty(username) && configuration.users[username] === sha1(password);
}

function isLoggedIn(req) {
	return req.session.user && req.session.user == sha1(new Date().yyyymmdd());
}

function initConfFile(async) {
	if (!async) {
		configuration = JSON.parse(fs.readFileSync(configFile));
		setUsersTable();
	} else {
	 	fs.readFile(configFile, 'utf8', function (err, data) {
	    	if (err) throw err; // we'll not consider error handling for now
	    	configuration = JSON.parse(data);
	    	setUsersTable();
		});	
	}
}

function setUsersTable() {
	var usersAsKeyValue = {};
	configuration.users.forEach(function(user) {
		usersAsKeyValue[user.username] = user.password;
	});

	configuration.users = usersAsKeyValue;
}

function convertFilenameToPath(filename) {
	var fileObj = configuration.logFiles.filter(function(file) {
		return filename == file.path;
	})[0];

	return fileObj.relative ? (__dirname + '/' + fileObj.fullpath) : fileObj.fullpath;
}

function registerTail(fileName, socket) {
	tail = new Tail(fileName);
	tail.on('line', function(data) {
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

io.sockets.on('connection', function(client) {
	client.on('watch', function(fileName) {
		if (client.tailObj) {
			client.tailObj.unwatch();
			delete client.tailObj;
		}

		client.tailObj = registerTail(convertFilenameToPath(fileName), client);
	});

	return client.emit('broad', {
		channel: 'stdout',
		value: "" //"tail file " + fileName
	});
});


server.listen(4200);
