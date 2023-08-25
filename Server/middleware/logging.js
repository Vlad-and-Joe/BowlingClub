////////////////////////////////////////////////
//                                            //
// File:   logging.js                         //
// Type:   module                             //
// Author: Vladimir Hugec                     //
// Desc:   Uses morgan logging library,       //
//         provides automatic log rotation,   //
//         and standardized log formats       //
//                                            //
////////////////////////////////////////////////

const morgan = require('morgan');
const rfs = require('rotating-file-stream');
const path = require('path');

// Create a rotating write stream
const accessLogStream = rfs.createStream('request.log', {
    interval: '1d',  // Rotate daily
    path: path.join(__dirname, '../logs')  // Save logs to a 'logs' directory in Server folder
});

// Setup morgan to use the rotating file stream and combined log format
const loggingMiddleware = morgan('combined', {stream: accessLogStream});

module.exports = loggingMiddleware;