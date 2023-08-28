////////////////////////////////////////////////
//                                            //
// File:   accountsController.js              //
// Type:   module                             //
// Author: Vladimir Hugec                     //
// Desc:   Implements the routes for accounts //
//         as described in routes/accounts.js //
//                                            //
////////////////////////////////////////////////

const db = require('../models/db');
const crypto = require('crypto');

exports.createAccount = (req, res) => {
    const { name, email, password } = req.body;

    // Check if an account with the provided email already exists
    db.get('SELECT * FROM accounts WHERE email = ?', [email], (err, row) => {
        if (err)
            return res.status(500).json({ error: err.message });
        if (row)
            return res.status(400).json({ error: 'An account with this email already exists' });

        // Hash the password before storing
        const hashedPassword = crypto.createHash('sha256').update(password).digest('hex');
        const stmt = db.prepare("INSERT INTO accounts (name, email, password) VALUES (?, ?, ?)");
        stmt.run(name, email, hashedPassword, function(err) {
            if (err)
                return res.status(500).json({ error: err.message });
            const accountId = this.lastID;
            res.json({ success: true, id: accountId });
        });
    });
};

exports.updateAccount = (req, res) => {
    const { user_id, name, email, password } = req.body;
    crypto.hash(password, 10, (err, hashedPassword) => {
        if(err)
            return res.status(500).json({ error: err.message });
        const stmt = db.prepare("UPDATE accounts SET name=?, email=?, password=? WHERE id=?");
        stmt.run(name, email, hashedPassword, user_id, (err) => {
            if(err)
                return res.status(500).json({ error: err.message });
            res.json({ success: true });
        });
    });
};

exports.deleteAccount = (req, res) => {
    const { user_id } = req.body;
    const stmt = db.prepare("DELETE FROM accounts WHERE id=?");
    stmt.run(user_id, (err) => {
        if(err)
            return res.status(500).json({ error: err.message });
        res.json({ success: true });
    });
};