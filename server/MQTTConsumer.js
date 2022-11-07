"use strict";
const mqtt = require('mqtt')
var config = require('./config.json');
var sql = require('./Sql.js');
const Logger = require('../util/logger.js').logger;

const mqttConfig = config.jalrakshak.mqtt;

const host = mqttConfig.server.host;
const port = mqttConfig.server.port;
const clientId = `mqtt_${Math.random().toString(16).slice(3)}`;

const connectUrl = `mqtt://${host}:${port}`;
const topic = mqttConfig.topic;
const payloadKeys = mqttConfig.payloadKeys;

var _this = module.exports = {
	consume: function(){
		const client = mqtt.connect(connectUrl, {
		  clientId,
		  clean: mqttConfig.server.clean,
		  connectTimeout: mqttConfig.server.connectTimeout,
		  username: mqttConfig.server.user,
		  password: mqttConfig.server.password,
		  reconnectPeriod: mqttConfig.server.reconnectPeriod,
		});
		
		client.on('connect', () => {
		  Logger.info(`MQTT connected`);
		  client.subscribe(topic, () => {
		  	Logger.info(`Subscribe to topic '${topic}'`);
		  });
		});

		client.on('message', (topic, payload) => {
		  insertData(topic,JSON.parse(payload.toString()));
		});

		client.on("error",function(error){
    		Logger.error(`Error Message : ${error}`);
		});
	}
};

function insertData(topic, obj){
	var esp = Object.keys(obj);
	var db = config.jalrakshak.mysql.database;
	var tableName = "jalrakshak_"+esp[0];
	var payloadKeys = config.jalrakshak.mqtt.payloadKeys;
	sql.createTableIfNotExists(db, tableName, sql);
	sql.insertInToMQTTMetrics(db, tableName, payloadKeys.map(v=> obj[esp[0]][v]), sql);
}

