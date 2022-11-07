"use strict";
var fs = require('fs');
var url = require('url');
var path = require('path');
var config = require('./config.json');
var qs = require("qs");
var mime = require("mime");
var user = require('./user');
var society = require('./society');
const Logger = require('../util/logger.js').logger;

var morgan = require("morgan");
var logger = morgan('common');
var validExtensions = {
	"" : "text/html",
	".html" : "text/html",	
	".js": "application/javascript",
	".css": "text/css",
	".txt": "text/plain",
	".jpeg": "image/jpeg",
	".JPEG": "image/JPEG",
	".jpg": "image/jpg",
	".JPG": "image/JPG",
	".gif": "image/gif",
	".GIF": "image/GIF",
	".png": "image/png",
	".swf": "application/x-shockwave-flash",
	".PNG": "image/PNG",
	".pdf": "application/pdf",
	".ico": "image/vnd.microsoft.icon",
	
	".svg"  : "image/svg+xml",
	".ttf"   : "application/x-font-truetype", //"application/x-font-ttf", //
	".otf"   : "apllication/font-sfnt", //"apllication/font-sfnt" , "application/x-font-opentype"
	".woff"  : "application/font-woff",
	".woff2" : "application/font-woff2",
	".eot"   :  "application/vnd.ms-fontobject", //"application/vnd.ms-fontobject",
	".sfnt"  : "application/font-sfnt",
	".map" : "application/octet-stream"
	
	/*
	".svg"  : mime.lookup(".svg"),
	".ttf"   : mime.lookup(".ttf"),
	".otf"   : mime.lookup(".otf"),
	".woff"  : mime.lookup(".woff"),
	".woff2" : mime.lookup(".woff2"),
	".eot"   :  mime.lookup(".eot"),
	".sfnt"  : mime.lookup(".sfnt")
	*/
};


function processPost(request, response, f){
	var body = '';
	request.on('data', function(data) {
		body += data;
	});
	request.on('end', function() {
		Logger.info('request Body: ' + body);
		f(JSON.parse(body), response);
	});
	request.on('error', function (e) {
	   Logger.error(e);
	   response.writeHead(500, {'Content-Type': "text/html"});
	   response.end(JSON.stringify(e));
	});
	request.on('timeout', function () {			
		Logger.error('timeout');
		response.writeHead(500, {'Content-Type': "text/html"});
		response.end(JSON.stringify(e));
	});
}

exports.userRouter = function userRouter(request, response, localPath){
	var urlString = url.parse(request.url, true);
	switch(urlString.pathname) {
		case "/login":
			processPost(request, response, user.login);
			break;
		case "/signup":
			processPost(request, response, user.signup);			
			break;
		case "/register_society":
			processPost(request, response, society.register);			
			break;
		case "/get_user_and_society_details":
			user.getUserAndSocietyDetails(urlString.query, response);			
			break;
		case "/list_users":
			user.listUsers(urlString.query, response);			
			break;
		case "/list_society":
			society.listSociety(urlString.query, response);			
			break;
		case "/update_role_espid":
			processPost(request, response, user.updateRoleEspID);
			break;
		case "/update_society":
			processPost(request, response, society.updateSociety);
			break;
		case "/update_user":
			processPost(request, response, user.updateUser);
			break;
		case "/update_committee":
			processPost(request, response, user.updaeCommitteMemberJob);
			break;
		case "/committee_members":
			user.committeeMembers(urlString.query, response);
			break;
		case "/get_dashbooard_metrics":
			user.getDashboardMetrics(urlString.query, response);
			break;
		case "/get_graph_data":
			user.getGraphData(urlString.query, response);
			break;
		default:
			let info_str = {'message':'failure', 'content': 'url not found'};
			response.writeHead(404, {'Content-Type': "text/html"});
			response.end(JSON.stringify(info_str));
			break;
	};
};