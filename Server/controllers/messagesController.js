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

exports.sendMessage = (req, res) => {
    const { sender_id, recipient_id, message } = req.body;

    // Check if the sender and recipient accounts exist
    db.all('SELECT id FROM accounts WHERE id IN (?, ?)', [sender_id, recipient_id], (err, rows) => {
        if (err)
            return res.status(500).json({ error: err.message });
        if (rows.length !== 2)
            return res.status(400).json({ error: 'Invalid sender or recipient id' });

        const stmt = db.prepare("INSERT INTO messages (sender_id, recipient_id, message) VALUES (?, ?, ?)");
        stmt.run(sender_id, recipient_id, message, (err) => {
            if (err)
                return res.status(500).json({ error: err.message });
            res.json({ success: true });
        });
    });
};


exports.retrieveMessages = (req, res) => {
    const recipientId = req.query.recipient_id;

    if (!recipientId)
        return res.status(400).json({ error: 'Recipient ID is required' });

    // Retrieve all messages sent to the specified recipient
    db.all('SELECT * FROM messages WHERE recipient_id = ?', [recipientId], (err, rows) => {
        if (err)
            return res.status(500).json({ error: err.message });
        res.json({ messages: rows });
    });
};

