////////////////////////////////////////////////
// File:   Server.js                          //
// Author: Vladimir Hugec                     //
// Desc:   Will start a simple local server   //
//         for sending and recieving messages //
////////////////////////////////////////////////

const express = require('express');
const bodyParser = require('body-parser');
const sqlite3 = require('sqlite3').verbose();

const app = express();
const PORT = 3000;

// Middleware to parse JSON bodies
app.use(bodyParser.json());

// Setting Up SQLite Database
const db = new sqlite3.Database('./messages.db');
db.run("CREATE TABLE IF NOT EXISTS messages (id INTEGER PRIMARY KEY, sender TEXT, recipient TEXT, message TEXT, timestamp DATETIME DEFAULT CURRENT_TIMESTAMP)");

//////////////////////
// Define Endpoints //
//////////////////////

// Define root endpoint (for testing)
app.get('/', (req, res) => {
    res.send('Joey Sucks!');
});

// Define endpoint to send a message
app.post('/send', (req, res) => {
    const {sender, recipient, message} = req.body;
    const stmt = db.prepare("INSERT INTO messages (sender, recipient, message) VALUES (?, ?, ?)");
    stmt.run(sender, recipient, message, (err) => {
        if(err)
            return res.status(500).json({error: err.message});
        res.json({success: true, messageID: this.lastID});
    });
});

// Endpoint to retrieve messages
app.get('/messages', (req, res) => {
    const {recipient} = req.query;
    db.all("SELECT * FROM messages WHERE recipient = ?", [recipient], (err, rows) => {
        if(err)
            return res.status(500).json({error: err.message});
        res.json({messages: rows});
    });
});

// Starting the Server
app.listen(PORT, () => {
    console.log(`Server started on http://localhost:${PORT}`);
});
