"use strict";


const Logger = require('../util/logger.js').logger;
var dbobj = require('./Sql.js');
var society = require('./society.js');
var util = require('../util/util.js');
const { isNight12 } = require('../util/util.js');

var _this = module.exports = {

    getUserByEmailAndPass: function(email, pass, callback) {
        var query = `SELECT * FROM user_info WHERE email='${email}' and password='${pass}';`;
        Logger.info(`query to get user with email ${query}`);
        try{
            var connection = dbobj.getDBCon(true);
			connection.query(query, function(err,results){
				if(err) {
                    Logger.error(`error while getting data from user_info: ${err}`);
                    var resObj = { 'message' : 'failure','content':'We are unable to process your request, try later'}
                    callback(resObj);
                }
                var resObj = { 'message' : 'success', 'content': results}
                dbobj.closeDBCon(connection);
                callback(resObj);
			});
		}
		catch(err){
            Logger.error(`error while getting data from user_info: ${err}`);
			var resObj = { 'message' : 'failure','content':'We are unable to process your request, try later'}
            callback(resObj);
		}
    },
    getUserByEmail: function(email, callback) {
        var query = `SELECT * FROM user_info WHERE email='${email}';`;
        Logger.info(`query to get user with email ${query}`);
        try{
            var connection = dbobj.getDBCon(true);
			connection.query(query, function(err,results){
				if(err) {
                    Logger.error(`error while getting data from user_info: ${err}`);
                    var resObj = { 'message' : 'failure','content':'We are unable to process your request, try later'}
                    callback(resObj);
                }
                var resObj = { 'message' : 'success', 'content': results}
                dbobj.closeDBCon(connection);
                callback(resObj);
			});
		}
		catch(err){
            Logger.error(`error while getting data from user_info: ${err}`);
			var resObj = { 'message' : 'failure','content':'We are unable to process your request, try later'}
            callback(resObj);
		}
    },
    login: function(req, res) {

        _this.getUserByEmailAndPass(req.email, req.password, function(response){
            if(response.message === 'success'){
                if(response.content.length > 0){
                    var resF = {
                        "user": response.content
                    };
                    var resObj = { 'message' : 'success', 'content': resF};
                    res.writeHead(200, {'Content-Type': "application/json"});
                    res.end(JSON.stringify(resObj));
                }else{
                    res.writeHead(404, {'Content-Type': "application/json"});
                    res.end(JSON.stringify({'message': 'failure', 'content': 'user does not exist'}));
                }
            }else{
                res.writeHead(500, {'Content-Type': "application/json"});
                res.end(JSON.stringify(response));
            }
        });

    },
    getUserAndSocietyDetails: function(req, res) {

        _this.getUserByEmail(req.email, function(response){
            if(response.message === 'success'){
                if(response.content.length > 0){
                    if(response.content[0].groupID && response.content[0].groupID != 'NULL') {
                        society.getSocietyByUserId(response.content[0].groupID, function(societyResponse){
                            if(societyResponse.message === 'success'){
                                var resF = {
                                    "user": response.content,
                                    "society":societyResponse.content
                                };
                                var resObj = { 'message' : 'success', 'content': resF};
                                res.writeHead(200, {'Content-Type': "application/json"});
                                res.end(JSON.stringify(resObj));
                            }else{
                                res.writeHead(500, {'Content-Type': "application/json"});
                                res.end(JSON.stringify(societyResponse));
                            }
                        });
                    } else {
                        var resF = {
                            "user": response.content,
                            "society":[]
                        };
                        var resObj = { 'message' : 'success', 'content': resF};
                        res.writeHead(200, {'Content-Type': "application/json"});
                        res.end(JSON.stringify(resObj));
                    }
                    
                }else{
                    res.writeHead(404, {'Content-Type': "application/json"});
                    res.end(JSON.stringify({'message': 'failure', 'content': 'No data found'}));
                }
            }else{
                res.writeHead(500, {'Content-Type': "application/json"});
                res.end(JSON.stringify(response));
            }
        });

    },
    signup : function(req, res) {      
        try{
            var fields = ['firstname', 'lastname', 'email', 'mobilenumber', 'addressline1', 'addressline2', 'city', 'district', 'state', 'country','password'];
            var query = `INSERT INTO \`user_info\`(\`${fields.join('\`, \`')}\`) VALUES('${req.firstName}', '${req.lastName}', '${req.email}', '${req.mobileNumber}', '${req.addressLine1}', '${req.addressLine2}', '${req.city}', '${req.district}', '${req.state}', '${req.country}', '${req.password}');`;

            if(req.groupID){
                fields.push("groupID");
                query = `INSERT INTO \`user_info\`(\`${fields.join('\`, \`')}\`) VALUES('${req.firstName}', '${req.lastName}', '${req.email}', '${req.mobileNumber}', '${req.addressLine1}', '${req.addressLine2}', '${req.city}', '${req.district}', '${req.state}', '${req.country}', '${req.password}', '${req.groupID}');`;
            }
            Logger.info(`insert query : ${query}`);
			var connection = dbobj.getDBCon(true);
			connection.query(query, function(err,results){
				if(err) {
                    Logger.error(`error while inserting data into user_info: ${err}`);
                    var resObj = { 'message' : 'failure','content':err.message}
                    res.writeHead(500, {'Content-Type': "application/json"});
                    res.end(JSON.stringify(resObj));
                }
                var resObj = { 'message' : 'success'}
                dbobj.closeDBCon(connection);
                res.writeHead(200, {'Content-Type': "application/json"});
                res.end(JSON.stringify(resObj));
			});
		}
		catch(err){
            Logger.error(`error while inserting data into user_info: ${err}`);
			var resObj = { 'message' : 'failure','content':err.message}
            res.writeHead(500, {'Content-Type': "application/json"});
            res.end(JSON.stringify(resObj));
		}
    },
    listUsers: function(req, res) {
        var query = `select *  from user_info ;`;
        if(req.groupID){
            query = `select * from user_info where groupID = ${req.groupID};`;
        }
        Logger.info(`query to get user with groupid ${query}`);
        try{
            var resObj = {};
            var connection = dbobj.getDBCon(true);
			connection.query(query, function(err,results){
				if(err) {
                    Logger.error(`error while getting data from user_info: ${err}`);
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
    committeeMembers: function(req, res) {
        var query = `select *  from committee ;`;
        if(req.groupID){
            query = `select * from committee where groupID = ${req.groupID};`;
        }
        Logger.info(`query to get user with groupid ${query}`);
        try{
            var resObj = {};
            var connection = dbobj.getDBCon(true);
			connection.query(query, function(err,results){
				if(err) {
                    Logger.error(`error while getting data from committee: ${err}`);
                    resObj = { 'message' : 'failure','content':'We are unable to process your request, try later'};
                }
                resObj = { 'message' : 'success', 'content': results};
                dbobj.closeDBCon(connection);
                res.writeHead(200, {'Content-Type': "application/json"});
                res.end(JSON.stringify(resObj));
			});
		}
		catch(err){
            Logger.error(`error while getting data from committee: ${err}`);
			var resObj = { 'message' : 'failure','content':'We are unable to process your request, try later'};
            res.writeHead(500, {'Content-Type': "application/json"});
            res.end(JSON.stringify(resObj));
		}
    },
    updateRoleEspID: function(req, res) {
        var query = '';
        if(req.role && req.espId  && req.isActive){
            query = `UPDATE user_info SET role='${req.role}', espid='${req.espId}', isActive=${req.isActive} WHERE id=${req.id};`;
        }else if(req.role && req.espId){
            query = `UPDATE user_info SET role='${req.role}', espid='${req.espId}' WHERE id=${req.id};`;
        }else if(req.role){
            query = `UPDATE user_info SET role='${req.role}' WHERE id=${req.id};`;
        } else if(req.espId){
            query = `UPDATE user_info SET espid='${req.espId}' WHERE id=${req.id};`;
        }else if(req.isActive){
            query = `UPDATE user_info SET isActive=${req.isActive} WHERE id=${req.id};`;
        }
        Logger.info(`query to update user ${query}`);
        try{
            var resObj = {};
            var connection = dbobj.getDBCon(true);
			connection.query(query, function(err,results){
				if(err) {
                    Logger.error(`error while getting data from user_info: ${err}`);
                    resObj = { 'message' : 'failure','content':'We are unable to process your request, try later'};
                }
                if(req.espId){
                    connection.query('CREATE DATABASE IF NOT EXISTS jalrakshak_'+req.espId, function(e,r){
                        if(err) {
                            Logger.error(`error while getting data from user_info: ${err}`);
                            resObj = { 'message' : 'failure','content':'We are unable to process your request, try later'};
                        }
                        resObj = { 'message' : 'success', 'content': results};
                        dbobj.closeDBCon(connection);
                        res.writeHead(200, {'Content-Type': "application/json"});
                        res.end(JSON.stringify(resObj));
                    });
                }else{
                    resObj = { 'message' : 'success', 'content': results};
                    dbobj.closeDBCon(connection);
                    res.writeHead(200, {'Content-Type': "application/json"});
                    res.end(JSON.stringify(resObj));
                }
			});
		}
		catch(err){
            Logger.error(`error while getting data from user_info: ${err}`);
			var resObj = { 'message' : 'failure','content':'We are unable to process your request, try later'};
            res.writeHead(500, {'Content-Type': "application/json"});
            res.end(JSON.stringify(resObj));
		}
    },
    updateUser: function(req, res) {        
        var query =  `UPDATE user_info SET ${Object.keys(req).filter(v=> ['id'].indexOf(v) == -1).map(v=> v+`='${req[v]}'`).join(', ')} WHERE id=${req.id};`;
        Logger.info(`query to update user ${query}`);
        try{
            var resObj = {};
            var connection = dbobj.getDBCon(true);
			connection.query(query, function(err,results){
                resObj = { 'message' : 'success', 'content': results};
				if(err) {
                    Logger.error(`error while updating data from user_info: ${err}`);
                    resObj = { 'message' : 'failure','content': err.message};
                }
                dbobj.closeDBCon(connection);
                res.writeHead(200, {'Content-Type': "application/json"});
                res.end(JSON.stringify(resObj));
			});
		}
		catch(err){
            Logger.error(`error while updating data from user_info: ${err}`);
			var resObj = { 'message' : 'failure','content':err.message};
            res.writeHead(500, {'Content-Type': "application/json"});
            res.end(JSON.stringify(resObj));
		}
    },
    updaeCommitteMemberJob: function(req, res) {        
        var updateToMember = `DELETE FROM committee WHERE ${Object.keys(req).filter(v=> ['id','user_id', 'groupID', 'email', 'mobilenumber'].indexOf(v) == -1).map(v=> v+`='${req[v]}'`).join('AND ')} AND groupID=${req.groupID};`;
        Logger.info(`query to delete committee ${updateToMember}`);
        var query =  `INSERT INTO committee (${Object.keys(req).filter(v=> ['id'].indexOf(v) == -1).join(', ')}) VALUES (${Object.keys(req).filter(v=> ['id'].indexOf(v) == -1).map(v=> `'${req[v]}'`).join(', ')});`;
        Logger.info(`query to insert committee ${query}`);
        try{
            var resObj = {};
            var connection = dbobj.getDBCon(true);
            connection.query(updateToMember, function(err,results){
                resObj = { 'message' : 'success', 'content': results};
				if(err) {
                    Logger.error(`error while updating data from user_info: ${err}`);
                    resObj = { 'message' : 'failure','content': err.message, 'query': updateToMember};
                }
                connection.query(query, function(err,results){
                    resObj = { 'message' : 'success', 'content': results};
                    if(err) {
                        Logger.error(`error while updating data from user_info: ${err}`);
                        resObj = { 'message' : 'failure','content': err.message, 'query': query};
                    }
                    dbobj.closeDBCon(connection);
                    res.writeHead(200, {'Content-Type': "application/json"});
                    res.end(JSON.stringify(resObj));
                });
			});
			
		}
		catch(err){
            Logger.error(`error while updating data from user_info: ${err}`);
			var resObj = { 'message' : 'failure','content':err.message};
            res.writeHead(500, {'Content-Type': "application/json"});
            res.end(JSON.stringify(resObj));
		}
    },
    getDashboardMetrics: function(req, res){
        var query =  `select id, FLOW_RATE, max(TOTAL_LITERS) as TOTAL_LITERS, WATER_LEVEL, SV_STATE, last_updated from jalrakshak_${req.espId} where DATE(last_updated) = (select DATE(max(last_updated)) from jalrakshak_${req.espId}) GROUP BY CAST(last_updated AS DATE),id ORDER BY TOTAL_LITERS DESC limit 1;`;
        Logger.info(`query to select with espid ${query}`);
        try{
            var resObj = {};
            var connection = dbobj.getDBCon(true);
			connection.query(query, function(err,results){
				if(err) {
                    Logger.error(`error while select data: ${err}`);
                    resObj = { 'message' : 'failure','content':'We are unable to process your request, try later'};
                }
                resObj = { 'message' : 'success', 'content': results};
                dbobj.closeDBCon(connection);
                res.writeHead(200, {'Content-Type': "application/json"});
                res.end(JSON.stringify(resObj));
			});
		}
		catch(err){
            Logger.error(`error while updating data from user_info: ${err}`);
			var resObj = { 'message' : 'failure','content':'We are unable to process your request, try later'};
            res.writeHead(500, {'Content-Type': "application/json"});
            res.end(JSON.stringify(resObj));
		}
    },
    getGraphData: function(req, res){
        var query =  '';
        var isDashboard = false;
        if(req.period){
            isDashboard = true;
            //query =  `select * from jalrakshak_${req.espId} where last_updated >= NOW() + INTERVAL -30 MINUTE and last_updated <  NOW() + INTERVAL  0 MINUTE GROUP BY CAST(last_updated AS DATE),id;`;
            query = `SELECT u1.* FROM jalrakshak_${req.espId} u1 WHERE u1.last_updated >= (SELECT (MAX(u2.last_updated) + INTERVAL -30 MINUTE) FROM jalrakshak_${req.espId} u2) AND u1.last_updated <= (SELECT (MAX(u3.last_updated) + INTERVAL 0 MINUTE) FROM jalrakshak_${req.espId} u3);`;
        }else if(req.for){
            switch(parseInt(req.for)){
                case 5:
                    query = `
                    select TOTAL_LITERS, CONCAT(year, "-", month, "-", "01") AS last_updated from (
                        select sum(TOTAL_LITERS) as TOTAL_LITERS, YEAR(last_updated) as year, MONTH(last_updated) as month from
                        (SELECT max(TOTAL_LITERS) as TOTAL_LITERS,CAST(last_updated AS DATE) as last_updated,
                        CASE
                            WHEN TOTAL_LITERS > 0 THEN "TOTAL_LITERS is not zero"
                            WHEN TOTAL_LITERS = 0 THEN "TOTAL_LITERS is zero"
                            ELSE "TOTAL_LITERS is under 0"
                        END as zeroFlag
                        FROM jalrakshak_${req.espId} where last_updated >= '${req.start_date}' and last_updated <= '${req.end_date}'
                        GROUP BY zeroFlag,CAST(last_updated AS DATE)) a group BY YEAR(last_updated), MONTH(last_updated) ORDER BY YEAR(last_updated), MONTH(last_updated)) b;
                        `;
                    break;
                case 6:
                    query = `
                    select TOTAL_LITERS, CONCAT(year, "-", month, "-", "01") AS last_updated from (
                        select sum(TOTAL_LITERS) as TOTAL_LITERS, YEAR(last_updated) as year, MONTH(last_updated) as month from
                        (SELECT max(TOTAL_LITERS) as TOTAL_LITERS,CAST(last_updated AS DATE) as last_updated,
                        CASE
                            WHEN TOTAL_LITERS > 0 THEN "TOTAL_LITERS is not zero"
                            WHEN TOTAL_LITERS = 0 THEN "TOTAL_LITERS is zero"
                            ELSE "TOTAL_LITERS is under 0"
                        END as zeroFlag
                        FROM jalrakshak_${req.espId} where last_updated >= '${req.start_date}' and last_updated <= '${req.end_date}'
                        GROUP BY zeroFlag,CAST(last_updated AS DATE)) a group BY YEAR(last_updated), MONTH(last_updated) ORDER BY YEAR(last_updated), MONTH(last_updated)) b;
                        `;
                    break;
                default:
                    query = `
                    select sum(TOTAL_LITERS) as TOTAL_LITERS, last_updated from                
                    (SELECT max(TOTAL_LITERS) as TOTAL_LITERS,CAST(last_updated AS DATE) as last_updated,
                    CASE
                        WHEN TOTAL_LITERS > 0 THEN "TOTAL_LITERS is not zero"
                        WHEN TOTAL_LITERS = 0 THEN "TOTAL_LITERS is zero"
                        ELSE "TOTAL_LITERS is under 0"
                    END as zeroFlag
                    FROM jalrakshak_${req.espId} where last_updated >= '${req.start_date}' and last_updated <= '${req.end_date}'
                    GROUP BY zeroFlag,CAST(last_updated AS DATE)) a group BY last_updated order by last_updated;
                        `
                    break;
    
            }
        } else {


            query = `
                    select sum(TOTAL_LITERS) as TOTAL_LITERS, last_updated from                
                    (SELECT max(TOTAL_LITERS) as TOTAL_LITERS,CAST(last_updated AS DATE) as last_updated,
                    CASE
                        WHEN TOTAL_LITERS > 0 THEN "TOTAL_LITERS is not zero"
                        WHEN TOTAL_LITERS = 0 THEN "TOTAL_LITERS is zero"
                        ELSE "TOTAL_LITERS is under 0"
                    END as zeroFlag
                    FROM jalrakshak_${req.espId} where last_updated >= '${req.start_date}' and last_updated <= '${req.end_date}'
                    GROUP BY zeroFlag,CAST(last_updated AS DATE)) a group BY last_updated order by last_updated;
                        `;
        }
        Logger.info(`query to select with espid ${query}`);
        try{
            var resObj = {};
            var connection = dbobj.getDBCon(true);
			connection.query(query, function(err,results){
				if(err) {
                    Logger.error(`error while select data: ${err}`);
                    resObj = { 'message' : 'failure','content':'We are unable to process your request, try later'};
                }
                resObj = { 'message' : 'success', 'content': results};
                dbobj.closeDBCon(connection);
                res.writeHead(200, {'Content-Type': "application/json"});
                res.end(JSON.stringify(resObj));
			});
		}
		catch(err){
            Logger.error(`error while updating data from user_info: ${err}`);
			var resObj = { 'message' : 'failure','content':'We are unable to process your request, try later'};
            res.writeHead(500, {'Content-Type': "application/json"});
            res.end(JSON.stringify(resObj));
		}
    }
}