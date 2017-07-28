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
            timestamp: function() {
                return Date.now();
            },
            formatter: function(options) {
                // Return string will be passed to logger.
                return options.timestamp() + ' ' + options.level.toUpperCase() + ' ' + (options.message ? options.message : '') +
                    (options.meta && Object.keys(options.meta).length ? '\n\t' + JSON.stringify(options.meta) : '');
            }
        }),
        new(require('winston-daily-rotate-file'))({
            colorize: true,
            filename: './logs/-results.log',
            timestamp: tsFormat,
            datePattern: 'yyyy-MM-dd',
            prepend: true,
            level: env === 'development' ? 'verbose' : 'info',
            handleExceptions: true,
            humanReadableUnhandledException: true
        })
    ]
});

exports.logger = logger;