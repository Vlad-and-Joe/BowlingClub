////////////////////////////////////////////////
//                                            //
// File:   groupsController.js                //
// Type:   module                             //
// Author: Vladimir Hugec                     //
// Desc:   Implements the routes for          //
//         group messages as defined in:      //
//         /routes/groups.js                  //
//                                            //
////////////////////////////////////////////////

const db = require('../models/db');

// Send a message to a group
exports.sendMessageToGroup = (req, res) => {
    const { sender_id, group_id, message } = req.body;
    const stmt = db.prepare("INSERT INTO group_messages (sender_id, group_id, message) VALUES (?, ?, ?)");
    stmt.run(sender_id, group_id, message, (err) => {
        if (err)
            return res.status(500).json({ error: err.message });
        res.json({ success: true });
    });
};


exports.getMessagesForGroup = (req, res) => {
    const group_id = req.query.group_id;
    const sql = `
        SELECT gm.id, a.id as sender_id, a.name AS sender_name, gm.message
        FROM group_messages gm
        JOIN accounts a ON gm.sender_id = a.id
        WHERE gm.group_id = ?`;
    db.all(sql, [group_id], (err, rows) => {
        if (err)
            return res.status(500).json({ error: err.message });
        res.json(rows);
    });
};


exports.createGroup = (req, res) => {
    const { creator_id, group_name, recipient_ids } = req.body;

    if (!group_name || !creator_id || !Array.isArray(recipient_ids))
        return res.status(400).json({ error: 'Invalid request body' });

    // Check if creator and all recipients are valid accounts
    const allIds = [creator_id, ...recipient_ids];
    const placeholders = allIds.map(() => '?').join(', ');

    db.all(`SELECT id FROM accounts WHERE id IN (${placeholders})`, allIds, (err, rows) => {
        if (err)
            return res.status(500).json({ error: err.message });
        if (rows.length !== allIds.length)
            return res.status(400).json({ error: 'Invalid account id(s)' });
        // Insert the new group
        const stmt = db.prepare("INSERT INTO groups (group_name, creator_id) VALUES (?, ?)");
        stmt.run(group_name, creator_id, function(err) {
            if (err)
                return res.status(500).json({ error: err.message });

            const groupId = this.lastID;
            // Insert the creator and all recipients into the group_members table
            const groupMemberValues = allIds.map(id => `(${groupId}, ${id})`).join(', ');
            db.run(`INSERT INTO group_members (group_id, user_id) VALUES ${groupMemberValues}`, [], function(err) {
                if (err)
                    return res.status(500).json({ error: err.message });
                res.json({ success: true, groupId });
            });
        });
    });
};




exports.listUserGroups = (req, res) => {
    const user_id = req.query.user_id;
    const sql = `
        SELECT g.id, g.name
        FROM groups g
        JOIN group_members gm ON g.id = gm.group_id
        WHERE gm.user_id = ?`;
    db.all(sql, [user_id], (err, rows) => {
        if (err)
            return res.status(500).json({ error: err.message });
        res.json(rows);
    });
};


exports.removeUserFromGroup = (req, res) => {
    const { user_id, group_id } = req.body;
    const stmt = db.prepare("DELETE FROM group_members WHERE user_id=? AND group_id=?");
    stmt.run(user_id, group_id, (err) => {
        if (err)
            return res.status(500).json({ error: err.message });
        res.json({ success: true });
    });
};


exports.deleteGroup = (req, res) => {
    const { group_id } = req.body;
    const stmt = db.prepare("DELETE FROM groups WHERE id = ?");
    stmt.run(group_id, (err) => {
        if(err)
            return res.status(500).json({ error: err.message });
        res.json({ success: true });
    });
};

exports.listGroupMembers = (req, res) => {
    const group_id = req.query.group_id;
    const sql = `
        SELECT a.id, a.name
        FROM accounts a
        JOIN group_members gm ON a.id = gm.user_id
        WHERE gm.group_id = ?`;
    db.all(sql, [group_id], (err, rows) => {
        if (err)
            return res.status(500).json({ error: err.message });
        res.json(rows);
    });
};

