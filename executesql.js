"use strict";
var mysql = require('mysql');
var fs = require('fs');
var readline = require('readline');
var config = require('./server/config.json');
var dbConfig = config.jalrakshak.mysql;
var sqlFile = __dirname + '/jalrakshak.sql';
    
var myCon = mysql.createConnection(dbConfig);
var rl = readline.createInterface({
    input: fs.createReadStream(sqlFile),
    terminal: false
    });
rl.on('line', function(chunk){
    myCon.query(chunk.toString('ascii'), function(err, sets, fields){
        if(err) console.log(err);
    });
});
rl.on('close', function(){
    console.log("finished");
    myCon.end();
});