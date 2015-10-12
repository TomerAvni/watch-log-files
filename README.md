watch-log-files -- Web view to monitor log files using node.
==============================
A combination of expressJS + sockets.io to create logs interface.
The logs are being Tailed (node-tail) at runtime using socket.io.

## Installation
**You need NodeJS + NPM to run this program.**

```sh
git clone https://github.com/TomerAvni/watch-log-files.git
npm install
node server.js
node app.js

```

## Notes
* Log in is implemented hard coded, but very easyly some auth system can be integrated.
* The files to be logged are being defined on the html (index.html). It is not recommended to not filter these request from the server.. 
* No tests have been written.. super importannt:).