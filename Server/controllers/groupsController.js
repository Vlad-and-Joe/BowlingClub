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
exports.sendToGroup = (req, res) => {
    const { sender, group_id, message } = req.body;
    // Check if group exists
    db.get("SELECT id FROM groups WHERE id = ?", [group_id], (err, row) => {
        if(err)
            return res.status(500).json({ error: err.message });
        if(!row)
            return res.status(400).json({ error: "Group doesn't exist." });
        // Check if the group has members
        db.get("SELECT user_id FROM group_members WHERE group_id = ?", [group_id], (err, memberRow) => {
            if(err)
                return res.status(500).json({ error: err.message });
            if(!memberRow)
                return res.status(400).json({ error: "Group has no members." });
            // Send the message
            const stmt = db.prepare("INSERT INTO messages (sender, group_id, message) VALUES (?, ?, ?)");
            stmt.run(sender, group_id, message, (err) => {
                if(err)
                    return res.status(500).json({ error: err.message });
                res.json({ success: true, message_id: this.lastID });
            });
        });
    });
};

// Retrieve messages from a group
exports.getGroupMessages = (req, res) => {
    const { group_id } = req.query;
    db.all("SELECT * FROM messages WHERE group_id = ?", [group_id], (err, rows) => {
        if(err)
            return res.status(500).json({ error: err.message });
        res.json({ messages: rows });
    });
}

exports.createGroup = (req, res) => {
    const { group_name, recipients } = req.body;
    if (!recipients || recipients.length === 0)
        return res.status(400).json({ error: "You must specify at least one recipient." });

    // create the group
    db.serialize(() => {
        const stmtGroup = db.prepare("INSERT INTO groups (name) VALUES (?)");
        stmtGroup.run(group_name, function(err) {
            if (err)
                return res.status(500).json({ error: err.message });

            const groupId = this.lastID;

            // add members to the group
            const stmtMembers = db.prepare("INSERT INTO group_members (group_id, user_id) VALUES (?, ?)");
            recipients.forEach((recipient) => {
                stmtMembers.run(groupId, recipient, (err) => {
                    if (err)
                        console.error(err);
                });
            });

            stmtMembers.finalize();
            res.json({ success: true, group_id: groupId });
        });
    });
};


exports.listUserGroups = (req, res) => {
    const { user_id } = req.query;
    db.all("SELECT groups.id, groups.name FROM groups JOIN group_members ON groups.id = group_members.group_id WHERE group_members.user_id = ?", [user_id], (err, rows) => {
        if(err)
            return res.status(500).json({ error: err.message });
        res.json({ groups: rows });
    });
};

exports.removeUserFromGroup = (req, res) => {
    const { user_id, group_id } = req.body;
    const stmt = db.prepare("DELETE FROM group_members WHERE user_id = ? AND group_id = ?");
    stmt.run(user_id, group_id, (err) => {
        if(err)
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
    const { group_id } = req.query;
    db.all("SELECT user_id FROM group_members WHERE group_id = ?", [group_id], (err, rows) => {
        if(err)
            return res.status(500).json({ error: err.message });
        res.json({ members: rows });
    });
};
