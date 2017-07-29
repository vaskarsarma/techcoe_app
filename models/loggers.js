// Module for logging request/response
const winston = require('winston');
const fs = require("fs");

const logDir = 'logs';
const env = process.env.NODE_ENV || 'development';

// Create the log directory if it does not exist
if (!fs.existsSync(logDir)) {
    fs.mkdirSync(logDir);
}

const tsFormat = () => (new Date()).toUTCString();

const logger = new(winston.Logger)({
    exitOnError: false,
    transports: [
        // colorize the output to the console
        // new
        new(winston.transports.Console)({
            colorize: true,
            level: 'debug',
            handleExceptions: true,
            json: false,
            colorize: true
        }),
        new(require('winston-daily-rotate-file'))({
            colorize: true,
            filename: './logs/-results.log',
            timestamp: tsFormat,
            datePattern: 'yyyy-MM-dd',
            prepend: true,
            json: true,
            maxsize: 5242880, //5MB
            maxfiles: 5,
            level: env === 'development' ? 'verbose' : 'info',
            handleExceptions: true,
            humanReadableUnhandledException: true
        })
    ]
});

exports.logger = logger;

exports.stream = {
    write: function(message, encoding) {
        logger.info(message);
    }
};