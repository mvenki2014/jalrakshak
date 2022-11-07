"use strict";

const Logger = require('../util/logger.js').logger;
var dbobj = require('./Sql.js');

var _this = module.exports = {

    getSocietyByUserId: function(userId, callback) {
        var query = `SELECT * FROM society_info WHERE id='${userId}';`;
        Logger.info(`query to get user with email ${query}`);
        try{
            var connection = dbobj.getDBCon(true);
			connection.query(query, function(err,results){
				if(err) {
                    Logger.error(`error while getting data from society_info: ${err}`);
                    var resObj = { 'message' : 'failure','content':'We are unable to process your request, try later'}
                    callback(resObj);
                }
                var resObj = { 'message' : 'success', 'content': results}
                dbobj.closeDBCon(connection);
                callback(resObj);
			});
		}
		catch(err){
            Logger.error(`error while getting data from society_info: ${err}`);
			var resObj = { 'message' : 'failure','content':'We are unable to process your request, try later'}
            callback(resObj);
		}
    },
    register : function(req, res) {   
        var resObj = { 'message' : 'success'};   
        try{
            var fields = ['societyName', 'email', 'mobilenumber', 'addressline1', 'addressline2', 'city', 'district', 'state', 'country', 'createdBy'];
            var query = `INSERT INTO \`society_info\`(\`${fields.join('\`, \`')}\`) VALUES('${req.societyName}', '${req.email}', '${req.mobileNumber}', '${req.addressLine1}', '${req.addressLine2}', '${req.city}', '${req.district}', '${req.state}', '${req.country}', '${req.createdBy}');`;

            Logger.info(`insert query : ${query}`);
			var connection = dbobj.getDBCon(true);
			connection.query(query, function(err,results){
				if(err) {
                    Logger.error(`error while inserting data into society_info: ${err}`);
                    resObj = { 'message' : 'failure','content':err.message}
                    res.writeHead(500, {'Content-Type': "application/json"});
                    res.end(JSON.stringify(resObj));
                }
                dbobj.closeDBCon(connection);
                _this.updateUserColumnValue("groupID", parseInt(results.insertId), req.createdBy, function(userRes){
                    if(userRes.message === 'success'){
                        res.writeHead(200, {'Content-Type': "application/json"});
                        res.end(JSON.stringify(resObj));
                    }else{
                        resObj = userRes;
                        res.writeHead(500, {'Content-Type': "application/json"});
                        res.end(JSON.stringify(resObj));
                    }
                })
			});
		}
		catch(err){
            Logger.error(`error while inserting data into society_info: ${err}`);
			resObj = { 'message' : 'failure','content':'We are unable to process your request, try later'}
            res.writeHead(500, {'Content-Type': "application/json"});
            res.end(JSON.stringify(resObj));
		}
    },
    updateUserColumnValue: function(column, value, id, callback) {
        try{
            var query = `UPDATE \`user_info\` SET \`${column}\` = '${value}' , \`role\` = 'admin' WHERE id = '${id}';`;

            Logger.info(`update query : ${query}`);
			var connection = dbobj.getDBCon(true);
			connection.query(query, function(err,results){
                var resObj = { 'message' : 'success'}
				if(err) {
                    Logger.error(`error while updating data into user_info: ${err}`);
                    resObj = { 'message' : 'failure','content':err.message};
                }
                dbobj.closeDBCon(connection);
                callback(resObj);
			});
		}
		catch(err){
            Logger.error(`error while inserting data into user_info: ${err}`);
			var resObj = { 'message' : 'failure','content':err.message}
            callback(resObj);
		}
    },
    listSociety: function(req, res) {
        var query = `SELECT * FROM society_info;`;
        if(req.id){
            query = `SELECT * FROM society_info WHERE createdBy='${req.id}';`;
        }
        Logger.info(`query to get user with groupid ${query}`);
        try{
            var resObj = {};
            var connection = dbobj.getDBCon(true);
			connection.query(query, function(err,results){
				if(err) {
                    Logger.error(`error while getting data from society_info: ${err}`);
                    resObj = { 'message' : 'failure','content':'We are unable to process your request, try later'};
                }
                resObj = { 'message' : 'success', 'content': results};
                dbobj.closeDBCon(connection);
                res.writeHead(200, {'Content-Type': "application/json"});
                res.end(JSON.stringify(resObj));
			});
		}
		catch(err){
            Logger.error(`error while getting data from user_info: ${err}`);
			var resObj = { 'message' : 'failure','content':'We are unable to process your request, try later'};
            res.writeHead(500, {'Content-Type': "application/json"});
            res.end(JSON.stringify(resObj));
		}
    },
    updateSociety: function(req, res) {
        var query =  `UPDATE society_info SET ${Object.keys(req).filter(v=> ['id'].indexOf(v) == -1).map(v=> v+`='${req[v]}'`).join(', ')} WHERE id=${req.id};`;
        Logger.info(`query to update user ${query}`);
        try{
            var resObj = {};
            var connection = dbobj.getDBCon(true);
			connection.query(query, function(err,results){
                resObj = { 'message' : 'success', 'content': results};
				if(err) {
                    Logger.error(`error while updating data from society_info: ${err}`);
                    resObj = { 'message' : 'failure','content': err.message};
                }
                dbobj.closeDBCon(connection);
                res.writeHead(200, {'Content-Type': "application/json"});
                res.end(JSON.stringify(resObj));
			});
		}
		catch(err){
            Logger.error(`error while updating data from society_info: ${err}`);
			var resObj = { 'message' : 'failure','content': err.message};
            res.writeHead(500, {'Content-Type': "application/json"});
            res.end(JSON.stringify(resObj));
		}
    }

};