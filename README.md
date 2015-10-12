watch-log-files -- Web view to monitor log files using node.
==============================
A combination of expressJS + socket.io to create logs interface.
The logs are being Tailed (node-tail) at runtime using socket.io.

## Installation
**You need NodeJS + NPM to run this program.**

```sh
git clone https://github.com/TomerAvni/watch-log-files.git
npm install
```
## Configuration
All configurations (users, log-files to watch) are defined on the conf.json file.
The file is be re-loaded every time a login is being called (so a simple update of the file will update the servers.. no need to **Restart** if changed.)
For the simple example:
	User: 1, Password: 1

## Running
You need to run both socket.io && ExpressJS servers:
```sh
node server.js // socket.io
node app.js // actual app.
```

## Notes
* Session and user managmenet can be moved to a more flexable auth system (such as passport).
* The files to be logged are being defined on the conf.json file, make sure to define the full path (which the server actually logs - for security reasons).
* No tests have been written.. super important:).