////////////////////////////////////////////////
//                                            //
// File:   Server.js                          //
// Type:   Host File                          //
// Author: Vladimir Hugec                     //
// Desc:   Will start a simple local server   //
//         for sending and recieving messages //
//                                            //
////////////////////////////////////////////////

const express = require('express');
const bodyParser = require('body-parser');
const loggingMiddleware = require('./middleware/logging');
const messagesRoutes = require('./routes/messages');
const groupsRoutes = require('./routes/groups');
const accountsRoutes = require('./routes/accounts');

const app = express();
const PORT = 3000;

//////////////////////
//    Middleware    //
//////////////////////

app.use(bodyParser.json());
app.use(loggingMiddleware.fileLoggingMiddleware);
// UNCOMMENT FOR LOGGING TO THE CONSOLE AS WELL AS FILE
// app.use(loggingMiddleware.consoleLoggingMiddleware);

//////////////////////
// Define Endpoints //
//////////////////////

app.use('/accounts', accountsRoutes);
app.use('/messages', messagesRoutes);
app.use('/groups', groupsRoutes);

// Starting the Server
app.listen(PORT, () => {
    console.log(`Server started on http://localhost:${PORT}`);
});
