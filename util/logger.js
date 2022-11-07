"use strict";

const winston = require('winston');
const winstonRotator = require('winston-daily-rotate-file');
const config = require("../server/config.json");



var logger = new winston.createLogger({
  transports: [
    new (winston.transports.DailyRotateFile)({
      name: 'access-file',
      level: 'info',
      filename: config.jalrakshak.logDirs.success,
      json: true,
      datePattern: 'yyyy-MM-DD',
      prepend: true,
      maxFiles: 10
    }),
    new (winston.transports.DailyRotateFile)({
      name: 'error-file',
      level: 'error',
      filename:  config.jalrakshak.logDirs.error,
      json: true,
      datePattern: 'yyyy-MM-DD',
      prepend: true,
      maxFiles: 10
    })
  ]
});


module.exports = {
  logger
};