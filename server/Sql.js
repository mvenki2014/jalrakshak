"use strict";
var mysql = require('mysql');
var config = require("./config.json");
const Logger = require('../util/logger.js').logger;

var _this = module.exports = {
	getDBCon:function(){
		var connection = mysql.createConnection(config.jalrakshak.mysql);	
		
		 connection.on('error', function(err) {
		    Logger.error(`db error: ${err}`);
		    if(err.code === 'PROTOCOL_CONNECTION_LOST')
		    { 
		      connection = mysql.createConnection(config.jalrakshak.mysql); 
  			  connection.connect(function(err) {
  			  	if(err) Logger.error(`db error: ${err}`);
  			  	Logger.info("connection re-established successfully..");
  			  });
		    }
		}); 
		return connection;
	},
	closeDBCon:function(connection){
		connection.end();
	},
	createTableIfNotExists: function(database, tablename, dbobj){
		try{
			var connection = dbobj.getDBCon();
			var querystring = "";
			
			querystring = "CREATE TABLE IF NOT EXISTS "+database+"."+tablename + "(" +
			"id int not null auto_increment, FLOW_RATE float, TOTAL_LITERS float, WATER_LEVEL int, SV_STATE int, primary key(id), last_updated timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP)";
			connection.query(querystring, function(err,rows){
				
				if(err){
		    		Logger.error(`db error: ${err}`);
					return;
				}

				dbobj.closeDBCon(connection);
  			  //	Logger.info(`Table created successfully ${rows.affectedRows}`);
			});
		}
		catch(exce){
		    Logger.error(`db error: ${err}`);
		}
	},
	insertInToMQTTMetrics: function(database, tablename, values, dbobj){
		try{
			var connection = dbobj.getDBCon();
			var querystring = "";
			
			querystring = "INSERT INTO "+database+"."+tablename+" (FLOW_RATE, TOTAL_LITERS, WATER_LEVEL, SV_STATE) VALUES ("+
				values.join(" , ")+ ")";
			connection.query(querystring, function(err,rows){
				
				if(err){
		    		Logger.error(`db error: ${err}`);
					return;
				}

				dbobj.closeDBCon(connection);
  			  	//Logger.info(`Number of records inserted: ${rows.affectedRows}`);
			});
		}
		catch(exce){
		    Logger.error(`db error: ${err}`);
		}
	}
}