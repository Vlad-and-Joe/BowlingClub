////////////////////////////////////////////////
//                                            //
// File:   messagesController.js              //
// Type:   module                             //
// Author: Vladimir Hugec                     //
// Desc:   Implements the routes for single   //
//         messages as defined in:            //
//         /routes/messages.js                //
//                                            //
////////////////////////////////////////////////

const db = require('../models/db');

// Send a message
exports.send = (req, res) => {
    const { sender, recipient, message } = req.body;
    const stmt = db.prepare("INSERT INTO messages (sender, recipient, message) VALUES (?, ?, ?)");
    stmt.run(sender, recipient, message, (err) => {
        if(err)
            return res.status(500).json({ error: err.message });
        res.json({ success: true, messageID: this.lastID });
    });
}

// Retrieve messages for a recipient
exports.getAll = (req, res) => {
    const { recipient } = req.query;
    db.all("SELECT * FROM messages WHERE recipient = ?", [recipient], (err, rows) => {
        if(err)
            return res.status(500).json({ error: err.message });
        res.json({ messages: rows });
    });
}
