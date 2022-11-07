"use strict";
const http = require('http');
const connect = require('connect');
const config = require('./server/config.json');
const router = require('./server/router.js');
const mqtt_Consumer = require('./server/MQTTConsumer.js');
const Logger = require('./util/logger.js').logger;
var cors = require('cors')
require('./executesql.js');


const app = connect();
const httpApp = http.createServer()

var cookieSession = require('cookie-session');
app.use(cors())
app.use(cookieSession({
    keys: ['jal', 'rakshak']
}));

app.use(function onerror(err, req, res, next) {
    Logger.error(`Error Message : ${err}`);
});

var localPath = __dirname + '/public/'

 app.use(function(req, res){ 
    //route the request and response
    router.userRouter(req, res, localPath);

});

var httpapp = http.createServer(app).listen(config.jalrakshak.server.port);

mqtt_Consumer.consume();

process.on('uncaughtException', function (err) {
    Logger.error(`Error Message : ${err}`);
});
console.log( 'server started on port ', config.jalrakshak.server.port);
Logger.info(`server started on port:  ${config.jalrakshak.server.port}`);

module.exports = app;